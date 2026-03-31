import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from 'zustand/middleware';
import type { ContentKind } from '@/types/content';

export type FavoriteRecord = {
  id: string;
  kind: ContentKind;
  /** Derived ordering only; persisted state uses insertion order in `favoriteIds`. */
  timestamp: number;
};

type FavoritesPersistedState = {
  favoriteIds: Set<string>;
};

type FavoritesStore = FavoritesPersistedState & {
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavorites: () => string[];
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

function normalizeFavoriteIds(values: Iterable<string>): Set<string> {
  const normalized = new Set<string>();

  for (const value of values) {
    const normalizedId = normalizeFavoriteId(value);
    if (!normalizedId) continue;
    if (normalized.has(normalizedId)) {
      normalized.delete(normalizedId);
    }
    normalized.add(normalizedId);
  }

  while (normalized.size > MAX_FAVORITES) {
    const oldest = normalized.values().next().value;
    if (typeof oldest !== 'string') break;
    normalized.delete(oldest);
  }

  return normalized;
}

function parsePersistedFavorites(raw: unknown): Set<string> {
  if (Array.isArray(raw)) {
    return normalizeFavoriteIds(
      raw.filter((value): value is string => typeof value === 'string'),
    );
  }

  if (!raw || typeof raw !== 'object') {
    return new Set<string>();
  }

  const record = raw as Record<string, unknown>;
  const state = record.state;
  if (!state || typeof state !== 'object') {
    return new Set<string>();
  }

  const favoriteIdsRaw = (state as Record<string, unknown>).favoriteIds;
  if (!Array.isArray(favoriteIdsRaw)) {
    return new Set<string>();
  }

  return normalizeFavoriteIds(
    favoriteIdsRaw.filter((value): value is string => typeof value === 'string'),
  );
}

const favoritesStorage: PersistStorage<FavoritesPersistedState> = {
  getItem: async (name: string) => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw) return null;

    try {
      return {
        state: {
          favoriteIds: parsePersistedFavorites(JSON.parse(raw) as unknown),
        },
        version: 1,
      } satisfies StorageValue<FavoritesPersistedState>;
    } catch {
      return null;
    }
  },
  setItem: async (
    name: string,
    value: StorageValue<FavoritesPersistedState>,
  ) => {
    const normalized = normalizeFavoriteIds(value.state.favoriteIds);
    await AsyncStorage.setItem(name, JSON.stringify([...normalized]));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

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
      favoriteIds: new Set<string>(),
      toggleFavorite: (id: string) => {
        const normalizedId = normalizeFavoriteId(id);
        if (!normalizedId) return;

        set((state: FavoritesStore) => {
          const next = new Set(state.favoriteIds);
          if (next.has(normalizedId)) {
            next.delete(normalizedId);
          } else {
            next.add(normalizedId);
          }

          return {
            favoriteIds: normalizeFavoriteIds(next),
          };
        });
      },
      isFavorite: (id: string) => {
        const normalizedId = normalizeFavoriteId(id);
        return normalizedId ? get().favoriteIds.has(normalizedId) : false;
      },
      getFavorites: () => [...get().favoriteIds].reverse(),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      storage: favoritesStorage,
      partialize: (state: FavoritesStore) => ({
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
);

export function getFavorites(): string[] {
  return useFavoritesStore.getState().getFavorites();
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
  const favoriteIds = useFavoritesStore((state: FavoritesStore) =>
    state.getFavorites(),
  );
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
