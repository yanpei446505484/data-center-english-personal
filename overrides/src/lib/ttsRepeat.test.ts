import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadTtsRepeat,
  normalizeTtsRepeat,
  saveTtsRepeat,
} from './ttsRepeat';

describe('ttsRepeat', () => {
  beforeEach(() => localStorage.clear());

  it('accepts only the supported repeat counts', () => {
    expect(normalizeTtsRepeat(3)).toBe(3);
    expect(normalizeTtsRepeat('10')).toBe(10);
    expect(normalizeTtsRepeat(4)).toBe(1);
    expect(normalizeTtsRepeat('bad')).toBe(1);
  });

  it('stores sentence and word settings independently', () => {
    saveTtsRepeat('sentence', 5);
    saveTtsRepeat('word', 2);

    expect(loadTtsRepeat('sentence')).toBe(5);
    expect(loadTtsRepeat('word')).toBe(2);
  });
});
