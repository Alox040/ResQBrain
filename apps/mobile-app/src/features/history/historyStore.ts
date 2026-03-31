import { useSyncExternalStore } from 'react';
import {
  getHistory,
  setHistory,
  type HistoryEntry,
} from '@/storage/localStorage';
import type { ContentKind } from '@/types/content';

export type HistoryRecord = {
  id: string;
  kind: ContentKind;
  /** Unix ms */
  visitedAt: number;
};

const MAX_HISTORY_ENTRIES = 30;

const listeners = new Set<() => void>();

let records: HistoryRecord[] = [];

/** Single in-flight load so opens cannot clobber disk before the first read completes. */
let hydratePromise: Promise<void> | null = null;

function historyKey(id: string, kind: ContentKind): string {
  return `${kind}:${id}`;
}

function historyEntryToRecord(entry: HistoryEntry): HistoryRecord | null {
  const colon = entry.key.indexOf(':');
  if (colon <= 0) return null;
  const kindRaw = entry.key.slice(0, colon);
  const id = entry.key.slice(colon + 1);
  if (kindRaw !== 'medication' && kindRaw !== 'algorithm') return null;
  if (!id) return null;
  return {
    id,
    kind: kindRaw,
    visitedAt: entry.visitedAt,
  };
}

function recordsToStorageEntries(items: HistoryRecord[]): HistoryEntry[] {
  return items.map((r) => ({
    key: historyKey(r.id, r.kind),
    visitedAt: r.visitedAt,
  }));
}

function dedupeByLatestVisit(items: HistoryRecord[]): HistoryRecord[] {
  const map = new Map<string, HistoryRecord>();
  for (const r of items) {
    const k = historyKey(r.id, r.kind);
    const prev = map.get(k);
    if (!prev || r.visitedAt > prev.visitedAt) {
      map.set(k, r);
    }
  }
  return [...map.values()];
}

function sortMostRecentFirst(items: HistoryRecord[]): HistoryRecord[] {
  return [...items].sort((a, b) => b.visitedAt - a.visitedAt);
}

function normalize(recordsIn: HistoryRecord[]): HistoryRecord[] {
  return sortMostRecentFirst(dedupeByLatestVisit(recordsIn)).slice(
    0,
    MAX_HISTORY_ENTRIES,
  );
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function subscribeHistory(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Snapshot: most recent visit first, at most {@link MAX_HISTORY_ENTRIES} rows. */
export function getHistorySnapshot(): HistoryRecord[] {
  return normalize(records);
}

async function persist(): Promise<void> {
  records = normalize(records);
  await setHistory(recordsToStorageEntries(records));
}

async function loadFromStorage(): Promise<void> {
  const loaded = await getHistory();
  const parsed = loaded
    .map(historyEntryToRecord)
    .filter((r): r is HistoryRecord => r != null);
  records = normalize(parsed);
  await persist();
  notify();
}

function ensureHydrated(): Promise<void> {
  if (!hydratePromise) {
    hydratePromise = loadFromStorage();
  }
  return hydratePromise;
}

/**
 * Load history from AsyncStorage. Call once when the app mounts.
 * Safe to call multiple times; only the first run performs I/O.
 */
export async function hydrateHistory(): Promise<void> {
  await ensureHydrated();
}

/**
 * Record that the user opened a medication or algorithm detail screen.
 * Moves the item to the top (most recent) and enforces the max-length cap.
 */
export async function recordHistoryOpen(
  id: string,
  kind: ContentKind,
): Promise<void> {
  await ensureHydrated();
  const now = Date.now();
  const without = records.filter((r) => !(r.id === id && r.kind === kind));
  records = normalize([{ id, kind, visitedAt: now }, ...without]);
  await persist();
  notify();
}

export function useHistorySorted(): HistoryRecord[] {
  return useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistorySnapshot,
  );
}
