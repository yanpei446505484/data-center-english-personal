import { beforeEach, describe, expect, it } from 'vitest';
import { getReadCount, incrementReadCount } from './readCounts';

describe('readCounts', () => {
  beforeEach(() => localStorage.clear());

  it('persists sentence counts independently', () => {
    expect(incrementReadCount('sentence', 5)).toBe(1);
    expect(incrementReadCount('sentence', 5)).toBe(2);
    expect(getReadCount('sentence', 6)).toBe(0);
  });

  it('shares a word count regardless of letter case', () => {
    incrementReadCount('word', 'Dashboard');
    expect(getReadCount('word', 'dashboard')).toBe(1);
  });
});
