import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ValidatedLookupBundle } from './lookupSchema';
import { validateLookupBundle } from './validateLookupBundle';

const LOOKUP_BUNDLE_STORAGE_KEY = 'resqbrain.lookup.bundle';

function parseStoredBundle(raw: string): ValidatedLookupBundle | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  const result = validateLookupBundle(parsed as {
    manifest: unknown;
    medications: unknown;
    algorithms: unknown;
  });

  if (!result.ok) {
    return null;
  }

  return result.data;
}

export async function saveLookupBundle(bundle: ValidatedLookupBundle): Promise<void> {
  try {
    await AsyncStorage.setItem(LOOKUP_BUNDLE_STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    // Persistence errors must not block lookup usage.
  }
}

export async function loadStoredBundle(): Promise<ValidatedLookupBundle | null> {
  try {
    const raw = await AsyncStorage.getItem(LOOKUP_BUNDLE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return parseStoredBundle(raw);
  } catch {
    return null;
  }
}

export async function clearLookupBundle(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOOKUP_BUNDLE_STORAGE_KEY);
  } catch {
    // Best-effort cleanup only.
  }
}
