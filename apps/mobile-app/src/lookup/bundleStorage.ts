import * as FileSystem from 'expo-file-system';
import type { LookupBundleSnapshot } from './lookupCache';
import { validateLookupBundle } from './validateLookupBundle';

const BUNDLE_DIRECTORY = `${FileSystem.documentDirectory ?? ''}resqbrain`;
const BUNDLE_FILE_PATH = `${BUNDLE_DIRECTORY}/bundle.json`;

function toSnapshot(bundle: LookupBundleSnapshot): LookupBundleSnapshot {
  return {
    manifest: bundle.manifest,
    medications: bundle.medications,
    algorithms: bundle.algorithms,
  };
}

function isMissingFileError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /does not exist|could not be read|no such file/i.test(error.message);
}

async function ensureBundleDirectory(): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(BUNDLE_DIRECTORY);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(BUNDLE_DIRECTORY, { intermediates: true });
    }
  } catch {
    // Let the later write fail normally if the filesystem is unavailable.
  }
}

function parseBundle(text: string): LookupBundleSnapshot | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const record = parsed as Record<string, unknown>;
  const result = validateLookupBundle({
    manifest: record.manifest,
    medications: record.medications,
    algorithms: record.algorithms,
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

export async function saveBundle(bundle: LookupBundleSnapshot): Promise<void> {
  await ensureBundleDirectory();
  await FileSystem.writeAsStringAsync(
    BUNDLE_FILE_PATH,
    JSON.stringify(toSnapshot(bundle)),
    { encoding: FileSystem.EncodingType.UTF8 },
  );
}

export async function loadBundle(): Promise<LookupBundleSnapshot | null> {
  try {
    const text = await FileSystem.readAsStringAsync(BUNDLE_FILE_PATH, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return parseBundle(text);
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }
    return null;
  }
}

export async function hasBundle(): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(BUNDLE_FILE_PATH);
  return info.exists;
}

export async function getBundleVersion(): Promise<string | null> {
  const bundle = await loadBundle();
  return bundle?.manifest.bundleId ?? null;
}
