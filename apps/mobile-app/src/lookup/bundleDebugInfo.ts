import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LookupSource } from './lookupSource';

const BUNDLE_DEBUG_INFO_KEY = '@resqbrain/lookup/debug-info-v1';

export type BundleDebugInfo = {
  version: string | null;
  source: LookupSource;
  lastUpdate: string | null;
};

const LOOKUP_SOURCE_VALUES = new Set<string>(['embedded', 'cached', 'updated', 'fallback']);

function isLookupSource(value: unknown): value is LookupSource {
  return typeof value === 'string' && LOOKUP_SOURCE_VALUES.has(value);
}

function parseBundleDebugInfo(raw: unknown): BundleDebugInfo | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Record<string, unknown>;
  const version = typeof rec.version === 'string' ? rec.version : null;
  const source = rec.source;
  const lastUpdate = typeof rec.lastUpdate === 'string' ? rec.lastUpdate : null;
  if (!isLookupSource(source)) return null;
  return {
    version,
    source,
    lastUpdate,
  };
}

export async function getBundleDebugInfo(): Promise<BundleDebugInfo | null> {
  try {
    const value = await AsyncStorage.getItem(BUNDLE_DEBUG_INFO_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as unknown;
    return parseBundleDebugInfo(parsed);
  } catch {
    return null;
  }
}

export async function setBundleDebugInfo(info: BundleDebugInfo): Promise<void> {
  try {
    await AsyncStorage.setItem(BUNDLE_DEBUG_INFO_KEY, JSON.stringify(info));
  } catch {
    // debug-only persistence should not break app startup
  }
}
