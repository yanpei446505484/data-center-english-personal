import { describe, expect, it } from 'vitest';
import { MOCK_SENTENCES } from '@/data/sentenceLearning';
import {
  buildWordReferenceIndex,
  getCompletePhraseCards,
  getCompleteSentenceWords,
  getSentenceCardModel,
  splitEnglishText,
} from './sentenceCards';

describe('sentence vocabulary card model', () => {
  it('preserves punctuation while separating every English word', () => {
    const text = "Don't re-energize UPS-1, please.";
    const segments = splitEnglishText(text);

    expect(segments.map((segment) => segment.text).join('')).toBe(text);
    expect(segments.filter((segment) => segment.kind === 'word').map((segment) => segment.text))
      .toEqual(["Don't", 're-energize', 'UPS', 'please']);
  });

  it('creates individual word and phrase card models for all 2,600 sentences', () => {
    expect(MOCK_SENTENCES).toHaveLength(2600);

    let totalWordCards = 0;
    let totalPhraseCards = 0;
    for (const sentence of MOCK_SENTENCES) {
      const model = getSentenceCardModel(sentence);
      expect(model.segments.map((segment) => segment.text).join('')).toBe(sentence.en);
      expect(model.words.length).toBeGreaterThan(0);
      expect(model.phrases).toHaveLength(
        sentence.phrases.filter((phrase) => (phrase.p || phrase.phrase || '').trim()).length,
      );
      for (const phrase of model.phrases) {
        expect(phrase.text).not.toBe('');
        expect(phrase.chinese).not.toBe('');
      }
      totalWordCards += model.words.length;
      totalPhraseCards += model.phrases.length;
    }

    expect(totalWordCards).toBeGreaterThan(10_000);
    expect(totalPhraseCards).toBeGreaterThan(2_500);
  });

  it('lists every word occurrence in order on all 2,600 sentence detail pages', () => {
    const referenceIndex = buildWordReferenceIndex(MOCK_SENTENCES);
    let total = 0;

    for (const sentence of MOCK_SENTENCES) {
      const expected = splitEnglishText(sentence.en)
        .filter((segment) => segment.kind === 'word')
        .map((segment) => segment.text);
      const complete = getCompleteSentenceWords(sentence, referenceIndex);

      expect(complete.map((word) => word.w)).toEqual(expected);
      expect(complete.every((word) => word.cn.trim().length > 0)).toBe(true);
      total += complete.length;
    }

    expect(total).toBe(16_693);
  });

  it('merges all valid curated, collocation and dictionary phrases', () => {
    const referenceIndex = buildWordReferenceIndex(MOCK_SENTENCES);
    const sentence = MOCK_SENTENCES.find((item) => item.id === 5)!;
    const words = getCompleteSentenceWords(sentence, referenceIndex);
    const phrases = getCompletePhraseCards(sentence, words);

    expect(words.map((word) => word.w)).toEqual([
      'Please', 'switch', 'to', 'the', 'BMS', 'dashboard',
    ]);
    expect(phrases.map((phrase) => phrase.text)).toEqual(
      expect.arrayContaining(['switch to', 'BMS dashboard']),
    );
  });
});
