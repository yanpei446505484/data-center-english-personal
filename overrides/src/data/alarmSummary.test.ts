import { describe, expect, it } from 'vitest';
import { ALARM_CATEGORIES, ALARM_SUMMARY } from './alarmSummary';
import { ALARM_CHINESE } from './alarmChinese';
import { ALARM_WORD_CHINESE } from './alarmWordDictionary';
import { getAlarmPhraseCards } from './alarmPhrases';
import { ALARM_MEETING_SCRIPTS } from './alarmMeetingScripts';
import { getAlarmTextIpa, getAlarmWordIpa } from './alarmPhonetics';

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

  it('lists translated phrase cards for every alarm', () => {
    for (const entry of ALARM_SUMMARY) {
      const phrases = getAlarmPhraseCards(entry);
      expect(phrases.length, `no phrases: ${entry.alarm}`).toBeGreaterThan(0);
      expect(phrases[0].text).toBe(entry.alarm);
      for (const phrase of phrases) {
        expect(phrase.chinese.trim().length, `missing phrase translation: ${phrase.text}`).toBeGreaterThan(0);
      }
    }

    expect(getAlarmPhraseCards(ALARM_SUMMARY[2]).map((phrase) => phrase.text)).toEqual([
      'HV Overcurrent Protection Activated',
      'overcurrent protection',
      'protection activated',
    ]);
    expect(getAlarmPhraseCards(ALARM_SUMMARY[5]).map((phrase) => phrase.text)).toContain('earth fault protection');
    expect(getAlarmPhraseCards(ALARM_SUMMARY[0]).map((phrase) => phrase.text)).toEqual([
      'HV Power Supply Interruption',
      'hv power supply',
      'power supply interruption',
      'power supply',
    ]);
  });

  it('provides reviewed bilingual meeting scripts and phrase cards', () => {
    expect(ALARM_MEETING_SCRIPTS).toHaveLength(8);
    for (const line of ALARM_MEETING_SCRIPTS) {
      expect(line.en.trim().length).toBeGreaterThan(0);
      expect(line.cn.trim().length).toBeGreaterThan(0);
      expect(line.phrases.length).toBeGreaterThan(0);
      for (const phrase of line.phrases) {
        expect(line.en.toLowerCase()).toContain(phrase.text.toLowerCase());
        expect(phrase.chinese.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('provides IPA for every alarm and meeting word and phrase', () => {
    const texts = [
      ...ALARM_SUMMARY.map((entry) => entry.alarm),
      ...ALARM_MEETING_SCRIPTS.map((line) => line.en),
    ];
    for (const text of texts) {
      const words = text.match(/[A-Za-z]+(?:[’'][A-Za-z]+)*(?:-[A-Za-z]+)*/g) || [];
      for (const word of words) {
        expect(getAlarmWordIpa(word, text), `missing IPA: ${word}`).toBeTruthy();
      }
      expect(getAlarmTextIpa(text)).toMatch(/^\/ .+ \/$/);
    }
    for (const line of ALARM_MEETING_SCRIPTS) {
      for (const phrase of line.phrases) expect(getAlarmTextIpa(phrase.text)).toBeTruthy();
    }
  });
});
