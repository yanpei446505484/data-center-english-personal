import { generateKokoroWav, isKokoroModelReady } from '@/lib/kokoroRuntime'

export type Accent = 'british' | 'american'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export interface SpeakOptions {
  accent?: Accent
  language?: 'en' | 'zh'
  speed?: number
  repeat?: number
  onPreparing?: (needsModelDownload: boolean) => void
  onStart?: () => void
  onFinish?: (reason: 'ended' | 'stopped' | 'error') => void
}

export interface AudioSelfTestResult {
  accent: Accent
  bytes: number
  riff: boolean
  wave: boolean
  decodable: boolean
}

interface StaticAudioManifest {
  version: number
  engine: string
  baseSpeed: number
  items: Record<string, string | { path: string; start: number; duration: number }>
}

interface StaticAudioClip {
  data: ArrayBuffer
  path: string
  baseSpeed: number
  start: number
  duration?: number
}

const GENERATED_AUDIO_CACHE = 'dc-english-generated-audio-v1'

/** Stable, short cache id for locally generated speech. */
export function generatedAudioCacheId(value: string): string {
  let first = 0x811c9dc5
  let second = 0x9e3779b9
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    first = Math.imul(first ^ code, 0x01000193) >>> 0
    second = Math.imul(second ^ (code + index), 0x85ebca6b) >>> 0
  }
  return `${first.toString(16).padStart(8, '0')}${second.toString(16).padStart(8, '0')}`
}

function assetUrl(path: string): string {
  return new URL(path, document.baseURI).href
}

export function isWavBuffer(value: ArrayBuffer): boolean {
  if (value.byteLength < 12) return false
  const bytes = new Uint8Array(value, 0, 12)
  const text = String.fromCharCode(...bytes)
  return text.startsWith('RIFF') && text.slice(8, 12) === 'WAVE'
}

class KokoroAudioEngine {
  private context: AudioContext | null = null
  private source: AudioBufferSourceNode | null = null
  private finish: SpeakOptions['onFinish'] | null = null
  private stopped = false
  private generation = 0
  private manifest: StaticAudioManifest | null = null
  private manifestPromise: Promise<StaticAudioManifest> | null = null
  private decodedCache = new Map<string, AudioBuffer>()
  private generatedWavCache = new Map<string, ArrayBuffer>()
  private generatedWavPromises = new Map<string, Promise<ArrayBuffer>>()

  preload(): Promise<void> {
    return this.loadManifest().then(() => undefined)
  }

  async prepare(texts: string[], options: SpeakOptions = {}): Promise<void> {
    const voice = options.language === 'zh'
      ? 'zh'
      : options.accent === 'american' ? 'en/en-us' : 'en/en-rp'
    for (const sourceText of texts) {
      const text = sourceText.trim()
      if (!text) continue
      const staticAudio = await this.loadStaticAudio(text, voice)
      if (staticAudio || options.language === 'zh') continue
      await this.loadGeneratedAudio(text, options)
    }
  }

  private generatedKey(text: string, options: SpeakOptions): string {
    const accent = options.accent === 'american' ? 'american' : 'british'
    const speed = Math.max(.65, Math.min(1.45, (options.speed ?? 145) / 145))
    return `${accent}\0${speed.toFixed(3)}\0${text}`
  }

  private generatedCacheRequest(key: string): Request {
    return new Request(assetUrl(`.local-tts/${generatedAudioCacheId(key)}.wav`))
  }

  private async loadPersistedGeneratedAudio(key: string): Promise<ArrayBuffer | null> {
    if (!('caches' in window)) return null
    try {
      const cache = await caches.open(GENERATED_AUDIO_CACHE)
      const response = await cache.match(this.generatedCacheRequest(key))
      if (!response) return null
      const wav = await response.arrayBuffer()
      if (!isWavBuffer(wav)) {
        await cache.delete(this.generatedCacheRequest(key))
        return null
      }
      return wav
    } catch {
      // Private browsing and low-storage devices may deny Cache Storage.
      return null
    }
  }

  private async persistGeneratedAudio(key: string, wav: ArrayBuffer): Promise<void> {
    if (!('caches' in window)) return
    try {
      const cache = await caches.open(GENERATED_AUDIO_CACHE)
      await cache.put(
        this.generatedCacheRequest(key),
        new Response(wav.slice(0), {
          headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        }),
      )
    } catch {
      // Playback still succeeds from memory when persistent storage is full.
    }
  }

  private loadGeneratedAudio(text: string, options: SpeakOptions): Promise<ArrayBuffer> {
    const key = this.generatedKey(text, options)
    const cached = this.generatedWavCache.get(key)
    if (cached) return Promise.resolve(cached)
    const pending = this.generatedWavPromises.get(key)
    if (pending) return pending

    const kokoroVoice = options.accent === 'american' ? 'af_sarah' : 'bf_emma'
    const relativeSpeed = Math.max(.65, Math.min(1.45, (options.speed ?? 145) / 145))
    const promise = (async () => {
      const persisted = await this.loadPersistedGeneratedAudio(key)
      if (persisted) {
        this.generatedWavCache.set(key, persisted)
        return persisted
      }

      const wav = await generateKokoroWav(text, kokoroVoice, relativeSpeed)
      if (!isWavBuffer(wav)) throw new Error('Kokoro 没有生成有效音频')
      this.generatedWavCache.set(key, wav)
      while (this.generatedWavCache.size > 12) {
        const oldest = this.generatedWavCache.keys().next().value as string | undefined
        if (!oldest) break
        this.generatedWavCache.delete(oldest)
      }
      void this.persistGeneratedAudio(key, wav)
      return wav
    })().finally(() => this.generatedWavPromises.delete(key))
    this.generatedWavPromises.set(key, promise)
    return promise
  }

  private loadManifest(): Promise<StaticAudioManifest> {
    if (this.manifest) return Promise.resolve(this.manifest)
    if (this.manifestPromise) return this.manifestPromise
    const fetchManifest = async (path: string, optional = false): Promise<StaticAudioManifest | null> => {
      const response = await fetch(assetUrl(path), { cache: 'no-cache' })
      if (optional && response.status === 404) return null
      if (!response.ok) throw new Error(`Kokoro 语音清单加载失败：HTTP ${response.status}`)
      const manifest = await response.json() as StaticAudioManifest
      if (!manifest.items || !manifest.baseSpeed || !manifest.engine?.startsWith('kokoro')) {
        throw new Error('Kokoro 语音清单格式无效')
      }
      return manifest
    }
    this.manifestPromise = Promise.all([
      fetchManifest('audio/manifest.json'),
      fetchManifest('audio/zh-manifest.json', true),
    ]).then(([base, chinese]) => {
      if (!base) throw new Error('Kokoro 基础语音清单缺失')
      const manifest: StaticAudioManifest = {
        ...base,
        version: Math.max(base.version, chinese?.version || 0),
        items: { ...base.items, ...chinese?.items },
      }
      this.manifest = manifest
      return manifest
    }).catch((error) => {
      this.manifestPromise = null
      throw error
    })
    return this.manifestPromise
  }

  private async loadStaticAudio(text: string, voice: string): Promise<StaticAudioClip | null> {
    const manifest = await this.loadManifest().catch(() => null)
    const item = manifest?.items[`${voice}\0${text}`]
    if (!manifest || !item) return null
    const path = typeof item === 'string' ? item : item.path
    const response = await fetch(assetUrl(path), { cache: 'force-cache' })
    if (!response.ok) throw new Error(`Kokoro 预生成语音加载失败：HTTP ${response.status}`)
    const data = await response.arrayBuffer()
    if (path.endsWith('.wav') && !isWavBuffer(data)) throw new Error('Kokoro 预生成语音文件不是有效 WAV 音频')
    return {
      data,
      path,
      baseSpeed: manifest.baseSpeed,
      start: typeof item === 'string' ? 0 : item.start,
      duration: typeof item === 'string' ? undefined : item.duration,
    }
  }

  private async decodeStatic(clip: StaticAudioClip): Promise<AudioBuffer> {
    const cached = this.decodedCache.get(clip.path)
    if (cached) return cached
    const decoded = await this.context!.decodeAudioData(clip.data.slice(0))
    this.decodedCache.set(clip.path, decoded)
    while (this.decodedCache.size > 4) {
      const oldest = this.decodedCache.keys().next().value as string | undefined
      if (!oldest) break
      this.decodedCache.delete(oldest)
    }
    return decoded
  }

  async unlock(): Promise<void> {
    if (!this.context) {
      const Context = window.AudioContext || window.webkitAudioContext
      if (!Context) throw new Error('当前浏览器不支持本地音频播放')
      this.context = new Context()
    }
    if (this.context.state === 'suspended') await this.context.resume()
  }

  async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const normalized = text.trim()
    if (!normalized) throw new Error('没有可朗读的文字')
    this.stop()
    const runId = ++this.generation
    this.stopped = false
    this.finish = options.onFinish || null
    try {
      await this.unlock()
      if (runId !== this.generation || this.stopped) return
      const voice = options.language === 'zh'
        ? 'zh'
        : options.accent === 'american' ? 'en/en-us' : 'en/en-rp'
      const staticAudio = await this.loadStaticAudio(normalized, voice)
      let wav = staticAudio?.data || null

      if (!wav) {
        if (options.language === 'zh') throw new Error('这段中文尚未生成 Kokoro 音频')
        options.onPreparing?.(!isKokoroModelReady())
        wav = await this.loadGeneratedAudio(normalized, options)
      }

      if (!wav || (!staticAudio && !isWavBuffer(wav))) throw new Error('Kokoro 没有生成有效音频')
      const decoded = staticAudio
        ? await this.decodeStatic(staticAudio)
        : await this.context!.decodeAudioData(wav.slice(0))
      if (runId !== this.generation || this.stopped) return
      const total = Math.max(1, Math.min(15, options.repeat ?? 1))
      let current = 0
      const playNext = () => {
        if (runId !== this.generation || this.stopped || !this.context) return
        const source = this.context.createBufferSource()
        source.buffer = decoded
        if (staticAudio) {
          source.playbackRate.value = Math.max(.65, Math.min(1.45, (options.speed ?? staticAudio.baseSpeed) / staticAudio.baseSpeed))
        }
        source.connect(this.context.destination)
        this.source = source
        source.onended = () => {
          if (runId !== this.generation || this.stopped) return
          current += 1
          if (current < total) {
            window.setTimeout(playNext, 260)
          } else {
            this.source = null
            const done = this.finish
            this.finish = null
            done?.('ended')
          }
        }
        if (current === 0) options.onStart?.()
        if (staticAudio?.duration) source.start(0, staticAudio.start, staticAudio.duration)
        else source.start(0)
      }
      playNext()
    } catch (error) {
      if (runId === this.generation) {
        const done = this.finish
        this.finish = null
        done?.('error')
      }
      throw error
    }
  }

  stop(): void {
    this.generation += 1
    this.stopped = true
    if (this.source) {
      this.source.onended = null
      try { this.source.stop() } catch { /* already stopped */ }
      this.source.disconnect()
      this.source = null
    }
    const done = this.finish
    this.finish = null
    done?.('stopped')
  }

  async selfTest(): Promise<AudioSelfTestResult[]> {
    await this.unlock()
    const results: AudioSelfTestResult[] = []
    for (const accent of ['british', 'american'] as const) {
      const voice = accent === 'british' ? 'en/en-rp' : 'en/en-us'
      const wav = (await this.loadStaticAudio('Good morning, everyone.', voice))?.data || null
      const valid = Boolean(wav && isWavBuffer(wav))
      let decodable = false
      if (valid) {
        try {
          await this.context!.decodeAudioData(wav!.slice(0))
          decodable = true
        } catch { decodable = false }
      }
      results.push({ accent, bytes: wav?.byteLength || 0, riff: valid, wave: valid, decodable })
    }
    return results
  }
}

export const audioEngine = new KokoroAudioEngine()
