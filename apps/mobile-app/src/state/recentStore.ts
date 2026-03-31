import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ContentKind } from '@/types/content';

const MAX_RECENT = 10;

export type RecentItem = {
  id: string;
  kind: ContentKind;
  /** Unix ms, latest first in `getRecent()`. */
  timestamp: number;
};

export type RecentRecord = RecentItem;

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

function normalizeRecentItems(items: RecentItem[]): RecentItem[] {
  const out: RecentItem[] = [];
  const seen = new Set<string>();

  // Assume items are already roughly latest-first; enforce dedupe + max.
  for (const item of items) {
    const key = recentKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= MAX_RECENT) break;
  }

  return out;
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

type RecentStore = {
  recentItems: RecentItem[];
  addRecent: (item: RecentItem | string) => void;
};

type RecentPersistedState = {
  recentItems: RecentItem[];
};

const RECENT_STORAGE_KEY = '@resqbrain/local/recent';

export const useRecentStore = create<RecentStore>()(
  persist<RecentStore, [], [], RecentPersistedState>(
    (set, get) => ({
      recentItems: [],
      addRecent: (item: RecentItem | string) => {
        const normalized = normalizeIncomingRecent(item);
        if (!normalized) return;

        const key = recentKey(normalized);
        const current = get().recentItems;
        const next = normalizeRecentItems([
          normalized,
          ...current.filter((existing) => recentKey(existing) !== key),
        ]);

        set({ recentItems: next });
      },
    }),
    {
      name: RECENT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentItems: state.recentItems }),
      migrate: (persistedState: unknown, _version: number) => {
        const record = persistedState as Partial<RecentPersistedState> | null;
        const items = Array.isArray(record?.recentItems)
          ? record.recentItems.filter(
              (x): x is RecentItem =>
                !!x &&
                typeof x === 'object' &&
                (x as RecentItem).kind !== undefined &&
                (x as RecentItem).id !== undefined,
            )
          : [];

        // Ensure latest-first ordering and constraints.
        const normalized = items
          .map((x) => normalizeIncomingRecent(x))
          .filter((x): x is RecentItem => x != null)
          .sort((a, b) => b.timestamp - a.timestamp);

        return {
          recentItems: normalizeRecentItems(normalized),
        } satisfies RecentPersistedState;
      },
    },
  ),
);

/** Latest first, max 10, deduped by `kind:id`. */
export function getRecent(): RecentItem[] {
  return useRecentStore.getState().recentItems;
}

export async function hydrateRecent(): Promise<void> {
  await useRecentStore.persist.rehydrate();
}

export function addRecent(item: RecentItem | string): void {
  useRecentStore.getState().addRecent(item);
}

export function useRecent(): RecentItem[] {
  return useRecentStore((state) => state.recentItems);
}
