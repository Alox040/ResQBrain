import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Algorithm, Medication } from '@/types/content';
import type { LookupManifest } from './lookupSchema';
import { validateLookupBundle } from './validateLookupBundle';

const LOOKUP_CACHE_KEY = '@resqbrain/lookup/bundle-v1';
const LOOKUP_UPDATED_KEY = '@resqbrain/lookup/updated-v1';
const LOOKUP_CACHE_SCHEMA_VERSION = 1;

export type LookupBundleSnapshot = {
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
};

export type LookupCacheReadResult =
  | { found: true; snapshot: LookupBundleSnapshot }
  | { found: false };

type StoredLookupEnvelope = {
  v: number;
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

function reviveEnvelope(raw: unknown): StoredLookupEnvelope | null {
  if (!isObject(raw)) return null;
  const rec = raw as Record<string, unknown>;
  if (rec.v !== LOOKUP_CACHE_SCHEMA_VERSION) return null;
  if (!isObject(rec.manifest)) return null;
  if (!Array.isArray(rec.medications) || !Array.isArray(rec.algorithms)) {
    return null;
  }
  return rec as StoredLookupEnvelope;
}

function validateSnapshot(
  snapshot: LookupBundleSnapshot | null,
): LookupBundleSnapshot | null {
  if (!snapshot) return null;

  const result = validateLookupBundle({
    manifest: snapshot.manifest as unknown,
    medications: snapshot.medications as unknown,
    algorithms: snapshot.algorithms as unknown,
  });

  if (!result.ok) {
    return null;
  }

  return {
    manifest: result.data.manifest,
    medications: result.data.medications,
    algorithms: result.data.algorithms,
  };
}

/**
 * Persistiert ein validiertes Lookup-Bundle lokal.
 * Kein Netzwerkzugriff, nur AsyncStorage.
 */
export async function saveBundle(
  snapshot: LookupBundleSnapshot,
): Promise<void> {
  await saveEnvelope(LOOKUP_CACHE_KEY, snapshot);
}

export async function saveUpdatedBundle(
  snapshot: LookupBundleSnapshot,
): Promise<void> {
  await saveEnvelope(LOOKUP_UPDATED_KEY, snapshot);
}

async function saveEnvelope(
  storageKey: string,
  snapshot: LookupBundleSnapshot,
): Promise<void> {
  const envelope: StoredLookupEnvelope = {
    v: LOOKUP_CACHE_SCHEMA_VERSION,
    manifest: snapshot.manifest,
    medications: snapshot.medications,
    algorithms: snapshot.algorithms,
  };
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(envelope));
  } catch {
    // bewusstes Schlucken: Persistenzfehler sollen den Einsatz nicht blockieren
  }
}

/**
 * Lädt ein zuvor gespeichertes Lookup-Bundle aus AsyncStorage.
 * Gibt `null` zurück, wenn nichts oder nur veraltetes / ungültiges Format gefunden wird.
 */
export async function loadBundle(): Promise<LookupBundleSnapshot | null> {
  return loadEnvelope(LOOKUP_CACHE_KEY);
}

export async function loadAndValidateBundle(): Promise<LookupCacheReadResult> {
  const snapshot = validateSnapshot(await loadBundle());
  if (!snapshot) {
    return { found: false };
  }

  return { found: true, snapshot };
}

export async function loadUpdatedBundle(): Promise<LookupBundleSnapshot | null> {
  return loadEnvelope(LOOKUP_UPDATED_KEY);
}

async function loadEnvelope(
  storageKey: string,
): Promise<LookupBundleSnapshot | null> {
  const text = await AsyncStorage.getItem(storageKey);
  if (!text) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return null;
  }
  const env = reviveEnvelope(parsed);
  if (!env) return null;
  return {
    manifest: env.manifest,
    medications: env.medications,
    algorithms: env.algorithms,
  };
}
