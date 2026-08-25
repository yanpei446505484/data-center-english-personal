import { storage } from '@/lib/storage';
import { userStorageKey } from '@/lib/userStorage';

export type ReadCountTarget = 'sentence' | 'word';

const PREFIX = '__app_dc_read_count_';

function targetKey(target: ReadCountTarget, id: string | number): string {
  const normalized = String(id).trim().toLocaleLowerCase('en-US');
  return userStorageKey(`${PREFIX}${target}_${encodeURIComponent(normalized)}`);
}

export function getReadCount(target: ReadCountTarget, id: string | number): number {
  const value = Number(storage.getItem(targetKey(target, id)) || 0);
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

export function incrementReadCount(target: ReadCountTarget, id: string | number): number {
  const next = getReadCount(target, id) + 1;
  storage.setItem(targetKey(target, id), String(next));
  return next;
}
