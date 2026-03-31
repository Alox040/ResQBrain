import * as FileSystem from 'expo-file-system/legacy';

import { loadEmbeddedLookupBundle } from './loadLookupBundle';
import type { LookupBundleSnapshot } from './lookupCache';
import { getBundleVersion, loadBundle, saveBundle } from './bundleStorage';
import { compareBundleVersion } from './bundleUpdateService';
import { validateLookupBundle } from './validateLookupBundle';

const DOWNLOAD_DIRECTORY = `${FileSystem.cacheDirectory ?? ''}lookup-update`;
const DOWNLOADED_BUNDLE_PATH = `${DOWNLOAD_DIRECTORY}/lookup-bundle.json`;
const NORMALIZED_BUNDLE_PATH = `${DOWNLOAD_DIRECTORY}/lookup-bundle.normalized.json`;

type DownloadedBundle = {
  bundle: LookupBundleSnapshot;
  checksum: string;
  sourceUri: string;
  version: string | null;
};

export type LookupBundleUpdateCheckResult = {
  status: 'update-available' | 'up-to-date' | 'downgrade-blocked' | 'error';
  currentVersion: string | null;
  remoteVersion: string | null;
  reason?: 'download-failed' | 'invalid-bundle' | 'checksum-mismatch';
};

export type LookupBundleDownloadResult =
  | {
      status: 'success';
      version: string | null;
      checksum: string;
      bundle: LookupBundleSnapshot;
    }
  | {
      status: 'error';
      reason:
        | 'download-failed'
        | 'invalid-json'
        | 'invalid-bundle'
        | 'checksum-missing'
        | 'checksum-mismatch';
    };

export type LookupBundleApplyResult = {
  status: 'updated' | 'up-to-date' | 'downgrade-blocked' | 'error';
  version: string | null;
  reason?:
    | 'download-failed'
    | 'invalid-json'
    | 'invalid-bundle'
    | 'checksum-missing'
    | 'checksum-mismatch'
    | 'save-failed';
  fallbackApplied?: boolean;
};

export type LookupBundleRollbackResult = {
  status: 'rolled-back' | 'no-backup' | 'error';
  version: string | null;
};

export type LookupBundleUpdateServiceOptions = {
  bundleUrl: string;
};

function toSnapshot(bundle: {
  manifest: LookupBundleSnapshot['manifest'];
  medications: LookupBundleSnapshot['medications'];
  algorithms: LookupBundleSnapshot['algorithms'];
}): LookupBundleSnapshot {
  return {
    manifest: bundle.manifest,
    medications: bundle.medications,
    algorithms: bundle.algorithms,
  };
}

function getSnapshotVersion(bundle: LookupBundleSnapshot): string | null {
  return bundle.manifest.version ?? bundle.manifest.bundleId ?? null;
}

function getEmbeddedSnapshot(): LookupBundleSnapshot {
  const embedded = loadEmbeddedLookupBundle();
  return toSnapshot({
    manifest: embedded.manifest,
    medications: embedded.medications,
    algorithms: embedded.algorithms,
  });
}

async function ensureDownloadDirectory(): Promise<void> {
  const info = await FileSystem.getInfoAsync(DOWNLOAD_DIRECTORY);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIRECTORY, { intermediates: true });
  }
}

function parseBundlePayload(raw: unknown): LookupBundleSnapshot {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid lookup bundle: expected object');
  }

  const record = raw as Record<string, unknown>;
  const validation = validateLookupBundle({
    manifest: record.manifest,
    medications: record.medications,
    algorithms: record.algorithms,
  });

  if (!validation.ok) {
    throw new Error(validation.errors.join('\n'));
  }

  return toSnapshot(validation.data);
}

async function getFileMd5(fileUri: string): Promise<string | null> {
  const info = await FileSystem.getInfoAsync(fileUri, { md5: true });
  if (!info.exists) {
    return null;
  }

  return 'md5' in info && typeof info.md5 === 'string' ? info.md5 : null;
}

async function buildNormalizedChecksum(bundle: LookupBundleSnapshot): Promise<string | null> {
  const normalizedBundle = {
    manifest: {
      ...bundle.manifest,
      checksum: undefined,
    },
    medications: bundle.medications,
    algorithms: bundle.algorithms,
  };

  await FileSystem.writeAsStringAsync(
    NORMALIZED_BUNDLE_PATH,
    JSON.stringify(normalizedBundle),
    { encoding: FileSystem.EncodingType.UTF8 },
  );

  return getFileMd5(NORMALIZED_BUNDLE_PATH);
}

async function verifyBundleChecksum(
  bundle: LookupBundleSnapshot,
  downloadedFileUri: string,
): Promise<{ ok: true; checksum: string } | { ok: false }> {
  const expectedChecksum = bundle.manifest.checksum?.trim().toLowerCase();
  if (!expectedChecksum) {
    return { ok: false };
  }

  const [rawChecksum, normalizedChecksum] = await Promise.all([
    getFileMd5(downloadedFileUri),
    buildNormalizedChecksum(bundle),
  ]);

  const candidates = [rawChecksum, normalizedChecksum]
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.toLowerCase());

  if (candidates.includes(expectedChecksum)) {
    return {
      ok: true,
      checksum: expectedChecksum,
    };
  }

  return { ok: false };
}

export class LookupBundleUpdateService {
  private readonly bundleUrl: string;

  private pendingBundle: DownloadedBundle | null = null;

  private previousBundle: LookupBundleSnapshot | null = null;

  public constructor(options: LookupBundleUpdateServiceOptions) {
    this.bundleUrl = options.bundleUrl;
  }

  public async checkForUpdate(): Promise<LookupBundleUpdateCheckResult> {
    const currentVersion = (await getBundleVersion()) ?? getSnapshotVersion(getEmbeddedSnapshot());
    const download = await this.downloadBundle();

    if (download.status === 'error') {
      return {
        status: 'error',
        currentVersion,
        remoteVersion: null,
        reason:
          download.reason === 'checksum-mismatch' || download.reason === 'checksum-missing'
            ? 'checksum-mismatch'
            : download.reason === 'invalid-bundle' || download.reason === 'invalid-json'
              ? 'invalid-bundle'
              : 'download-failed',
      };
    }

    const comparison = compareBundleVersion(currentVersion, download.version);

    return {
      status:
        comparison === 'updateAvailable'
          ? 'update-available'
          : comparison === 'downgradeBlocked'
            ? 'downgrade-blocked'
            : 'up-to-date',
      currentVersion,
      remoteVersion: download.version,
    };
  }

  public async downloadBundle(): Promise<LookupBundleDownloadResult> {
    try {
      await ensureDownloadDirectory();
      await FileSystem.deleteAsync(DOWNLOADED_BUNDLE_PATH, { idempotent: true });
      await FileSystem.deleteAsync(NORMALIZED_BUNDLE_PATH, { idempotent: true });

      const result = await FileSystem.downloadAsync(this.bundleUrl, DOWNLOADED_BUNDLE_PATH);
      const text = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      let parsed: unknown;
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        this.pendingBundle = null;
        return {
          status: 'error',
          reason: 'invalid-json',
        };
      }

      let bundle: LookupBundleSnapshot;
      try {
        bundle = parseBundlePayload(parsed);
      } catch {
        this.pendingBundle = null;
        return {
          status: 'error',
          reason: 'invalid-bundle',
        };
      }

      if (!bundle.manifest.checksum?.trim()) {
        this.pendingBundle = null;
        return {
          status: 'error',
          reason: 'checksum-missing',
        };
      }

      const checksumVerification = await verifyBundleChecksum(bundle, result.uri);
      if (!checksumVerification.ok) {
        this.pendingBundle = null;
        return {
          status: 'error',
          reason: 'checksum-mismatch',
        };
      }

      const version = getSnapshotVersion(bundle);
      this.pendingBundle = {
        bundle,
        checksum: checksumVerification.checksum,
        sourceUri: result.uri,
        version,
      };

      return {
        status: 'success',
        bundle,
        checksum: checksumVerification.checksum,
        version,
      };
    } catch {
      this.pendingBundle = null;
      return {
        status: 'error',
        reason: 'download-failed',
      };
    }
  }

  public async applyUpdate(): Promise<LookupBundleApplyResult> {
    const currentBundle = await loadBundle();
    const currentVersion =
      currentBundle ? getSnapshotVersion(currentBundle) : getSnapshotVersion(getEmbeddedSnapshot());

    const download =
      this.pendingBundle === null
        ? await this.downloadBundle()
        : {
            status: 'success' as const,
            bundle: this.pendingBundle.bundle,
            checksum: this.pendingBundle.checksum,
            version: this.pendingBundle.version,
          };

    if (download.status === 'error') {
      return {
        status: 'error',
        version: currentVersion,
        reason: download.reason,
      };
    }

    const comparison = compareBundleVersion(currentVersion, download.version);

    if (comparison === 'sameVersion') {
      return {
        status: 'up-to-date',
        version: currentVersion,
      };
    }

    if (comparison === 'downgradeBlocked') {
      return {
        status: 'downgrade-blocked',
        version: currentVersion,
      };
    }

    this.previousBundle = currentBundle ?? getEmbeddedSnapshot();

    try {
      await saveBundle(download.bundle);
      return {
        status: 'updated',
        version: download.version,
      };
    } catch {
      const fallbackApplied = await this.tryRestorePreviousBundle();
      return {
        status: 'error',
        version: currentVersion,
        reason: 'save-failed',
        fallbackApplied,
      };
    } finally {
      this.pendingBundle = null;
    }
  }

  public async rollback(): Promise<LookupBundleRollbackResult> {
    const fallbackBundle = this.previousBundle ?? (await loadBundle()) ?? getEmbeddedSnapshot();

    if (!fallbackBundle) {
      return {
        status: 'no-backup',
        version: null,
      };
    }

    try {
      await saveBundle(fallbackBundle);
      return {
        status: 'rolled-back',
        version: getSnapshotVersion(fallbackBundle),
      };
    } catch {
      return {
        status: 'error',
        version: null,
      };
    }
  }

  private async tryRestorePreviousBundle(): Promise<boolean> {
    if (!this.previousBundle) {
      return false;
    }

    try {
      await saveBundle(this.previousBundle);
      return true;
    } catch {
      return false;
    }
  }
}
