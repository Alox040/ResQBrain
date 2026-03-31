import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ContentKind } from '@/types/content';

export type FavoriteRecord = {
  id: string;
  kind: ContentKind;
  /** Derived ordering only; persisted state uses insertion order in `favoriteIds`. */
  timestamp: number;
};

type FavoritesPersistedState = {
  favoriteIds: string[];
};

type FavoritesStore = FavoritesPersistedState & {
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FAVORITES_STORAGE_KEY = '@resqbrain/local/favorites';
const MAX_FAVORITES = 50;

function favoriteKey(id: string, kind: ContentKind): string {
  return `${kind}:${id}`;
}

/**
 * Canonical favorite id for `toggleFavorite` / `isFavorite`: `"medication:<id>"` or `"algorithm:<id>"`.
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

function normalizeFavoriteId(value: string): string | null {
  const parsed = parseFavoriteContentKey(value);
  return parsed ? favoriteKey(parsed.id, parsed.kind) : null;
}

function normalizeFavoriteIds(values: Iterable<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  // Treat later occurrences as newer; emit latest-first.
  const array = Array.isArray(values) ? values : [...values];
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const normalizedId = normalizeFavoriteId(array[i] ?? '');
    if (!normalizedId) continue;
    if (seen.has(normalizedId)) continue;
    seen.add(normalizedId);
    out.push(normalizedId);
    if (out.length >= MAX_FAVORITES) break;
  }

  return out;
}

function normalizePersistedFavoriteIds(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return normalizeFavoriteIds(
      raw.filter((value): value is string => typeof value === 'string'),
    );
  }

  // Legacy format: we previously persisted the array directly.
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return normalizePersistedFavoriteIds(parsed);
    } catch {
      // ignore
    }
  }

  return [];
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (
      set: (
        partial:
          | Partial<FavoritesStore>
          | ((state: FavoritesStore) => Partial<FavoritesStore>),
      ) => void,
      get: () => FavoritesStore,
    ) => ({
      favoriteIds: [],
      toggleFavorite: (id: string) => {
        const normalizedId = normalizeFavoriteId(id);
        if (!normalizedId) return;

        set((state: FavoritesStore) => {
          return {
            favoriteIds: state.favoriteIds.includes(normalizedId)
              ? state.favoriteIds.filter((existing) => existing !== normalizedId)
              : [normalizedId, ...state.favoriteIds].slice(0, MAX_FAVORITES),
          };
        });
      },
      isFavorite: (id: string) => {
        const normalizedId = normalizeFavoriteId(id);
        return normalizedId ? get().favoriteIds.includes(normalizedId) : false;
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: FavoritesStore) => ({
        favoriteIds: state.favoriteIds,
      }),
      migrate: (persistedState: unknown, _version: number) => {
        const record = persistedState as Partial<FavoritesPersistedState> | null;
        return {
          favoriteIds: normalizePersistedFavoriteIds(record?.favoriteIds),
        } satisfies FavoritesPersistedState;
      },
    },
  ),
);

export function getFavorites(): string[] {
  return useFavoritesStore.getState().favoriteIds;
}

/** @deprecated Prefer `getFavorites`. */
export const getFavoritesSnapshot = getFavorites;

export function isFavorite(id: string): boolean {
  return useFavoritesStore.getState().isFavorite(id);
}

export async function toggleFavorite(id: string): Promise<void> {
  useFavoritesStore.getState().toggleFavorite(id);
}

/** Persist middleware hydrates automatically; kept for compatibility. */
export async function hydrateFavorites(): Promise<void> {
  await useFavoritesStore.persist.rehydrate();
}

function toFavoriteRecords(ids: readonly string[]): FavoriteRecord[] {
  return ids
    .map((contentKey, index) => {
      const parsed = parseFavoriteContentKey(contentKey);
      if (!parsed) return null;

      return {
        id: parsed.id,
        kind: parsed.kind,
        timestamp: ids.length - index,
      };
    })
    .filter((record): record is FavoriteRecord => record != null);
}

export function useFavorites(): FavoritesStore {
  return useFavoritesStore();
}

export function useFavoritesSorted(): FavoriteRecord[] {
  const favoriteIds = useFavoritesStore((state: FavoritesStore) => state.favoriteIds);
  return toFavoriteRecords(favoriteIds);
}

export function useFavoriteToggle(
  id: string,
  kind?: ContentKind,
): { isFavorite: boolean; toggleFavorite: () => Promise<void> } {
  const contentKey = kind ? favoriteContentKey(kind, id) : id;
  const active = useFavoritesStore((state: FavoritesStore) =>
    state.isFavorite(contentKey),
  );
  const toggle = useCallback(async () => {
    useFavoritesStore.getState().toggleFavorite(contentKey);
  }, [contentKey]);

  return { isFavorite: active, toggleFavorite: toggle };
}
