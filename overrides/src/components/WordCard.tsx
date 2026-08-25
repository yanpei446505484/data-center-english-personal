import { useState, useCallback, useEffect, useRef } from 'react';
import { Volume2, Square, BookOpen, Hash } from 'lucide-react';
import { speakWithPlugin, stopAllSpeech, warmupAudio } from '@/lib/ttsPlugin';
import {
  TTS_REPEAT_OPTIONS,
  loadTtsRepeat,
  saveTtsRepeat,
  type TtsRepeatCount,
} from '@/lib/ttsRepeat';

interface WordCardData {
  word: string;
  chinese: string;
  example: string;
  tags: string[];
  // Optional: rich format fields
  dataCenterMeaning?: string;
  phrases?: string[];
  // Optional: legacy format fields
  ukIpa?: string;
  pos?: string;
  simpleMeaning?: string;
  level?: string;
}

interface WordCardProps {
  data: WordCardData;
  autoPlay?: boolean;
}

const POS_LABELS: Record<string, string> = {
  verb: 'v.',
  noun: 'n.',
  adj: 'adj.',
  adjective: 'adj.',
  adv: 'adv.',
  adverb: 'adv.',
  prep: 'prep.',
  conj: 'conj.',
  pron: 'pron.',
};

export default function WordCard({ data, autoPlay = false }: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState<TtsRepeatCount>(
    () => loadTtsRepeat('word'),
  );
  const [playRound, setPlayRound] = useState(0);
  const stopFnRef = useRef<(() => void) | null>(null);
  const autoPlayedRef = useRef(false);
  const playbackAbortRef = useRef(false);

  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPlayback = useCallback(() => {
    playbackAbortRef.current = true;
    stopAllSpeech();
    if (chainTimerRef.current) {
      clearTimeout(chainTimerRef.current);
      chainTimerRef.current = null;
    }
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }
    setIsPlaying(false);
    setPlayRound(0);
  }, []);

  const playWordAudio = useCallback(() => {
    if (!data.word?.trim()) return;
    // 🔒 Mobile iOS: unlock audio in user gesture BEFORE async
    warmupAudio();
    stopPlayback();
    playbackAbortRef.current = false;
    setIsPlaying(true);

    let round = 0;
    const playNextWord = () => {
      if (playbackAbortRef.current) return;
      round += 1;
      setPlayRound(round);
      stopFnRef.current = speakWithPlugin(
        data.word,
        () => {
          stopFnRef.current = null;
          if (playbackAbortRef.current) return;
          if (round < repeatCount) {
            chainTimerRef.current = setTimeout(playNextWord, 350);
            return;
          }
          if (!data.example?.trim()) {
            setIsPlaying(false);
            setPlayRound(0);
            return;
          }
          chainTimerRef.current = setTimeout(() => {
            chainTimerRef.current = null;
            if (playbackAbortRef.current) return;
            stopFnRef.current = speakWithPlugin(
              data.example,
              () => {
                stopFnRef.current = null;
                setIsPlaying(false);
                setPlayRound(0);
              },
              'british',
            );
          }, 400);
        },
        'british',
      );
    };
    playNextWord();
  }, [data.word, data.example, repeatCount, stopPlayback]);

  useEffect(() => {
    if (autoPlay && !autoPlayedRef.current && data.word?.trim()) {
      autoPlayedRef.current = true;
      let stopAutoPlay: (() => void) | null = null;
      const timer = setTimeout(() => {
        setIsPlaying(true);
        stopAutoPlay = speakWithPlugin(
          data.word,
          () => {
            setIsPlaying(false);
            if (stopFnRef.current === stopAutoPlay) {
              stopFnRef.current = null;
            }
          },
          'british',
        );
        stopFnRef.current = stopAutoPlay;
      }, 300);
      return () => {
        clearTimeout(timer);
        if (stopAutoPlay) {
          stopAutoPlay();
        }
        setIsPlaying(false);
      };
    }
    return undefined;
  }, [autoPlay, data.word]);

  useEffect(() => {
    return () => {
      if (chainTimerRef.current) {
        clearTimeout(chainTimerRef.current);
        chainTimerRef.current = null;
      }
      if (stopFnRef.current) {
        stopFnRef.current();
        stopFnRef.current = null;
      }
    };
  }, []);

  const hasDCContext = !!data.dataCenterMeaning;
  const hasPhrases = data.phrases && data.phrases.length > 0;
  const posLabel = data.pos ? (POS_LABELS[data.pos.toLowerCase()] ?? data.pos) : null;

  return (
    <div className="w-full rounded-sm border border-border/50 bg-card/80 overflow-hidden my-2">
      {/* Header: word + meta + TTS button */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-border/30">
        <div className="flex items-baseline gap-2 min-w-0 flex-1 flex-wrap">
          <span className="text-lg font-semibold text-foreground tracking-tight font-['Space_Grotesk']">
            {data.word}
          </span>
          {data.ukIpa && (
            <span className="text-sm font-mono text-primary/80 tabular-nums shrink-0">
              {data.ukIpa}
            </span>
          )}
          {posLabel && (
            <span className="text-xs font-medium text-muted-foreground italic shrink-0">
              {posLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={isPlaying ? stopPlayback : playWordAudio}
          className={`shrink-0 size-8 rounded-sm flex items-center justify-center transition-colors border ${
            isPlaying
              ? 'bg-primary/15 border-primary/40 text-primary'
              : 'bg-background border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30'
          }`}
          title={isPlaying ? 'Stop' : 'Read word + example (British)'}
        >
          {isPlaying ? (
            <Square className="size-3.5 fill-current" />
          ) : (
            <Volume2 className="size-3.5" />
          )}
        </button>
        <select
          value={repeatCount}
          disabled={isPlaying}
          onChange={(event) => {
            const next = saveTtsRepeat('word', event.target.value);
            setRepeatCount(next);
          }}
          className="h-8 rounded-sm border border-border/40 bg-background px-1.5 text-[11px] text-foreground disabled:opacity-60"
          aria-label={`${data.word}朗读遍数`}
        >
          {TTS_REPEAT_OPTIONS.map((count) => (
            <option key={count} value={count}>{count}遍</option>
          ))}
        </select>
        {isPlaying && playRound > 0 && (
          <span className="text-[10px] text-primary tabular-nums whitespace-nowrap">
            第 {playRound}/{repeatCount} 遍
          </span>
        )}
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Chinese meaning */}
        <div>
          <span className="text-sm text-foreground font-medium">{data.chinese}</span>
          {data.simpleMeaning && (
            <span className="text-xs text-muted-foreground ml-2">— {data.simpleMeaning}</span>
          )}
        </div>

        {/* Data center context meaning */}
        {hasDCContext && (
          <div className="rounded-sm bg-primary/8 border border-primary/20 px-3 py-2">
            <div className="flex items-start gap-2">
              <BookOpen className="size-3.5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider mb-0.5">
                  Data Center Context
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {data.dataCenterMeaning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Example sentence */}
        <div className="rounded-sm bg-background/60 border border-border/30 px-3 py-2">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-2">
              Example
            </span>
            {data.example}
          </p>
        </div>

        {/* Common phrases */}
        {hasPhrases && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Hash className="size-3 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Common Phrases
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.phrases!.map((phrase) => (
                <span
                  key={phrase}
                  className="text-xs px-2 py-1 rounded-sm border border-border/40 bg-muted/20 text-foreground/80 font-mono"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: tags + level */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border/20 flex-wrap">
        {data.level && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-primary/30 bg-primary/10 text-primary">
            {data.level}
          </span>
        )}
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-sm border border-border/30 bg-muted/20 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        <span className="text-[10px] text-muted-foreground/40 ml-auto font-mono">UK</span>
      </div>
    </div>
  );
}
