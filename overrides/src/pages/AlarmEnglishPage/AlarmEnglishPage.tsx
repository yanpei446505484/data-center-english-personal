import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BellRing, BookOpen, Search, Square, Volume2 } from 'lucide-react';

import WordCard from '@/components/WordCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ALARM_CATEGORIES, ALARM_SUMMARY, type AlarmSummaryEntry } from '@/data/alarmSummary';
import { ALARM_CHINESE } from '@/data/alarmChinese';
import { ALARM_WORD_CHINESE } from '@/data/alarmWordDictionary';
import { splitEnglishText } from '@/lib/sentenceCards';
import { preloadTTS, speakWithPlugin, stopAllSpeech, warmupAudio } from '@/lib/ttsPlugin';
import {
  TTS_REPEAT_OPTIONS,
  loadTtsRepeat,
  saveTtsRepeat,
  type TtsRepeatCount,
} from '@/lib/ttsRepeat';
import { lookupDictionary } from '@/skills/dictionarySkill';
import { lemmatize } from '@/skills/lemmatizeSkill';

const CATEGORY_CN: Record<string, string> = {
  'High Voltage System': '高压系统',
  Transformer: '变压器',
  'Low Voltage Distribution': '低压配电',
  'Diesel Generator': '柴油发电机',
  'Fuel Storage / Day Tank': '储油系统／日用油箱',
  'UPS System': 'UPS系统',
  'Battery Pack': '电池组',
  'HVDC / 48V Power Supply': '高压直流／48V电源',
  'Water System (Chiller/Pump/Valve/Tank)': '水系统（冷机／水泵／阀门／水箱）',
  'CDU (Coolant Distribution Unit)': 'CDU冷却液分配单元',
  'Precision Air Conditioning': '精密空调',
  'Phase Change Cooling': '相变冷却',
  'Environment / Water Leak Detection': '环境与漏水检测',
  'Water Source Heat Pump / Heat Exchanger': '水源热泵／换热器',
  Others: '其他',
};

function categoryLabel(category: string): string {
  return CATEGORY_CN[category] ? `${CATEGORY_CN[category]} · ${category}` : category;
}

function AlarmWord({ word, alarm, category }: { word: string; alarm: string; category: string }) {
  const normalized = word.toLowerCase();
  const dictionary = useMemo(
    () => lookupDictionary(normalized, lemmatize(normalized), alarm),
    [alarm, normalized],
  );
  const data = {
    word,
    chinese: ALARM_WORD_CHINESE[normalized] || dictionary?.chinese || '暂无本地释义',
    example: alarm,
    tags: [CATEGORY_CN[category] || category, '告警英语'],
    ukIpa: dictionary?.ipa || '',
    pos: dictionary?.pos || '告警词汇',
    simpleMeaning: dictionary?.englishDef || '',
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-sm px-0.5 font-semibold text-foreground underline decoration-primary/40 decoration-2 underline-offset-4 hover:bg-primary/10 hover:text-primary transition-colors"
          title={`查看单词卡：${word}`}
        >
          {word}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-2">
        <WordCard data={data} />
      </PopoverContent>
    </Popover>
  );
}

export default function AlarmEnglishPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [repeatCount, setRepeatCount] = useState<TtsRepeatCount>(
    () => loadTtsRepeat('sentence'),
  );
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playingRound, setPlayingRound] = useState(0);
  const abortRef = useRef(false);
  const stopRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of ALARM_SUMMARY) {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ALARM_SUMMARY.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (!normalizedQuery) return true;
      return entry.alarm.toLowerCase().includes(normalizedQuery)
        || entry.category.toLowerCase().includes(normalizedQuery)
        || ALARM_CHINESE[entry.id].toLowerCase().includes(normalizedQuery)
        || (CATEGORY_CN[entry.category] || '').includes(query.trim());
    });
  }, [category, query]);

  const stopPlayback = useCallback(() => {
    abortRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopRef.current?.();
    stopRef.current = null;
    stopAllSpeech();
    setPlayingId(null);
    setPlayingRound(0);
  }, []);

  const playAlarm = useCallback((entry: AlarmSummaryEntry) => {
    if (playingId === entry.id) {
      stopPlayback();
      return;
    }

    warmupAudio();
    stopPlayback();
    abortRef.current = false;
    setPlayingId(entry.id);
    let round = 0;

    const playNext = () => {
      if (abortRef.current) return;
      round += 1;
      setPlayingRound(round);
      stopRef.current = speakWithPlugin(entry.alarm, () => {
        stopRef.current = null;
        if (abortRef.current) return;
        if (round >= repeatCount) {
          setPlayingId(null);
          setPlayingRound(0);
          return;
        }
        timerRef.current = setTimeout(playNext, 350);
      }, 'british');
    };

    playNext();
  }, [playingId, repeatCount, stopPlayback]);

  useEffect(() => {
    void preloadTTS(filtered.slice(0, 2).map((entry) => entry.alarm), 'british');
  }, [filtered]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BellRing className="size-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">告警英语</h1>
          <Badge variant="secondary">{ALARM_SUMMARY.length} 条</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          数据中心去重告警清单；点击英文单词查看单词卡，点击喇叭朗读整条告警。
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索告警名称或系统，例如 voltage、UPS、温度……"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="选择系统分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部系统（{ALARM_SUMMARY.length}）</SelectItem>
                {ALARM_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {categoryLabel(item)}（{categoryCounts[item]}）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
              <span>每次朗读</span>
              <select
                value={repeatCount}
                onChange={(event) => {
                  const next = saveTtsRepeat('sentence', event.target.value);
                  setRepeatCount(next);
                }}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                aria-label="选择告警朗读遍数"
              >
                {TTS_REPEAT_OPTIONS.map((count) => (
                  <option key={count} value={count}>{count}遍</option>
                ))}
              </select>
            </label>
          </div>
          <div className="text-xs text-muted-foreground">
            当前显示 {filtered.length} 条 · 共 {ALARM_CATEGORIES.length} 个系统分类
          </div>
        </CardContent>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((entry) => {
            const isPlaying = playingId === entry.id;
            return (
              <Card key={entry.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 font-mono">#{entry.id}</Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-base leading-8">
                        {splitEnglishText(entry.alarm).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={entry.alarm} category={entry.category} />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/75 leading-relaxed">
                        {ALARM_CHINESE[entry.id]}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[11px]">
                          {CATEGORY_CN[entry.category] || entry.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{entry.category}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playAlarm(entry)}
                      className="shrink-0 gap-1.5"
                      aria-label={isPlaying ? `停止朗读：${entry.alarm}` : `朗读：${entry.alarm}`}
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-muted-foreground">
            <BookOpen className="size-8 mb-3 opacity-40" />
            <p className="text-sm">没有找到匹配的告警</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
