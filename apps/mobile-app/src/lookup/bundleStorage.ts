/**
 * Phase-2 draft only.
 *
 * File-system persistence with staging, backup and rollback is intentionally
 * not part of the active app startup path. The current canonical cache backend
 * is `lookupCache.ts` with AsyncStorage.
 */
import * as FileSystem from 'expo-file-system/legacy';

import type { LookupBundleSnapshot } from './lookupCache';
import { validateLookupBundle } from './validateLookupBundle';

const BUNDLE_ROOT_DIRECTORY = `${FileSystem.documentDirectory ?? ''}lookup-bundles`;
const TMP_DIRECTORY = `${BUNDLE_ROOT_DIRECTORY}/tmp`;
const CURRENT_DIRECTORY = `${BUNDLE_ROOT_DIRECTORY}/current`;
const BACKUP_DIRECTORY = `${BUNDLE_ROOT_DIRECTORY}/current-backup`;
const CURRENT_BUNDLE_FILE_PATH = `${CURRENT_DIRECTORY}/bundle.json`;
const TMP_DOWNLOAD_FILE_PATH = `${TMP_DIRECTORY}/bundle.download.json`;
const TMP_SAVE_FILE_PATH = `${TMP_DIRECTORY}/bundle.save.json`;
const STAGE_DIRECTORY_PREFIX = `${TMP_DIRECTORY}/stage-`;

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

async function ensureDirectory(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function ensureBundleDirectories(): Promise<void> {
  await ensureDirectory(BUNDLE_ROOT_DIRECTORY);
  await ensureDirectory(TMP_DIRECTORY);
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

async function deleteIfExists(path: string): Promise<void> {
  await FileSystem.deleteAsync(path, { idempotent: true });
}

async function stageBundleFromFile(filePath: string): Promise<string> {
  const stageDirectory = `${STAGE_DIRECTORY_PREFIX}${Date.now()}`;
  const stagedBundleFilePath = `${stageDirectory}/bundle.json`;

  await deleteIfExists(stageDirectory);
  await FileSystem.makeDirectoryAsync(stageDirectory, { intermediates: true });
  await FileSystem.moveAsync({
    from: filePath,
    to: stagedBundleFilePath,
  });

  return stageDirectory;
}

async function promoteStageDirectory(stageDirectory: string): Promise<void> {
  const currentInfo = await FileSystem.getInfoAsync(CURRENT_DIRECTORY);

  await deleteIfExists(BACKUP_DIRECTORY);

  if (!currentInfo.exists) {
    await FileSystem.moveAsync({
      from: stageDirectory,
      to: CURRENT_DIRECTORY,
    });
    return;
  }

  await FileSystem.moveAsync({
    from: CURRENT_DIRECTORY,
    to: BACKUP_DIRECTORY,
  });

  try {
    await FileSystem.moveAsync({
      from: stageDirectory,
      to: CURRENT_DIRECTORY,
    });
    await deleteIfExists(BACKUP_DIRECTORY);
  } catch (error) {
    await deleteIfExists(CURRENT_DIRECTORY);
    await FileSystem.moveAsync({
      from: BACKUP_DIRECTORY,
      to: CURRENT_DIRECTORY,
    });
    throw error;
  }
}

export async function downloadBundle(url: string): Promise<string> {
  await ensureBundleDirectories();
  await deleteIfExists(TMP_DOWNLOAD_FILE_PATH);

  const result = await FileSystem.downloadAsync(url, TMP_DOWNLOAD_FILE_PATH);
  if (result.status < 200 || result.status >= 300) {
    await deleteIfExists(TMP_DOWNLOAD_FILE_PATH);
    throw new Error(`Bundle download failed with status ${result.status}`);
  }

  const stageDirectory = await stageBundleFromFile(result.uri);

  try {
    await promoteStageDirectory(stageDirectory);
  } catch (error) {
    await deleteIfExists(stageDirectory);
    throw error;
  }

  return CURRENT_BUNDLE_FILE_PATH;
}

export async function saveBundle(bundle: LookupBundleSnapshot): Promise<void> {
  await ensureBundleDirectories();
  await deleteIfExists(TMP_SAVE_FILE_PATH);

  await FileSystem.writeAsStringAsync(
    TMP_SAVE_FILE_PATH,
    JSON.stringify(toSnapshot(bundle)),
    { encoding: FileSystem.EncodingType.UTF8 },
  );

  const stageDirectory = await stageBundleFromFile(TMP_SAVE_FILE_PATH);

  try {
    await promoteStageDirectory(stageDirectory);
  } catch (error) {
    await deleteIfExists(stageDirectory);
    throw error;
  }
}

export async function loadBundle(): Promise<LookupBundleSnapshot | null> {
  try {
    const text = await FileSystem.readAsStringAsync(CURRENT_BUNDLE_FILE_PATH, {
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
  const info = await FileSystem.getInfoAsync(CURRENT_BUNDLE_FILE_PATH);
  return info.exists;
}

export async function getBundleVersion(): Promise<string | null> {
  const bundle = await loadBundle();
  return bundle?.manifest.version ?? bundle?.manifest.bundleId ?? null;
}
