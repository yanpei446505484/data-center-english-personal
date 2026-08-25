import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Square,
  Loader2,
  Globe,
  Repeat,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { SENTENCE_SECTIONS, MOCK_SENTENCES } from '@/data/sentenceLearning';
import { storage } from '@/lib/storage';
import { userStorageKey } from '@/lib/userStorage';
import { preloadTTS, speakWithPlugin, stopAllSpeech, stripChinese, warmupAudio } from '@/lib/ttsPlugin';
import { lookupWordLocal, type ILocalWordResult } from '@/skills/dictionarySkill';
import { recordSentencesStudied } from '@/hooks/useStudyProgress';
import { getSentenceCardModel, normalizeCardTerm } from '@/lib/sentenceCards';

// Module-level cache for AI-fetched word definitions
const aiWordCache = new Map<string, { cn: string; ipa: string; pos?: string }>();
import { toast } from 'sonner';
import { useFavorites } from '@/hooks/useFavorites';

/* ─── Word Popover ─── */
interface WordPopoverData {
  cn: string;
  ipa: string;
  pos?: string;
  example?: string;
  englishDef?: string;
  source?: string;
  why?: string;
}

function WordPopover({
  children,
  word,
  wordData: initialWordData,
  onFavorite,
  isFavorited,
  kind = 'word',
  triggerClassName = '',
}: {
  children: React.ReactNode;
  word: string;
  wordData?: WordPopoverData;
  onFavorite: (data?: { cn: string; ipa: string; pos?: string }) => void;
  isFavorited: boolean;
  kind?: 'word' | 'phrase';
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [aiData, setAiData] = useState<WordPopoverData | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const displayData = initialWordData || aiData;

  // Local dictionary lookup only — no AI fallback
  useEffect(() => {
    if (!open || initialWordData || kind === 'phrase') return;

    const wordKey = word.toLowerCase();
    const cached = aiWordCache.get(wordKey) as typeof aiData;
    if (cached) {
      setAiData(cached);
      return;
    }

    // Prevent duplicate loading
    if (isLocalLoading) return;

    const controller = new AbortController();
    abortRef.current = controller;

    // Hard timeout to ensure we never stay in loading state
    const hardTimeout = setTimeout(() => {
      if (!controller.signal.aborted) {
        const emptyResult = { cn: '', ipa: '', pos: undefined, example: undefined, englishDef: undefined, source: undefined };
        aiWordCache.set(wordKey, emptyResult);
        setAiData(emptyResult);
        setIsLocalLoading(false);
      }
    }, 5000);

    setIsLocalLoading(true);

    (async () => {
      try {
        const localHit: ILocalWordResult | null = await lookupWordLocal(word);
        if (controller.signal.aborted) return;

        const parsed = localHit
          ? {
              cn: localHit.chinese || '',
              ipa: localHit.ipa,
              pos: localHit.pos || undefined,
              example: localHit.example || undefined,
              englishDef: localHit.englishDef || undefined,
              source: localHit.source || undefined,
            }
          : { cn: '', ipa: '', pos: undefined, example: undefined, englishDef: undefined, source: undefined };
        aiWordCache.set(wordKey, parsed);
        setAiData(parsed);
      } catch {
        const emptyResult = { cn: '', ipa: '', pos: undefined, example: undefined, englishDef: undefined, source: undefined };
        aiWordCache.set(wordKey, emptyResult);
        setAiData(emptyResult);
      } finally {
        clearTimeout(hardTimeout);
        setIsLocalLoading(false);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(hardTimeout);
    };
  }, [open, initialWordData, word, kind]);

  const [isWordSpeaking, setIsWordSpeaking] = useState(false);
  const wordSpeakStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (wordSpeakStopRef.current) {
        wordSpeakStopRef.current();
        wordSpeakStopRef.current = null;
      }
    };
  }, []);

  const speak = () => {
    if (!word?.trim()) return;
    warmupAudio();
    if (wordSpeakStopRef.current) {
      wordSpeakStopRef.current();
      wordSpeakStopRef.current = null;
    }
    setIsWordSpeaking(true);
    const stopFn = speakWithPlugin(word, () => {
      if (wordSpeakStopRef.current === stopFn) {
        wordSpeakStopRef.current = null;
      }
      setIsWordSpeaking(false);
    }, 'british');
    wordSpeakStopRef.current = stopFn;
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && abortRef.current) {
      abortRef.current.abort();
      setIsLocalLoading(false);
    }
    if (!nextOpen && wordSpeakStopRef.current) {
      wordSpeakStopRef.current();
      wordSpeakStopRef.current = null;
      setIsWordSpeaking(false);
    }
    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`查看${kind === 'phrase' ? '短语' : '单词'}：${word}`}
          className={`inline cursor-pointer font-inherit text-inherit hover:text-primary hover:underline decoration-primary/40 underline-offset-4 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${triggerClassName}`}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(310px,calc(100vw-24px))] p-3" side="top" align="center" sideOffset={8}>
        <div className="space-y-2.5">
          {isLocalLoading ? (
            <div className="flex items-center gap-2 py-3 justify-center">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">词典查询中…</span>
            </div>
          ) : (
            <>
              {/* Word + IPA */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-bold text-base text-foreground">{word}</span>
                {displayData?.ipa && (
                  <span className="text-xs text-muted-foreground font-mono">{displayData.ipa}</span>
                )}
                {displayData?.pos && (
                  <Badge variant="outline" className="text-[10px] py-0">{displayData.pos}</Badge>
                )}
                {kind === 'phrase' && (
                  <Badge variant="secondary" className="text-[10px] py-0">词组/短语</Badge>
                )}
              </div>
              {/* Chinese meaning */}
              {displayData?.cn ? (
                <p className="text-sm text-foreground leading-relaxed">{displayData.cn}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">暂无中文释义</p>
              )}
              {displayData?.source === 'online' && (
                <span className="inline-flex items-center gap-0.5 text-[9px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">
                  <Globe className="size-2.5" />在线词典
                </span>
              )}
              {/* Example sentence */}
              {displayData?.example && (
                <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
                  {displayData.example}
                </p>
              )}
              {displayData?.why && (
                <div className="rounded-sm border border-primary/20 bg-primary/5 px-2.5 py-2">
                  <p className="text-[10px] font-medium text-primary mb-0.5">用法说明</p>
                  <p className="text-xs text-foreground/90 leading-relaxed">{displayData.why}</p>
                </div>
              )}
            </>
          )}
          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={speak} disabled={isWordSpeaking} className="flex-1 h-8 text-xs">
              <Volume2 className={`size-3.5 mr-1.5 ${isWordSpeaking ? 'animate-pulse text-primary' : ''}`} />
              朗读
            </Button>
            <Button
              size="sm"
              variant={isFavorited ? 'secondary' : 'default'}
              onClick={() => {
                onFavorite(displayData || undefined);
                setOpen(false);
              }}
              className="flex-1 h-8 text-xs"
              disabled={isFavorited || isLocalLoading}
            >
              {isFavorited ? (
                <><BookmarkCheck className="size-3.5 mr-1.5" />已收藏</>
              ) : (
                <><Bookmark className="size-3.5 mr-1.5" />收藏</>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function ScenarioPracticePage() {
  const { sectionIndex } = useParams<{ sectionIndex: string }>();
  const navigate = useNavigate();
  const index = parseInt(sectionIndex || '0', 10);

  const section = SENTENCE_SECTIONS[index];
  const sentences = useMemo(
    () => section
      ? MOCK_SENTENCES.filter((s) => s.id >= section.range[0] && s.id <= section.range[1])
      : [],
    [section],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Repeat reading setting
  const REPEAT_OPTIONS = [1, 5, 10, 15] as const;
  const [repeatCount, setRepeatCount] = useState<number>(() => {
    try {
      const saved = storage.getItem(userStorageKey('scenario_repeat_count'));
      return saved ? Number(saved) : 1;
    } catch { return 1; }
  });
  const [speakRound, setSpeakRound] = useState(0); // current round (1-based, 0 = not speaking)
  const speakAbortRef = useRef(false);
  const pluginStopRef = useRef<(() => void) | null>(null);
  const { addFavorite, isFavorited } = useFavorites();

  const currentSentence = sentences[currentIndex];
  const currentCardModel = useMemo(
    () => currentSentence ? getSentenceCardModel(currentSentence) : null,
    [currentSentence],
  );

  useEffect(() => {
    if (!currentSentence?.en) return;
    // Let the new sentence render first. Audio preparation runs shortly after
    // the visual update so the Next button always feels immediate.
    const timer = window.setTimeout(() => {
      void preloadTTS([currentSentence.en, sentences[currentIndex + 1]?.en || ''], 'british');
    }, 120);
    return () => window.clearTimeout(timer);
  }, [currentIndex, currentSentence?.en, sentences]);

  // Build a global word dictionary from ALL sentences for fallback lookup
  const globalWordDict = useMemo(() => {
    const dict = new Map<string, { cn: string; ipa: string; pos?: string }>();
    for (const s of MOCK_SENTENCES) {
      if (!s.words) continue;
      for (const w of s.words) {
        const key = (w.w || w.word || '').toLowerCase();
        if (key && !dict.has(key)) {
          dict.set(key, { cn: w.cn || '', ipa: w.ipa || '', pos: w.pos });
        }
      }
    }
    return dict;
  }, []);

  // 页面卸载时停止所有语音
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    speakAbortRef.current = true;
    stopAllSpeech();
    pluginStopRef.current?.();
    pluginStopRef.current = null;
    setIsSpeaking(false);
    setSpeakRound(0);
  }, []);

  const speakOne = useCallback((text: string, _lang: string, _rate: number): Promise<void> => {
    return new Promise((resolve) => {
      pluginStopRef.current = speakWithPlugin(text, resolve);
    });
  }, []);

  const speak = useCallback(async () => {
    if (!currentSentence) return;
    const enText = stripChinese(currentSentence.en);
    if (!enText.trim()) return;
    // 🔒 Mobile iOS: unlock audio in user gesture BEFORE async
    warmupAudio();
    // stopAllSpeech 由 speakWithPlugin 内部调用，此处不再重复
    pluginStopRef.current?.();
    pluginStopRef.current = null;
    speakAbortRef.current = false;
    setIsSpeaking(true);

    for (let round = 1; round <= repeatCount; round++) {
      if (speakAbortRef.current) break;
      setSpeakRound(round);

      await speakOne(enText, 'en-US', 0.85);
      if (speakAbortRef.current) break;

      // Pause between rounds (except last)
      if (round < repeatCount) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    setIsSpeaking(false);
    setSpeakRound(0);
  }, [currentSentence, repeatCount, speakOne]);

  const handleRepeatChange = useCallback((count: number) => {
    setRepeatCount(count);
    storage.setItem(userStorageKey('scenario_repeat_count'), String(count));
    // Stop current speaking if changing repeat
    if (isSpeaking) stopSpeaking();
  }, [isSpeaking, stopSpeaking]);

  const nextSentence = useCallback(() => {
    speakAbortRef.current = true;
    stopAllSpeech();
    pluginStopRef.current?.();
    pluginStopRef.current = null;
    setIsSpeaking(false);
    setSpeakRound(0);
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((value) => value + 1);
    } else {
      recordSentencesStudied(sentences.map((sentence) => sentence.id));
      setIsComplete(true);
    }
  }, [currentIndex, sentences]);

  // Practice Mode
  if (!isComplete && currentSentence) {
    const progressPercent = ((currentIndex + 1) / sentences.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{section?.label}</h1>
            <p className="text-sm text-muted-foreground">
              第 {currentIndex + 1} / {sentences.length} 句
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>进度</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>

        {/* Sentence Card */}
        <div key={currentSentence.id}>
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {currentSentence.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground leading-relaxed mb-2">
                      {currentCardModel?.segments.map((segment, idx) => {
                        if (segment.kind === 'separator') return <span key={idx}>{segment.text}</span>;

                        const rawWord = segment.text;
                        const cleanWord = normalizeCardTerm(rawWord);
                        const localWord = currentSentence.words.find(
                          (item) => normalizeCardTerm(item.w || item.word || '') === cleanWord,
                        );
                        const wordData = localWord || globalWordDict.get(cleanWord);

                        return (
                          <WordPopover
                            key={`${idx}-${rawWord}`}
                            word={rawWord}
                            wordData={wordData ? { cn: wordData.cn, ipa: wordData.ipa, pos: wordData.pos } : undefined}
                            isFavorited={isFavorited(rawWord)}
                            onFavorite={(popoverData) => {
                              const data = popoverData || (wordData
                                ? { cn: wordData.cn, ipa: wordData.ipa, pos: wordData.pos }
                                : undefined);
                              const response = data?.cn
                                ? `**${rawWord}** ${data.ipa || ''}\n\n${data.pos ? `*${data.pos}* ` : ''}${data.cn}`
                                : `**${rawWord}**`;
                              const saved = addFavorite(rawWord, response);
                              if (saved) toast.success(`已收藏单词: ${rawWord}`);
                              else toast.info(`"${rawWord}" 已收藏`);
                            }}
                          >
                            {rawWord}
                          </WordPopover>
                        );
                      })}
                    </CardTitle>
                    {/* Bookmark sentence button */}
                    <button
                      type="button"
                      onClick={() => {
                        const en = currentSentence.en;
                        const response = `**${en}**\n\n${currentSentence.cn}\n\n${currentSentence.ipa || ''}`;
                        const saved = addFavorite(en, response);
                        if (saved) toast.success('已收藏整句');
                        else toast.info('该句已收藏');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1 mb-2"
                    >
                      {isFavorited(currentSentence.en) ? (
                        <>
                          <BookmarkCheck className="size-3.5 text-primary" />
                          <span>已收藏</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="size-3.5" />
                          <span>收藏整句</span>
                        </>
                      )}
                    </button>
                    <p className="text-base text-muted-foreground">{currentSentence.cn}</p>
                    {currentSentence.ipa && (
                      <p className="text-sm text-muted-foreground mt-2 font-mono">{currentSentence.ipa}</p>
                    )}
                    {currentCardModel && currentCardModel.phrases.length > 0 && (
                      <div className="mt-4 rounded-md border border-border/40 bg-muted/15 px-3 py-3">
                        <p className="text-[11px] font-medium text-muted-foreground mb-2">词组与短语 · 点击单独查看</p>
                        <div className="flex flex-wrap gap-2">
                          {currentCardModel.phrases.map((phrase, phraseIndex) => (
                            <WordPopover
                              key={`${phrase.text}-${phraseIndex}`}
                              word={phrase.text}
                              kind="phrase"
                              triggerClassName="border border-primary/30 bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary no-underline hover:bg-primary/15 hover:no-underline"
                              wordData={{
                                cn: phrase.chinese,
                                ipa: phrase.ipa,
                                pos: '短语',
                                example: currentSentence.en,
                                why: phrase.explanation,
                              }}
                              isFavorited={isFavorited(phrase.text)}
                              onFavorite={() => {
                                const response = `**${phrase.text}** ${phrase.ipa}\n\n*短语* ${phrase.chinese}\n\n${phrase.explanation}\n\n例句：${currentSentence.en}`;
                                const saved = addFavorite(phrase.text, response);
                                if (saved) toast.success(`已收藏短语: ${phrase.text}`);
                                else toast.info(`"${phrase.text}" 已收藏`);
                              }}
                            >
                              {phrase.text}
                            </WordPopover>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Repeat count selector */}
                <div className="flex items-center gap-2">
                  <Repeat className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground shrink-0">重复:</span>
                  <div className="flex gap-1">
                    {REPEAT_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => handleRepeatChange(n)}
                        className={`px-2 py-0.5 text-xs rounded-sm transition-colors ${
                          repeatCount === n
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-accent-foreground hover:bg-accent/80'
                        }`}
                      >
                        {n}遍
                      </button>
                    ))}
                  </div>
                </div>

                {/* Listen / Stop + Next Buttons */}
                <div className="flex gap-2">
                  {isSpeaking ? (
                    <Button
                      variant="destructive"
                      onClick={stopSpeaking}
                      className="flex-1"
                    >
                      <Square className="size-4 mr-2 fill-current" />
                      停止播放
                      {speakRound > 0 && (
                        <span className="ml-2 text-xs opacity-80">
                          第{speakRound}/{repeatCount}遍
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={speak}
                      className="flex-1"
                    >
                      <Volume2 className="size-4 mr-2" />
                      听标准发音
                    </Button>
                  )}
                  {/* 下一句按钮 - 立即切换，不等待音频预加载 */}
                  <Button
                    variant="outline"
                    onClick={nextSentence}
                    className="shrink-0"
                    title={currentIndex < sentences.length - 1 ? '进入下一句' : '完成学习'}
                  >
                    <ArrowRight className="size-4 mr-1" />
                    {currentIndex < sentences.length - 1 ? '下一句' : '完成'}
                  </Button>
                </div>

              </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  // Completion view: follow-reading scores and reports have been removed.
  if (isComplete) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-12 text-center space-y-4">
          <CheckCircle2 className="size-12 text-primary mx-auto" />
          <div>
            <h1 className="text-xl font-bold text-foreground">本场景学习完成</h1>
            <p className="text-sm text-muted-foreground mt-1">已完成 {sentences.length} 句学习</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate('/scenarios')}>返回场景列表</Button>
            <Button onClick={() => {
              setCurrentIndex(0);
              setIsComplete(false);
            }}>重新学习</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Section not found or no sentences for this section
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/scenarios')}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">场景练习</h1>
      </div>
      <Card className="border-border/40">
        <CardContent className="p-12 text-center space-y-3">
          {!section ? (
            <>
              <p className="text-muted-foreground">未找到该场景（索引: {index}）</p>
              <Button variant="outline" onClick={() => navigate('/scenarios')}>
                返回场景列表
              </Button>
            </>
          ) : sentences.length === 0 ? (
            <>
              <p className="text-muted-foreground">该场景暂无练习句子</p>
              <Button variant="outline" onClick={() => navigate('/scenarios')}>
                返回场景列表
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">加载场景中...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
