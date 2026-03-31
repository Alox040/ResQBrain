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
let favoritesSnapshot: FavoriteRecord[] = [];

function favoriteKey(id: string, kind: ContentKind): string {
  return `${kind}:${id}`;
}

/**
 * Canonical favorite id for {@link toggleFavorite} / {@link isFavorite}: `"medication:<id>"` or `"algorithm:<id>"`.
 */
export function favoriteContentKey(kind: ContentKind, id: string): string {
  return favoriteKey(id.trim(), kind);
}

export function parseFavoriteContentKey(
  contentKey: string,
): { kind: ContentKind; id: string } | null {
  const colon = contentKey.indexOf(':');
  if (colon <= 0) return null;
  const kindRaw = contentKey.slice(0, colon);
  const id = contentKey.slice(colon + 1).trim();
  if (kindRaw !== 'medication' && kindRaw !== 'algorithm') return null;
  if (!id) return null;
  return { kind: kindRaw, id };
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

function refreshSnapshot(): void {
  favoritesSnapshot = sortRecentFirst(dedupeFavoriteRecords(records));
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Sorted by `timestamp` descending (recent first). */
export function getFavorites(): FavoriteRecord[] {
  return favoritesSnapshot;
}

/** @deprecated Prefer {@link getFavorites}. */
export const getFavoritesSnapshot = getFavorites;

/**
 * @param id Composite key {@link favoriteContentKey} / `"medication:…"` / `"algorithm:…"`.
 */
export function isFavorite(id: string): boolean {
  const parsed = parseFavoriteContentKey(id);
  if (!parsed) return false;
  return records.some(
    (r) => r.id === parsed.id && r.kind === parsed.kind,
  );
}

async function persist(): Promise<void> {
  records = dedupeFavoriteRecords(records);
  refreshSnapshot();
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

/**
 * @param id Composite key — use {@link favoriteContentKey} or `"medication:…"` / `"algorithm:…"`.
 */
export async function toggleFavorite(id: string): Promise<void> {
  const parsed = parseFavoriteContentKey(id);
  if (!parsed) return;
  const { id: contentId, kind } = parsed;
  const has = records.some((r) => r.id === contentId && r.kind === kind);
  if (has) {
    records = records.filter((r) => !(r.id === contentId && r.kind === kind));
  } else {
    records = [...records, { id: contentId, kind, timestamp: Date.now() }];
  }
  records = dedupeFavoriteRecords(records);
  await persist();
  notify();
}

export function useFavoritesSorted(): FavoriteRecord[] {
  return useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites);
}

export function useFavoriteToggle(
  id: string,
  kind: ContentKind,
): { isFavorite: boolean; toggleFavorite: () => Promise<void> } {
  const list = useFavoritesSorted();
  const key = favoriteContentKey(kind, id);
  const active = list.some((f) => f.id === id && f.kind === kind);
  const toggle = useCallback(() => toggleFavorite(key), [key]);
  return { isFavorite: active, toggleFavorite: toggle };
}
