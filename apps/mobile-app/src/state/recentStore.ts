import { useSyncExternalStore } from 'react';
import {
  getRecentEntries,
  setRecentEntries,
  type HistoryEntry,
} from '@/storage/localStorage';
import type { ContentKind } from '@/types/content';

const MAX_RECENT = 10;

const listeners = new Set<() => void>();

export type RecentRecord = {
  id: string;
  kind: ContentKind;
  /** Unix ms — most recent open first in {@link getRecent} */
  visitedAt: number;
};

let records: RecentRecord[] = [];

let hydratePromise: Promise<void> | null = null;

/** Composite id for {@link addRecent}: `"medication:<contentId>"` | `"algorithm:<contentId>"`. */
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

function recordKey(r: RecentRecord): string {
  return `${r.kind}:${r.id}`;
}

function entryToRecord(entry: HistoryEntry): RecentRecord | null {
  const parsed = parseContentKey(entry.key);
  if (!parsed) return null;
  return {
    id: parsed.id,
    kind: parsed.kind,
    visitedAt: entry.visitedAt,
  };
}

function recordsToEntries(items: RecentRecord[]): HistoryEntry[] {
  return items.map((r) => ({
    key: recordKey(r),
    visitedAt: r.visitedAt,
  }));
}

function dedupeLatest(items: RecentRecord[]): RecentRecord[] {
  const map = new Map<string, RecentRecord>();
  for (const r of items) {
    const k = recordKey(r);
    const prev = map.get(k);
    if (!prev || r.visitedAt > prev.visitedAt) {
      map.set(k, r);
    }
  }
  return [...map.values()];
}

function normalize(items: RecentRecord[]): RecentRecord[] {
  return [...dedupeLatest(items)]
    .sort((a, b) => b.visitedAt - a.visitedAt)
    .slice(0, MAX_RECENT);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function subscribeRecent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Most recently used first, at most {@link MAX_RECENT} rows. */
export function getRecent(): RecentRecord[] {
  return normalize(records);
}

async function persist(): Promise<void> {
  records = normalize(records);
  await setRecentEntries(recordsToEntries(records));
}

async function loadFromStorage(): Promise<void> {
  const loaded = await getRecentEntries();
  const parsed = loaded
    .map(entryToRecord)
    .filter((r): r is RecentRecord => r != null);
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

export async function hydrateRecent(): Promise<void> {
  await ensureHydrated();
}

/**
 * Record a medication or algorithm detail open. `id` must be {@link recentContentKey} / `kind:contentId`.
 */
export async function addRecent(id: string): Promise<void> {
  const parsed = parseContentKey(id);
  if (!parsed) return;
  await ensureHydrated();
  const now = Date.now();
  const without = records.filter(
    (r) => !(r.id === parsed.id && r.kind === parsed.kind),
  );
  records = normalize([
    { id: parsed.id, kind: parsed.kind, visitedAt: now },
    ...without,
  ]);
  await persist();
  notify();
}

export function useRecent(): RecentRecord[] {
  return useSyncExternalStore(subscribeRecent, getRecent, getRecent);
}
