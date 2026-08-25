import { storage } from '@/lib/storage';
import { userStorageKey } from '@/lib/userStorage';

export const TTS_REPEAT_OPTIONS = [1, 2, 3, 5, 10] as const;
export type TtsRepeatCount = (typeof TTS_REPEAT_OPTIONS)[number];
export type TtsRepeatTarget = 'sentence' | 'word';

const DEFAULT_REPEAT: TtsRepeatCount = 1;
const KEY_PREFIX = '__app_dc_tts_repeat_';

export function normalizeTtsRepeat(value: unknown): TtsRepeatCount {
  const numberValue = Number(value);
  return TTS_REPEAT_OPTIONS.includes(numberValue as TtsRepeatCount)
    ? (numberValue as TtsRepeatCount)
    : DEFAULT_REPEAT;
}

export function loadTtsRepeat(target: TtsRepeatTarget): TtsRepeatCount {
  return normalizeTtsRepeat(
    storage.getItem(userStorageKey(`${KEY_PREFIX}${target}`)),
  );
}

export function saveTtsRepeat(
  target: TtsRepeatTarget,
  value: unknown,
): TtsRepeatCount {
  const normalized = normalizeTtsRepeat(value);
  storage.setItem(
    userStorageKey(`${KEY_PREFIX}${target}`),
    String(normalized),
  );
  return normalized;
}
