import type {
  ISentence,
  ISentencePhrase,
  ISentenceWord,
} from '@/data/sentenceLearning';
import { lookupDictionary } from '@/skills/dictionarySkill';
import { lemmatize } from '@/skills/lemmatizeSkill';
import { detectPhrases } from '@/skills/phraseSkill';

export interface IEnglishTextSegment {
  text: string;
  kind: 'word' | 'separator';
}

export interface IPhraseCardData {
  text: string;
  ipa: string;
  chinese: string;
  explanation: string;
}

export interface ICompleteSentenceWord extends ISentenceWord {
  w: string;
  occurrence: number;
}

// Keeps punctuation and whitespace in their original positions while making
// every English word (including contractions and hyphenated terms) addressable.
const ENGLISH_WORD_PATTERN = /[A-Za-z]+(?:[’'][A-Za-z]+)*(?:-[A-Za-z]+(?:[’'][A-Za-z]+)*)*/g;

export function splitEnglishText(text: string): IEnglishTextSegment[] {
  const segments: IEnglishTextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ENGLISH_WORD_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), kind: 'separator' });
    }
    segments.push({ text: match[0], kind: 'word' });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), kind: 'separator' });
  }

  return segments;
}

export function normalizeCardTerm(value: string): string {
  return value.toLowerCase().replaceAll('’', "'").trim();
}

function wordText(word: ISentenceWord): string {
  return (word.w || word.word || '').trim();
}

function normalizedWords(value: string): string[] {
  return splitEnglishText(value)
    .filter((segment) => segment.kind === 'word')
    .map((segment) => normalizeCardTerm(segment.text));
}

function containsWordSequence(sentence: string, candidate: string): boolean {
  const sentenceWords = normalizedWords(sentence);
  const candidateWords = normalizedWords(candidate);
  if (candidateWords.length < 2 || candidateWords.length > sentenceWords.length) return false;

  return sentenceWords.some((_, start) =>
    candidateWords.every((word, offset) => sentenceWords[start + offset] === word),
  );
}

export function buildWordReferenceIndex(sentences: ISentence[]): Map<string, ISentenceWord> {
  const index = new Map<string, ISentenceWord>();
  for (const sentence of sentences) {
    for (const word of sentence.words || []) {
      const text = wordText(word);
      if (!text) continue;
      const normalized = normalizeCardTerm(text);
      if (!index.has(normalized)) index.set(normalized, word);
      const lemma = lemmatize(normalized);
      if (!index.has(lemma)) index.set(lemma, word);
    }
  }
  return index;
}

/**
 * Returns every word occurrence in sentence order. Curated sentence metadata is
 * preferred, then metadata from the full 2,600-sentence corpus, then the local
 * dictionary. Function words are intentionally retained.
 */
export function getCompleteSentenceWords(
  sentence: ISentence,
  referenceIndex: Map<string, ISentenceWord>,
): ICompleteSentenceWord[] {
  const localIndex = new Map<string, ISentenceWord>();
  for (const word of sentence.words || []) {
    const text = wordText(word);
    if (!text) continue;
    localIndex.set(normalizeCardTerm(text), word);
    localIndex.set(lemmatize(normalizeCardTerm(text)), word);
  }

  return splitEnglishText(sentence.en)
    .filter((segment) => segment.kind === 'word')
    .map((segment, occurrence) => {
      const normalized = normalizeCardTerm(segment.text);
      const lemma = lemmatize(normalized);
      const curated = localIndex.get(normalized)
        || localIndex.get(lemma)
        || referenceIndex.get(normalized)
        || referenceIndex.get(lemma);
      const dictionary = lookupDictionary(normalized, lemma, sentence.en);

      return {
        ...(curated || {}),
        w: segment.text,
        word: segment.text,
        occurrence,
        ipa: curated?.ipa || dictionary?.ipa || '',
        pos: curated?.pos || dictionary?.pos || '单词',
        cn: curated?.cn || dictionary?.chinese || '暂无本地释义',
      };
    });
}

export function getPhraseText(phrase: ISentencePhrase): string {
  return (phrase.p || phrase.phrase || '').trim();
}

export function getPhraseCards(sentence: ISentence): IPhraseCardData[] {
  return (sentence.phrases || [])
    .map((phrase) => ({
      text: getPhraseText(phrase),
      ipa: phrase.ipa || '',
      chinese: phrase.cn || '',
      explanation: phrase.why || '',
    }))
    .filter((phrase) => phrase.text.length > 0);
}

/**
 * Builds the complete valid phrase list for a sentence from three reviewed
 * sources: curated sentence phrases, collocations attached to its words, and
 * the professional/basic phrase dictionaries. Only contiguous phrases that
 * actually occur in the sentence are kept.
 */
export function getCompletePhraseCards(
  sentence: ISentence,
  completeWords: ISentenceWord[] = sentence.words || [],
): IPhraseCardData[] {
  const phrases = new Map<string, IPhraseCardData>();
  const add = (card: IPhraseCardData) => {
    const text = card.text.trim();
    if (!containsWordSequence(sentence.en, text)) return;
    const key = normalizeCardTerm(normalizedWords(text).join(' '));
    if (!phrases.has(key)) phrases.set(key, { ...card, text });
  };

  for (const card of getPhraseCards(sentence)) add(card);

  for (const word of completeWords) {
    for (const collocation of word.collocations || []) {
      const [text, chinese = '常见搭配'] = collocation;
      if (!text) continue;
      add({
        text,
        ipa: '',
        chinese,
        explanation: `本句中的常见搭配：${text}`,
      });
    }
  }

  for (const detected of detectPhrases(sentence.en)) {
    add({
      text: detected.phrase,
      ipa: '',
      chinese: detected.chinese,
      explanation: detected.source === 'professional'
        ? '数据中心及运维场景中的专业固定搭配。'
        : '英语中的常用固定搭配。',
    });
  }

  return [...phrases.values()].sort((a, b) => {
    const positionDiff = sentence.en.toLowerCase().indexOf(a.text.toLowerCase())
      - sentence.en.toLowerCase().indexOf(b.text.toLowerCase());
    if (positionDiff !== 0) return positionDiff;
    return normalizedWords(b.text).length - normalizedWords(a.text).length;
  });
}

export function getSentenceCardModel(sentence: ISentence) {
  const segments = splitEnglishText(sentence.en);
  return {
    segments,
    words: segments.filter((segment) => segment.kind === 'word'),
    phrases: getPhraseCards(sentence),
  };
}
