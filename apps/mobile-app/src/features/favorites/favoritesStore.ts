import { useCallback, useSyncExternalStore } from 'react';
import {
  getFavoriteRecords,
  setFavoriteRecords,
  type FavoriteRecord,
} from '@/storage/localStorage';
import type { ContentKind } from '@/types/content';

export type { FavoriteRecord };

const listeners = new Set<() => void>();

let records: FavoriteRecord[] = [];

function favoriteKey(id: string, kind: ContentKind): string {
  return `${kind}:${id}`;
}

function dedupeFavoriteRecords(items: FavoriteRecord[]): FavoriteRecord[] {
  const map = new Map<string, FavoriteRecord>();
  for (const r of items) {
    const k = favoriteKey(r.id, r.kind);
    const prev = map.get(k);
    if (!prev || r.timestamp > prev.timestamp) {
      map.set(k, r);
    }
  }
  return [...map.values()];
}

function sortRecentFirst(items: FavoriteRecord[]): FavoriteRecord[] {
  return [...items].sort((a, b) => b.timestamp - a.timestamp);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Snapshot sorted by `timestamp` descending (recent first). */
export function getFavoritesSnapshot(): FavoriteRecord[] {
  return sortRecentFirst(dedupeFavoriteRecords(records));
}

export function isFavorite(id: string, kind: ContentKind): boolean {
  return records.some((r) => r.id === id && r.kind === kind);
}

async function persist(): Promise<void> {
  records = dedupeFavoriteRecords(records);
  await setFavoriteRecords(records);
}

/**
 * Load favorites from AsyncStorage and subscribe UI.
 * Call once when the app mounts.
 */
export async function hydrateFavorites(): Promise<void> {
  const loaded = await getFavoriteRecords();
  records = dedupeFavoriteRecords(loaded);
  await persist();
  notify();
}

export async function toggleFavorite(
  id: string,
  kind: ContentKind,
): Promise<void> {
  const has = records.some((r) => r.id === id && r.kind === kind);
  if (has) {
    records = records.filter((r) => !(r.id === id && r.kind === kind));
  } else {
    records = [
      ...records,
      { id, kind, timestamp: Date.now() },
    ];
  }
  records = dedupeFavoriteRecords(records);
  await persist();
  notify();
}

export function useFavoritesSorted(): FavoriteRecord[] {
  return useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesSnapshot,
  );
}

export function useFavoriteToggle(
  id: string,
  kind: ContentKind,
): { isFavorite: boolean; toggleFavorite: () => Promise<void> } {
  const list = useFavoritesSorted();
  const active = list.some((f) => f.id === id && f.kind === kind);
  const toggle = useCallback(() => toggleFavorite(id, kind), [id, kind]);
  return { isFavorite: active, toggleFavorite: toggle };
}
