import { useSyncExternalStore } from 'react';
import {
  getRecentEntries,
  setRecentEntries,
  type HistoryEntry,
} from '@/storage/localStorage';
import type { ContentKind } from '@/types/content';

const MAX_RECENT = 10;

const listeners = new Set<() => void>();

export type RecentItem = {
  id: string;
  kind: ContentKind;
  /** Unix ms, latest first in `getRecent()`. */
  timestamp: number;
};

export type RecentRecord = RecentItem;

let recentItems: RecentItem[] = [];
let recentSnapshot: RecentItem[] = [];
let hydratePromise: Promise<void> | null = null;

/** Composite id for callers that still use `kind:id`. */
export function recentContentKey(kind: ContentKind, id: string): string {
  return `${kind}:${id.trim()}`;
}

function parseContentKey(
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

function recentKey(item: Pick<RecentItem, 'id' | 'kind'>): string {
  return `${item.kind}:${item.id}`;
}

function entryToItem(entry: HistoryEntry): RecentItem | null {
  const parsed = parseContentKey(entry.key);
  if (!parsed) return null;

  return {
    id: parsed.id,
    kind: parsed.kind,
    timestamp: entry.visitedAt,
  };
}

function itemsToEntries(items: RecentItem[]): HistoryEntry[] {
  return items.map((item) => ({
    key: recentKey(item),
    visitedAt: item.timestamp,
  }));
}

function normalize(items: RecentItem[]): RecentItem[] {
  const map = new Map<string, RecentItem>();

  for (const item of items) {
    const key = recentKey(item);
    const previous = map.get(key);
    if (!previous || item.timestamp > previous.timestamp) {
      map.set(key, item);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_RECENT);
}

function refreshSnapshot(): void {
  recentSnapshot = normalize(recentItems);
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

async function persist(): Promise<void> {
  recentItems = normalize(recentItems);
  refreshSnapshot();
  await setRecentEntries(itemsToEntries(recentItems));
}

async function loadFromStorage(): Promise<void> {
  const loaded = await getRecentEntries();
  recentItems = normalize(
    loaded
      .map(entryToItem)
      .filter((item): item is RecentItem => item != null),
  );
  await persist();
  notify();
}

function ensureHydrated(): Promise<void> {
  if (!hydratePromise) {
    hydratePromise = loadFromStorage();
  }
  return hydratePromise;
}

function normalizeIncomingRecent(
  itemOrId: RecentItem | string,
): RecentItem | null {
  if (typeof itemOrId === 'string') {
    const parsed = parseContentKey(itemOrId);
    if (!parsed) return null;
    return {
      id: parsed.id,
      kind: parsed.kind,
      timestamp: Date.now(),
    };
  }

  if (!itemOrId || typeof itemOrId !== 'object') return null;
  if (itemOrId.kind !== 'medication' && itemOrId.kind !== 'algorithm') return null;
  if (typeof itemOrId.id !== 'string' || itemOrId.id.trim() === '') return null;

  return {
    id: itemOrId.id.trim(),
    kind: itemOrId.kind,
    timestamp:
      typeof itemOrId.timestamp === 'number' && Number.isFinite(itemOrId.timestamp)
        ? itemOrId.timestamp
        : Date.now(),
  };
}

export function subscribeRecent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Latest first, max 10, deduped by `kind:id`. */
export function getRecent(): RecentItem[] {
  return recentSnapshot;
}

export async function hydrateRecent(): Promise<void> {
  await ensureHydrated();
}

export async function addRecent(item: RecentItem | string): Promise<void> {
  const normalized = normalizeIncomingRecent(item);
  if (!normalized) return;

  await ensureHydrated();

  recentItems = normalize([normalized, ...recentItems]);
  await persist();
  notify();
}

export function useRecent(): RecentItem[] {
  return useSyncExternalStore(subscribeRecent, getRecent, getRecent);
}
