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
import { ALARM_CATEGORIES, ALARM_SUMMARY } from '@/data/alarmSummary';
import { ALARM_CHINESE } from '@/data/alarmChinese';
import {
  ALARM_CHAT_DIALOGUE,
  ALARM_ACCESS_MAINTENANCE_DIALOGUE,
  ALARM_TREND_DRILL_DIALOGUE,
  ALARM_WATER_SUPPLY_DIALOGUE,
  type AlarmChatLine,
} from '@/data/alarmChatDialogue';
import { ALARM_MEETING_SCRIPTS, type AlarmMeetingLine } from '@/data/alarmMeetingScripts';
import { getAlarmPhraseCards, type AlarmPhraseCard } from '@/data/alarmPhrases';
import { ALARM_WORD_CHINESE } from '@/data/alarmWordDictionary';
import { getAlarmTextIpa, getAlarmWordIpa } from '@/data/alarmPhonetics';
import { PUMP_MAINTENANCE_DIALOGUES, PUMP_PRINCIPLE_CN } from '@/data/pumpMaintenanceDialogues';
import { PUMP_WORD_CHINESE } from '@/data/pumpWordGlossary';
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
    chinese: ALARM_WORD_CHINESE[normalized] || PUMP_WORD_CHINESE[normalized] || dictionary?.chinese || '暂无本地释义',
    example: alarm,
    tags: [CATEGORY_CN[category] || category, '告警英语'],
    ukIpa: dictionary?.ipa || getAlarmWordIpa(word, alarm),
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

function AlarmPhrase({ phrase, alarm, category }: {
  phrase: AlarmPhraseCard;
  alarm: string;
  category: string;
}) {
  const data = {
    word: phrase.text,
    chinese: phrase.chinese,
    example: alarm,
    tags: [CATEGORY_CN[category] || category, phrase.fullAlarm ? '完整告警短语' : '专业短语'],
    pos: phrase.fullAlarm ? '完整告警短语' : '告警短语',
    dataCenterMeaning: phrase.chinese,
    ukIpa: getAlarmTextIpa(phrase.text),
    simpleMeaning: phrase.fullAlarm ? '完整告警表达' : '数据中心现场专业短语',
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-md border border-border/50 bg-muted/25 px-2.5 py-1.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/10"
          title={`查看短语卡：${phrase.text}`}
        >
          <span className="block text-xs font-semibold text-foreground">{phrase.text}</span>
          <span className="block text-[11px] text-muted-foreground mt-0.5">{phrase.chinese}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(24rem,calc(100vw-2rem))] p-2">
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
  const [playingKey, setPlayingKey] = useState<string | null>(null);
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
    setPlayingKey(null);
    setPlayingRound(0);
  }, []);

  const playText = useCallback((key: string, text: string) => {
    if (playingKey === key) {
      stopPlayback();
      return;
    }

    warmupAudio();
    stopPlayback();
    abortRef.current = false;
    setPlayingKey(key);
    let round = 0;

    const playNext = () => {
      if (abortRef.current) return;
      round += 1;
      setPlayingRound(round);
      stopRef.current = speakWithPlugin(text, () => {
        stopRef.current = null;
        if (abortRef.current) return;
        if (round >= repeatCount) {
          setPlayingKey(null);
          setPlayingRound(0);
          return;
        }
        timerRef.current = setTimeout(playNext, 350);
      }, 'british');
    };

    playNext();
  }, [playingKey, repeatCount, stopPlayback]);

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
          数据中心去重告警清单；每条告警均列出单词和专业短语，点击即可查看并朗读对应卡片。
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

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">现场告警会议标准话术</h2>
            <Badge variant="secondary">{ALARM_MEETING_SCRIPTS.length}句</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            已按数据中心现场会议口语校准；点击单词或短语查看卡片，右侧可朗读整句。
          </p>
          <div className="grid gap-3">
            {ALARM_MEETING_SCRIPTS.map((line: AlarmMeetingLine) => {
              const key = `meeting-${line.id}`;
              const isPlaying = playingKey === key;
              return (
                <div key={line.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 font-mono">M{line.id}</Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                        {splitEnglishText(line.en).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="现场告警会议" />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70">{line.cn}</p>
                      <div className="flex flex-wrap gap-2">
                        {line.phrases.map((phrase) => (
                          <AlarmPhrase
                            key={phrase.text}
                            phrase={{ ...phrase, fullAlarm: false }}
                            alarm={line.en}
                            category="现场告警会议"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playText(key, line.en)}
                      className="shrink-0 gap-1.5"
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">现场工作聊天标准对话</h2>
            <Badge variant="secondary">{ALARM_CHAT_DIALOGUE.length}句</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            已按现场真实语境校准并按顺序整理；每个单词和短语均可打开卡片、查看音标、朗读并记录笔记。
          </p>
          <div className="grid gap-3">
            {ALARM_CHAT_DIALOGUE.map((line: AlarmChatLine) => {
              const key = `dialogue-${line.id}`;
              const isPlaying = playingKey === key;
              return (
                <div key={line.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={line.speaker === 'A' ? 'default' : 'outline'}
                      className="shrink-0 font-mono"
                    >
                      {line.speaker}
                    </Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                        {splitEnglishText(line.en).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="现场工作对话" />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70">{line.cn}</p>
                      <div className="flex flex-wrap gap-2">
                        {line.phrases.map((phrase) => (
                          <AlarmPhrase
                            key={`${line.id}-${phrase.text}`}
                            phrase={{ ...phrase, fullAlarm: false }}
                            alarm={line.en}
                            category="现场工作对话"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playText(key, line.en)}
                      className="shrink-0 gap-1.5"
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">水泵趋势、演练与故障工单对话</h2>
            <Badge variant="secondary">{ALARM_TREND_DRILL_DIALOGUE.length}句</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            覆盖趋势检查、设备状态、应急演练、照片补拍以及ELV故障工单分派。
          </p>
          <div className="grid gap-3">
            {ALARM_TREND_DRILL_DIALOGUE.map((line: AlarmChatLine) => {
              const key = `trend-dialogue-${line.id}`;
              const isPlaying = playingKey === key;
              return (
                <div key={line.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={line.speaker === 'A' ? 'default' : 'outline'}
                      className="shrink-0 font-mono"
                    >
                      {line.speaker}
                    </Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                        {splitEnglishText(line.en).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="现场工作对话" />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70">{line.cn}</p>
                      <div className="flex flex-wrap gap-2">
                        {line.phrases.map((phrase) => (
                          <AlarmPhrase
                            key={`${line.id}-${phrase.text}`}
                            phrase={{ ...phrase, fullAlarm: false }}
                            alarm={line.en}
                            category="现场工作对话"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playText(key, line.en)}
                      className="shrink-0 gap-1.5"
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">访客登记、变更工单与登录排障对话</h2>
            <Badge variant="secondary">{ALARM_ACCESS_MAINTENANCE_DIALOGUE.length}句</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            覆盖司机资料、临时访问权限、膨胀阀更换、系统登录和网线排障；真实证件号码已隐藏。
          </p>
          <div className="grid gap-3">
            {ALARM_ACCESS_MAINTENANCE_DIALOGUE.map((line: AlarmChatLine) => {
              const key = `access-dialogue-${line.id}`;
              const isPlaying = playingKey === key;
              return (
                <div key={line.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={line.speaker === 'A' ? 'default' : 'outline'}
                      className="shrink-0 font-mono"
                    >
                      {line.speaker}
                    </Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                        {splitEnglishText(line.en).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="现场工作对话" />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70">{line.cn}</p>
                      <div className="flex flex-wrap gap-2">
                        {line.phrases.map((phrase) => (
                          <AlarmPhrase
                            key={`${line.id}-${phrase.text}`}
                            phrase={{ ...phrase, fullAlarm: false }}
                            alarm={line.en}
                            category="现场工作对话"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playText(key, line.en)}
                      className="shrink-0 gap-1.5"
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">低水压、供水端与应急响应对话</h2>
            <Badge variant="secondary">{ALARM_WATER_SUPPLY_DIALOGUE.length}句</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            覆盖传感器排查、水箱检查、边界供水压力、手动补水及应急流程。
          </p>
          <div className="grid gap-3">
            {ALARM_WATER_SUPPLY_DIALOGUE.map((line: AlarmChatLine) => {
              const key = `water-supply-dialogue-${line.id}`;
              const isPlaying = playingKey === key;
              return (
                <div key={line.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={line.speaker === 'A' ? 'default' : 'outline'}
                      className="shrink-0 font-mono"
                    >
                      {line.speaker}
                    </Badge>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                        {splitEnglishText(line.en).map((segment, index) => (
                          segment.kind === 'word'
                            ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="现场工作对话" />
                            : <span key={index}>{segment.text}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70">{line.cn}</p>
                      <div className="flex flex-wrap gap-2">
                        {line.phrases.map((phrase) => (
                          <AlarmPhrase
                            key={`${line.id}-${phrase.text}`}
                            phrase={{ ...phrase, fullAlarm: false }}
                            alarm={line.en}
                            category="现场工作对话"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isPlaying ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => playText(key, line.en)}
                      className="shrink-0 gap-1.5"
                    >
                      {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                      {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">冷却水泵故障维修与日常巡检</h2>
            <Badge variant="secondary">{PUMP_MAINTENANCE_DIALOGUES.length}组 · 80句</Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{PUMP_PRINCIPLE_CN}</p>
          <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-xs leading-relaxed text-foreground/75">
            安全提示：以下内容用于英语和排查思路学习，不代替现场SOP、MOP、PTW、LOTO、厂家手册或风险评估。任何停机、拆解、带压系统、电气端子和化学清洗操作，都必须由授权人员按批准程序执行。
          </div>
          <div className="grid gap-3">
            {PUMP_MAINTENANCE_DIALOGUES.map((scenario) => (
              <details key={scenario.id} className="group rounded-lg border border-border/50 bg-muted/10">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                  <Badge variant={scenario.kind === '故障维修' ? 'destructive' : 'secondary'}>
                    {scenario.kind}{scenario.id > 10 ? scenario.id - 10 : scenario.id}
                  </Badge>
                  <span className="flex-1 text-sm font-semibold text-foreground">{scenario.title}</span>
                  <span className="text-xs text-muted-foreground group-open:hidden">展开</span>
                  <span className="hidden text-xs text-muted-foreground group-open:inline">收起</span>
                </summary>
                <div className="space-y-3 border-t border-border/50 p-3">
                  <div className="rounded-md bg-muted/30 p-2.5 text-xs leading-relaxed text-foreground/75">
                    <span className="font-semibold text-primary">排查说明：</span>{scenario.causeCn}
                  </div>
                  {scenario.lines.map((line) => {
                    const key = `pump-${scenario.id}-${line.id}`;
                    const isPlaying = playingKey === key;
                    return (
                      <div key={line.id} className="flex items-start gap-3 rounded-md border border-border/40 bg-background/40 p-3">
                        <Badge variant={line.speaker === 'A' ? 'default' : 'outline'} className="shrink-0 font-mono">
                          {line.speaker}
                        </Badge>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-x-1 text-sm leading-7">
                            {splitEnglishText(line.en).map((segment, index) => (
                              segment.kind === 'word'
                                ? <AlarmWord key={index} word={segment.text} alarm={line.en} category="冷却水泵运维" />
                                : <span key={index}>{segment.text}</span>
                            ))}
                          </div>
                          <p className="text-sm text-foreground/70">{line.cn}</p>
                          <div className="flex flex-wrap gap-2">
                            {line.phrases.map((phrase) => (
                              <AlarmPhrase
                                key={`${scenario.id}-${line.id}-${phrase.text}`}
                                phrase={{ ...phrase, fullAlarm: false }}
                                alarm={line.en}
                                category="冷却水泵运维"
                              />
                            ))}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant={isPlaying ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => playText(key, line.en)}
                          className="shrink-0 gap-1.5"
                        >
                          {isPlaying ? <Square className="size-3.5 fill-current" /> : <Volume2 className="size-3.5" />}
                          {isPlaying && playingRound > 0 ? `${playingRound}/${repeatCount}` : '朗读'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((entry) => {
            const alarmKey = `alarm-${entry.id}`;
            const isPlaying = playingKey === alarmKey;
            const phrases = getAlarmPhraseCards(entry);
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
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-primary">专业短语（{phrases.length}）</div>
                        <div className="flex flex-wrap gap-2">
                          {phrases.map((phrase) => (
                            <AlarmPhrase
                              key={`${entry.id}-${phrase.text}`}
                              phrase={phrase}
                              alarm={entry.alarm}
                              category={entry.category}
                            />
                          ))}
                        </div>
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
                      onClick={() => playText(alarmKey, entry.alarm)}
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
