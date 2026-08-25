import { describe, expect, it } from 'vitest';
import { ALARM_CATEGORIES, ALARM_SUMMARY } from './alarmSummary';
import { ALARM_CHINESE } from './alarmChinese';
import { ALARM_WORD_CHINESE } from './alarmWordDictionary';

describe('alarm summary import', () => {
  it('imports all 162 deduplicated alarms', () => {
    expect(ALARM_SUMMARY).toHaveLength(162);
    expect(new Set(ALARM_SUMMARY.map((entry) => entry.id)).size).toBe(162);
    expect(new Set(ALARM_SUMMARY.map(
      (entry) => `${entry.category}\0${entry.alarm}`.toLowerCase(),
    )).size).toBe(162);
  });

  it('preserves the 15 source system categories', () => {
    expect(ALARM_CATEGORIES).toHaveLength(15);
    expect(ALARM_CATEGORIES).toContain('UPS System');
    expect(ALARM_CATEGORIES).toContain('Precision Air Conditioning');
  });

  it('provides a Chinese meaning for every alarm', () => {
    expect(Object.keys(ALARM_CHINESE)).toHaveLength(162);
    for (const entry of ALARM_SUMMARY) {
      expect(ALARM_CHINESE[entry.id]?.trim().length).toBeGreaterThan(0);
    }
  });

  it('provides a data-centre Chinese meaning for every alarm word', () => {
    const words = new Set(
      ALARM_SUMMARY.flatMap((entry) =>
        (entry.alarm.match(/[A-Za-z]+(?:-[A-Za-z]+)*/g) || [])
          .map((word) => word.toLowerCase()),
      ),
    );
    expect(words.size).toBe(190);
    for (const word of words) {
      expect(ALARM_WORD_CHINESE[word], `missing translation: ${word}`).toBeTruthy();
    }
  });
});
