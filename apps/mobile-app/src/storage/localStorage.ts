import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ContentKind } from '@/types/content';

export type FavoriteRecord = {
  id: string;
  kind: ContentKind;
  /** Unix ms — used for “recent first” ordering */
  timestamp: number;
};

/**
 * Stable content reference matching lookup keys (`medication:id` / `algorithm:id`).
 * Intentionally plain `string` so this module does not import the lookup bundle graph.
 */
export type StoredContentKey = string;

export type HistoryEntry = {
  key: StoredContentKey;
  /** Unix ms */
  visitedAt: number;
};

const SETTINGS_SCHEMA_VERSION = 1;

export type AppLocalSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION;
};

const KEYS = {
  favorites: '@resqbrain/local/favorites',
  history: '@resqbrain/local/history',
  recent: '@resqbrain/local/recent',
  settings: '@resqbrain/local/settings',
} as const;

const DEFAULT_FAVORITE_RECORDS: FavoriteRecord[] = [];
const DEFAULT_HISTORY: HistoryEntry[] = [];
const DEFAULT_RECENT: HistoryEntry[] = [];
const DEFAULT_SETTINGS: AppLocalSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

function migrateLegacyFavoriteKeys(keys: string[]): FavoriteRecord[] {
  const now = Date.now();
  const out: FavoriteRecord[] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const colon = key.indexOf(':');
    if (colon <= 0) continue;
    const kindRaw = key.slice(0, colon);
    const id = key.slice(colon + 1);
    if (kindRaw !== 'medication' && kindRaw !== 'algorithm') continue;
    if (!id) continue;
    out.push({
      id,
      kind: kindRaw,
      timestamp: now - (keys.length - 1 - i) * 1000,
    });
  }
  return out;
}

function parseFavoriteRecords(raw: unknown): FavoriteRecord[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length === 0) return [];
  if (isStringArray(raw)) {
    return migrateLegacyFavoriteKeys(raw);
  }
  const out: FavoriteRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    if (typeof rec.id !== 'string' || !rec.id) continue;
    if (rec.kind !== 'medication' && rec.kind !== 'algorithm') continue;
    if (typeof rec.timestamp !== 'number' || !Number.isFinite(rec.timestamp)) continue;
    out.push({
      id: rec.id,
      kind: rec.kind,
      timestamp: rec.timestamp,
    });
  }
  return out;
}

function parseHistory(raw: unknown): HistoryEntry[] | null {
  if (!Array.isArray(raw)) return null;
  const out: HistoryEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    if (typeof rec.key !== 'string') continue;
    if (typeof rec.visitedAt !== 'number' || !Number.isFinite(rec.visitedAt)) continue;
    out.push({ key: rec.key, visitedAt: rec.visitedAt });
  }
  return out;
}

function parseSettings(raw: unknown): AppLocalSettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }
  const rec = raw as Record<string, unknown>;
  const v = rec.schemaVersion;
  if (typeof v !== 'number' || v !== SETTINGS_SCHEMA_VERSION) {
    return { ...DEFAULT_SETTINGS };
  }
  return { schemaVersion: SETTINGS_SCHEMA_VERSION };
}

async function readJson<T>(
  storageKey: string,
  fallback: T,
  revive: (parsed: unknown) => T | null,
): Promise<T> {
  try {
    const text = await AsyncStorage.getItem(storageKey);
    if (text == null || text === '') return fallback;
    let parsed: unknown;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      return fallback;
    }
    const revived = revive(parsed);
    return revived ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(storageKey: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // deliberate no-op: callers can retry; avoid crashing UI on quota / IO errors
  }
}

export async function getFavoriteRecords(): Promise<FavoriteRecord[]> {
  return readJson(
    KEYS.favorites,
    DEFAULT_FAVORITE_RECORDS,
    parseFavoriteRecords,
  );
}

export async function setFavoriteRecords(
  favorites: FavoriteRecord[],
): Promise<void> {
  await writeJson(KEYS.favorites, favorites);
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return readJson(KEYS.history, DEFAULT_HISTORY, parseHistory);
}

export async function setHistory(history: HistoryEntry[]): Promise<void> {
  await writeJson(KEYS.history, history);
}

/** Same shape as history — `key` is `medication:id` / `algorithm:id`. */
export async function getRecentEntries(): Promise<HistoryEntry[]> {
  return readJson(KEYS.recent, DEFAULT_RECENT, parseHistory);
}

export async function setRecentEntries(
  entries: HistoryEntry[],
): Promise<void> {
  await writeJson(KEYS.recent, entries);
}

export async function getSettings(): Promise<AppLocalSettings> {
  return readJson(KEYS.settings, DEFAULT_SETTINGS, (p) => parseSettings(p));
}

export async function setSettings(settings: AppLocalSettings): Promise<void> {
  await writeJson(KEYS.settings, settings);
}
