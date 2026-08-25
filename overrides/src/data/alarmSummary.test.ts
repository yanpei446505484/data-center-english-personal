import { describe, expect, it } from 'vitest';
import { ALARM_CATEGORIES, ALARM_SUMMARY } from './alarmSummary';

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
});
