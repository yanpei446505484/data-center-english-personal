import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Mic,
  GraduationCap,
  ChevronRight,
  Volume2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Square,
  Bookmark,
  BookmarkCheck,
  Star,
  PenLine,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  SENTENCE_SECTIONS,
  MOCK_SENTENCES,
  type ISentence,
} from '@/data/sentenceLearning';
import { storage } from '@/lib/storage';
import { userStorageKey } from '@/lib/userStorage';
import { preloadTTS, speakWithPlugin, stopAllSpeech, warmupAudio } from '@/lib/ttsPlugin';
import { recordSentenceStudied } from '@/hooks/useStudyProgress';
import { useFavorites } from '@/hooks/useFavorites';
import { getReadCount, incrementReadCount } from '@/lib/readCounts';
import {
  buildWordReferenceIndex,
  getCompletePhraseCards,
  getCompleteSentenceWords,
  splitEnglishText,
} from '@/lib/sentenceCards';

const WORD_REFERENCE_INDEX = buildWordReferenceIndex(MOCK_SENTENCES);

export default function SentenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorited, getFavoriteId } = useFavorites();
  const [activeTab, setActiveTab] = useState('words');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [revealedQuiz, setRevealedQuiz] = useState<Record<number, boolean>>({});
  const [expandedWords, setExpandedWords] = useState<Record<string, boolean>>({});
  const [sentenceReadCount, setSentenceReadCount] = useState(0);
  const [wordReadCounts, setWordReadCounts] = useState<Record<string, number>>({});

  // TTS reading (single play only)
  const repeatCount = 1;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakRound, setSpeakRound] = useState(0);
  const speakAbortRef = useRef(false);
  const pluginStopRef = useRef<(() => void) | null>(null);

  const speakEnglish = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      pluginStopRef.current = speakWithPlugin(text, resolve);
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    speakAbortRef.current = true;
    stopAllSpeech();
    pluginStopRef.current?.();
    pluginStopRef.current = null;
    setIsSpeaking(false);
    setSpeakRound(0);
  }, []);



  const sentence = useMemo(() => {
    const numId = Number(id);
    return MOCK_SENTENCES.find((s: ISentence) => s.id === numId) ?? null;
  }, [id]);

  // Record sentence as studied when user views detail page
  useEffect(() => {
    if (sentence) {
      recordSentenceStudied(sentence.id);
    }
  }, [sentence]);

  const currentSection = useMemo(() => {
    if (!sentence) return null;
    return (
      SENTENCE_SECTIONS.find(
        (sec) => sentence.id >= sec.range[0] && sentence.id <= sec.range[1]
      ) ?? null
    );
  }, [sentence]);

  const adjacentSentences = useMemo(() => {
    if (!sentence) return { prev: null, next: null };
    const idx = MOCK_SENTENCES.findIndex((s: ISentence) => s.id === sentence.id);
    return {
      prev: idx > 0 ? MOCK_SENTENCES[idx - 1] : null,
      next: idx < MOCK_SENTENCES.length - 1 ? MOCK_SENTENCES[idx + 1] : null,
    };
  }, [sentence]);

  const completeWords = useMemo(
    () => sentence ? getCompleteSentenceWords(sentence, WORD_REFERENCE_INDEX) : [],
    [sentence],
  );

  const completePhrases = useMemo(
    () => sentence ? getCompletePhraseCards(sentence, completeWords) : [],
    [sentence, completeWords],
  );

  useEffect(() => {
    if (!sentence) return;
    setSentenceReadCount(getReadCount('sentence', sentence.id));
  }, [sentence?.id]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const word of completeWords) {
      counts[word.w.toLocaleLowerCase('en-US')] = getReadCount('word', word.w);
    }
    setWordReadCounts(counts);
  }, [completeWords]);

  const recordWordRead = useCallback((word: string) => {
    const next = incrementReadCount('word', word);
    setWordReadCounts((previous) => ({
      ...previous,
      [word.toLocaleLowerCase('en-US')]: next,
    }));
  }, []);

  // Prepare the current and next English sentence while the learner reads the page.
  // If the audio is not in the static pack, Kokoro generation is deduplicated and
  // cached so clicking the button does not start the same expensive work again.
  useEffect(() => {
    if (!sentence?.en) return;
    const timer = window.setTimeout(() => {
      void preloadTTS([sentence.en, adjacentSentences.next?.en || '']);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [sentence?.en, adjacentSentences.next?.en]);

  // Per-sentence notes (localStorage persisted, keyed by sentence id)
  const NOTES_KEY_PREFIX = '__app_dc_sentence_note_';
  const [noteText, setNoteText] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState(false);

  // 页面卸载时停止所有语音
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  // Load / reset note when sentence changes
  useEffect(() => {
    if (!sentence) return;
    try {
      const saved = storage.getItem(userStorageKey(`${NOTES_KEY_PREFIX}${sentence.id}`)) || '';
      setNoteText(saved);
      setNoteSaved(false);
    } catch { setNoteText(''); }
  }, [sentence?.id]);

  const handleNoteSave = useCallback(() => {
    if (!sentence) return;
    try {
      storage.setItem(userStorageKey(`${NOTES_KEY_PREFIX}${sentence.id}`), noteText);
      setNoteSaved(true);
      toast.success('笔记已保存');
      setTimeout(() => setNoteSaved(false), 2000);
    } catch {
      toast.error('保存失败');
    }
  }, [sentence, noteText]);

  const startSpeaking = useCallback(async () => {
    // 🔒 Mobile iOS: unlock audio in user gesture BEFORE async
    warmupAudio();
    if (!sentence || !sentence.en?.trim()) return;
    // stopAllSpeech 由 speakWithPlugin 内部调用，此处不再重复
    pluginStopRef.current?.();
    pluginStopRef.current = null;
    speakAbortRef.current = false;
    setIsSpeaking(true);
    setSentenceReadCount(incrementReadCount('sentence', sentence.id));

    setSpeakRound(1);
    await speakEnglish(sentence.en);

    setIsSpeaking(false);
    setSpeakRound(0);
  }, [sentence, speakEnglish]);

  const [miniPlaying, setMiniPlaying] = useState<string | null>(null);

  const playMiniTTS = useCallback((text: string, key: string, countWord?: string) => {
    if (!text?.trim()) return;
    if (miniPlaying === key) {
      stopAllSpeech();
      setMiniPlaying(null);
      return;
    }
    warmupAudio();
    stopAllSpeech();
    if (countWord) recordWordRead(countWord);
    setMiniPlaying(key);
    const onDone = () => setMiniPlaying(null);
    speakWithPlugin(text, onDone);
  }, [miniPlaying, recordWordRead]);

  const toggleWordExpand = (wordKey: string) => {
    setExpandedWords((prev) => ({ ...prev, [wordKey]: !prev[wordKey] }));
  };

  const handleQuizAnswer = (quizIdx: number, chosenIdx: number, correctIdx: number) => {
    const isCorrect = chosenIdx === correctIdx;
    setQuizAnswers((prev) => ({ ...prev, [quizIdx]: isCorrect }));
    setRevealedQuiz((prev) => ({ ...prev, [quizIdx]: true }));
  };

  if (!sentence) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm mb-4">未找到该句子</p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4 mr-2" />
              返回
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { key: 'words', label: '单词', icon: BookOpen, count: completeWords.length },
    { key: 'phrases', label: '短语', icon: MessageSquare, count: completePhrases.length },
    { key: 'grammar', label: '语法', icon: HelpCircle, count: sentence.grammar?.length ?? 0 },
    { key: 'pattern', label: '句型', icon: Lightbulb, count: sentence.patternExamples?.length ?? 0 },
    { key: 'pronunciation', label: '发音', icon: Mic, count: 1 },
    { key: 'quiz', label: '测验', icon: GraduationCap, count: sentence.quiz?.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-1" />
          返回
        </Button>
        {currentSection && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>句子浏览</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{currentSection.label}</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">第 {sentence.id} 句</span>
          </div>
        )}
      </div>

      {/* Sentence header card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  #{sentence.id}
                </Badge>
                {sentence.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-foreground leading-relaxed">
                  {sentence.en}
                </h1>
                <p className="text-sm text-muted-foreground font-mono tracking-wide">
                  {sentence.ipa}
                </p>
                <p className="text-base text-foreground/80">{sentence.cn}</p>
                {/* 收藏整句按钮 */}
                <button
                  type="button"
                  onClick={() => {
                    const en = sentence.en;
                    if (isFavorited(en)) {
                      const favId = getFavoriteId(en);
                      if (favId) {
                        removeFavorite(favId);
                        toast.success('已取消收藏');
                      }
                    } else {
                      const response = `**${en}**\n\n${sentence.cn}\n\n${sentence.ipa || ''}`;
                      addFavorite(en, response);
                      toast.success('已收藏整句');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                >
                  {isFavorited(sentence.en) ? (
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
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              {isSpeaking ? (
                <Button variant="destructive" size="sm" onClick={stopSpeaking} className="h-9 gap-1.5">
                  <Square className="size-3.5 fill-current" />
                  停止
                  {speakRound > 0 && (
                    <span className="text-[10px] opacity-80 ml-1">
                      {speakRound}/{repeatCount} · 已朗读 {sentenceReadCount}次
                    </span>
                  )}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={startSpeaking} className="h-9 gap-1.5">
                  <Volume2 className="size-3.5" />
                  朗读 · {sentenceReadCount}次
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {sentence.when && (
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border/50 bg-accent/30 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">使用场景</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{sentence.when}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Thinking section */}
      {sentence.thinking && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              中英思维对比
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {sentence.thinking}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="gap-1.5 text-xs h-9 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="size-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-0.5 text-[10px] opacity-70">({tab.count})</span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Words tab */}
        <TabsContent value="words" className="mt-4 space-y-3">
          {completeWords.length > 0 ? (
            completeWords.map((word, wi) => {
              const wordKey = `${sentence.id}-${word.w}-${wi}`;
              const isExpanded = expandedWords[wordKey] ?? false;
              return (
                <Card key={wi}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center gap-3"
                    onClick={() => toggleWordExpand(wordKey)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-semibold text-foreground">{word.w}</span>
                        <span className="text-xs font-mono text-muted-foreground">{word.ipa}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {word.pos}
                        </Badge>
                        {/* 朗读单词按钮 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playMiniTTS(word.w, `word-${wi}`, word.w);
                          }}
                          className="shrink-0"
                          title="朗读单词"
                        >
                          <Volume2 className={`size-3.5 ${miniPlaying === `word-${wi}` ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'} transition-colors`} />
                        </button>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          已朗读 {wordReadCounts[word.w.toLocaleLowerCase('en-US')] || 0} 次
                        </span>
                        {/* 收藏单词按钮 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const query = word.w;
                            if (isFavorited(query)) {
                              const favId = getFavoriteId(query);
                              if (favId) {
                                removeFavorite(favId);
                                toast.success(`已取消收藏: ${query}`);
                              }
                            } else {
                              const response = `**${query}** ${word.ipa || ''}\n\n${word.pos ? `*${word.pos}* ` : ''}${word.cn}`;
                              addFavorite(query, response);
                              toast.success(`已收藏单词: ${query}`);
                            }
                          }}
                          className="ml-auto"
                          title={isFavorited(word.w) ? '点击取消收藏' : '收藏单词'}
                        >
                          {isFavorited(word.w) ? (
                            <Star className="size-4 text-primary fill-primary" />
                          ) : (
                            <Star className="size-4 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{word.cn}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 space-y-4 border-t border-border/30">
                      {/* Memory */}
                      {word.memory && (
                        <div>
                          <p className="text-xs font-medium text-primary mb-1">记忆方法</p>
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                            {word.memory}
                          </p>
                        </div>
                      )}

                      {/* Phonics */}
                      {word.phonics && (
                        <div>
                          <p className="text-xs font-medium text-primary mb-1">发音技巧</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {word.phonics}
                          </p>
                        </div>
                      )}

                      {/* Collocations */}
                      {word.collocations && word.collocations.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-primary mb-2">常见搭配</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {word.collocations.map(([en, cn], ci) => (
                              <div
                                key={ci}
                                className="flex items-center gap-2 rounded-md border border-border/30 bg-accent/20 px-3 py-1.5 text-xs"
                              >
                                <span className="font-medium text-foreground">{en}</span>
                                <span className="text-muted-foreground">{cn}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Examples */}
                      {word.examples && word.examples.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-primary mb-2">例句</p>
                          <div className="space-y-2">
                            {word.examples.map((example, ei) => {
                              const [en, cn] = Array.isArray(example)
                                ? [example[0] || '', example[1] || '']
                                : [example.en, example.cn];
                              const exampleKey = `word-example-${wi}-${ei}`;
                              return (
                                <div key={ei} className="pl-3 border-l-2 border-border/40">
                                  <div className="flex items-start gap-2">
                                    <p className="text-sm text-foreground flex-1">{en}</p>
                                    <button
                                      type="button"
                                      onClick={() => playMiniTTS(en, exampleKey)}
                                      className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                      title="朗读英文例句"
                                      aria-label={`朗读例句：${en}`}
                                    >
                                      <Volume2 className={`size-3.5 ${miniPlaying === exampleKey ? 'text-primary animate-pulse' : ''}`} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{cn}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })
          ) : (
            <EmptyState text="本句暂无单词解析" />
          )}
        </TabsContent>

        {/* Phrases tab */}
        <TabsContent value="phrases" className="mt-4 space-y-3">
          {completePhrases.length > 0 ? (
            completePhrases.map((phrase, pi) => (
              <Card key={pi}>
                <CardContent className="py-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-primary">{phrase.text}</span>
                    <span className="text-xs font-mono text-muted-foreground">{phrase.ipa}</span>
                    <button
                      type="button"
                      onClick={() => playMiniTTS(phrase.text, `phrase-${pi}`)}
                      className="shrink-0"
                      title="朗读短语"
                    >
                      <Volume2 className={`size-3.5 ${miniPlaying === `phrase-${pi}` ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'} transition-colors`} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/80">{phrase.chinese}</p>
                  {phrase.explanation && (
                    <>
                      <Separator className="my-2" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {phrase.explanation}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState text="本句暂无短语搭配" />
          )}
        </TabsContent>

        {/* Grammar tab */}
        <TabsContent value="grammar" className="mt-4">
          {sentence.grammar && sentence.grammar.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-2">
              {sentence.grammar.map((item, gi) => (
                <AccordionItem
                  key={gi}
                  value={`grammar-${gi}`}
                  className="rounded-lg border border-border/30 px-4"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">
                    <span className="flex items-center gap-2 text-left">
                      <HelpCircle className="size-4 text-primary shrink-0" />
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line pl-6">
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyState text="本句暂无语法解析" />
          )}
        </TabsContent>

        {/* Pattern tab */}
        <TabsContent value="pattern" className="mt-4 space-y-4">
          {sentence.pattern && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="size-4 text-primary" />
                  句型模板
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-sm font-semibold text-primary">{sentence.pattern}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {sentence.patternExamples && sentence.patternExamples.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">句型例句</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {sentence.patternExamples.map((ex, ei) => {
                  const exampleEn = Array.isArray(ex) ? ex[0] : ex.en;
                  const exampleCn = Array.isArray(ex) ? ex[1] : ex.cn;
                  const curatedWords = Array.isArray(ex) ? [] : (ex.words || []);
                  const exampleWordCards = getCompleteSentenceWords(
                    { ...sentence, en: exampleEn, words: curatedWords },
                    WORD_REFERENCE_INDEX,
                  );
                  let wordCursor = 0;

                  return (
                    <div
                      key={ei}
                      className="rounded-lg border border-border/30 bg-accent/20 px-4 py-3 space-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-foreground flex-1 leading-relaxed">
                          {splitEnglishText(exampleEn).map((segment, segmentIndex) => {
                            if (segment.kind === 'separator') {
                              return <span key={segmentIndex}>{segment.text}</span>;
                            }

                            const word = exampleWordCards[wordCursor++];
                            const cardKey = `pattern-word-${ei}-${segmentIndex}`;
                            if (!word) return <span key={segmentIndex}>{segment.text}</span>;

                            return (
                              <Popover key={segmentIndex}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="rounded-sm px-0.5 font-semibold text-foreground underline decoration-primary/40 decoration-2 underline-offset-4 hover:bg-primary/10 hover:text-primary transition-colors"
                                    title={`查看单词卡：${word.w}`}
                                  >
                                    {segment.text}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-72 p-0">
                                  <div className="space-y-3 p-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-lg font-bold text-foreground">{word.w}</span>
                                      {word.ipa && (
                                        <span className="text-xs font-mono text-muted-foreground">{word.ipa}</span>
                                      )}
                                      {word.pos && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                          {word.pos}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-foreground/80">{word.cn}</p>
                                    <div className="flex gap-2 pt-1">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 h-8 text-xs"
                                        onClick={() => playMiniTTS(word.w, cardKey)}
                                      >
                                        <Volume2 className={`size-3.5 mr-1.5 ${miniPlaying === cardKey ? 'text-primary animate-pulse' : ''}`} />
                                        朗读
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={isFavorited(word.w) ? 'secondary' : 'default'}
                                        className="flex-1 h-8 text-xs"
                                        onClick={() => {
                                          if (isFavorited(word.w)) {
                                            const favId = getFavoriteId(word.w);
                                            if (favId) removeFavorite(favId);
                                            toast.success(`已取消收藏: ${word.w}`);
                                          } else {
                                            const response = `**${word.w}** ${word.ipa || ''}\n\n${word.pos ? `*${word.pos}* ` : ''}${word.cn}`;
                                            addFavorite(word.w, response);
                                            toast.success(`已收藏单词: ${word.w}`);
                                          }
                                        }}
                                      >
                                        {isFavorited(word.w) ? (
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
                          })}
                        </p>
                        <button
                          type="button"
                          onClick={() => playMiniTTS(exampleEn, `pattern-example-${ei}`)}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          title="朗读英文例句"
                          aria-label={`朗读例句：${exampleEn}`}
                        >
                          <Volume2 className={`size-4 ${miniPlaying === `pattern-example-${ei}` ? 'text-primary animate-pulse' : ''}`} />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{exampleCn}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {!sentence.pattern &&
            (!sentence.patternExamples || sentence.patternExamples.length === 0) && (
              <EmptyState text="本句暂无句型模板" />
            )}
        </TabsContent>

        {/* Pronunciation tab */}
        <TabsContent value="pronunciation" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mic className="size-4 text-primary" />
                发音要点
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">音标</p>
                <p className="text-base font-mono text-foreground tracking-wide">{sentence.ipa}</p>
              </div>
              {sentence.pronunciation && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">发音技巧</p>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {sentence.pronunciation}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz tab */}
        <TabsContent value="quiz" className="mt-4 space-y-4">
          {sentence.quiz && sentence.quiz.length > 0 ? (
            sentence.quiz.map((item, qi) => {
              const isRevealed = revealedQuiz[qi] ?? false;
              const isCorrect = quizAnswers[qi] ?? false;
              return (
                <Card key={qi}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-start gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {qi + 1}
                      </span>
                      {item.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {!isRevealed && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">点击显示答案：</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuizAnswer(qi, 0, 0)
                          }
                        >
                          查看答案
                        </Button>
                      </div>
                    )}
                    {isRevealed && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                        <p className="text-xs font-medium text-primary mb-1">参考答案</p>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState text="本句暂无测验题" />
          )}
        </TabsContent>
      </Tabs>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PenLine className="size-4 text-primary" />
            我的笔记
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Textarea
            value={noteText}
            onChange={(e) => {
              if (e.target.value.length <= 5000) {
                setNoteText(e.target.value);
                setNoteSaved(false);
              }
            }}
            placeholder="在这里记录你对这个句子的理解、笔记或心得..."
            className="min-h-[120px] resize-y bg-background border-border/60 text-sm leading-relaxed"
            maxLength={5000}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {noteText.length} / 5000
            </span>
            <Button
              size="sm"
              variant={noteSaved ? 'secondary' : 'default'}
              onClick={handleNoteSave}
              disabled={noteSaved}
              className="h-7 text-xs gap-1"
            >
              {noteSaved ? (
                <><Check className="size-3" /> 已保存</>
              ) : (
                '保存笔记'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation: prev / next */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {adjacentSentences.prev ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/browse/${adjacentSentences.prev.id}`)}
          >
            <ArrowLeft className="size-4 mr-1" />
            上一句
          </Button>
        ) : (
          <div />
        )}
        {adjacentSentences.next ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/browse/${adjacentSentences.next.id}`)}
          >
            下一句
            <ChevronRight className="size-4 ml-1" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <BookOpen className="size-8 mb-3 opacity-40" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
