const CACHE = 'dc-english-full-v4-stable'
const GENERATED_AUDIO_CACHE_PREFIX = 'dc-english-generated-audio-'
const CORE = ['./', './index.html', './logo.svg', './manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(
    CORE.map((url) => new Request(url, { cache: 'reload' })),
  )))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key !== CACHE && !key.startsWith(GENERATED_AUDIO_CACHE_PREFIX))
    .map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // Transformers.js persists the large model in its own browser cache.
  if (new URL(event.request.url).pathname.includes('/kokoro/model/onnx/')) {
    event.respondWith(fetch(event.request))
    return
  }
  const url = new URL(event.request.url)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then((response) => {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put('./index.html', copy))
      return response
    }).catch(() => caches.match('./index.html')))
    return
  }
  // Hashed build assets must be checked against the current deployment first.
  // This prevents an old app shell from being paired with replaced lazy chunks.
  if (url.origin === location.origin && url.pathname.includes('/assets/')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy))
      }
      return response
    }).catch(() => caches.match(event.request)))
    return
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && new URL(event.request.url).origin === location.origin) {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put(event.request, copy))
    }
    return response
  })))
})
