import type { ISentence, ISentencePhrase } from '@/data/sentenceLearning';

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

export function getSentenceCardModel(sentence: ISentence) {
  const segments = splitEnglishText(sentence.en);
  return {
    segments,
    words: segments.filter((segment) => segment.kind === 'word'),
    phrases: getPhraseCards(sentence),
  };
}
