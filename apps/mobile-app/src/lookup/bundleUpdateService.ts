import { loadEmbeddedLookupBundle } from './loadLookupBundle';
import {
  loadAndValidateBundle,
  saveBundle,
  type LookupBundleSnapshot,
} from './lookupCache';
import { validateLookupBundle } from './validateLookupBundle';

export type BundleUpdateCheckResult = {
  status: 'update-available' | 'up-to-date' | 'downgrade-blocked' | 'error';
  currentVersion: string | null;
  remoteVersion: string | null;
};

export type BundleDownloadResult =
  | {
      status: 'success';
      bundle: LookupBundleSnapshot;
      version: string | null;
    }
  | {
      status: 'error';
      reason: 'network' | 'invalid-json' | 'invalid-schema';
    };

export type ApplyBundleUpdateResult = {
  status: 'updated' | 'up-to-date' | 'downgrade-blocked' | 'error';
  version: string | null;
  reason?: 'network' | 'invalid-json' | 'invalid-schema' | 'save-failed' | 'downgrade-blocked';
};

export type BundleVersionComparisonResult =
  | 'updateAvailable'
  | 'sameVersion'
  | 'downgradeBlocked';

function getSnapshotVersion(bundle: LookupBundleSnapshot): string | null {
  return bundle.manifest.version ?? bundle.manifest.bundleId ?? null;
}

function getEmbeddedVersion(): string | null {
  const embeddedBundle = loadEmbeddedLookupBundle();
  return embeddedBundle.versionInfo.version ?? embeddedBundle.manifest.bundleId ?? null;
}

async function getCachedVersion(): Promise<string | null> {
  const cachedBundle = await loadAndValidateBundle();
  if (!cachedBundle.found) {
    return null;
  }

  return getSnapshotVersion(cachedBundle.snapshot);
}

function normalizeVersionParts(version: string | null): string[] {
  if (!version) return [];
  return version
    .split(/[^0-9A-Za-z]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function compareVersionParts(left: string, right: string): number {
  const leftIsNumber = /^\d+$/.test(left);
  const rightIsNumber = /^\d+$/.test(right);

  if (leftIsNumber && rightIsNumber) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    if (leftNumber === rightNumber) return 0;
    return leftNumber > rightNumber ? 1 : -1;
  }

  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();
  if (normalizedLeft === normalizedRight) return 0;
  return normalizedLeft > normalizedRight ? 1 : -1;
}

export function compareBundleVersion(
  local: string | null,
  remote: string | null,
): BundleVersionComparisonResult {
  if (!local && !remote) return 'sameVersion';
  if (!local && remote) return 'updateAvailable';
  if (local && !remote) return 'downgradeBlocked';

  const localParts = normalizeVersionParts(local);
  const remoteParts = normalizeVersionParts(remote);
  const length = Math.max(localParts.length, remoteParts.length);

  for (let index = 0; index < length; index += 1) {
    const localPart = localParts[index] ?? '0';
    const remotePart = remoteParts[index] ?? '0';
    const result = compareVersionParts(localPart, remotePart);
    if (result < 0) return 'updateAvailable';
    if (result > 0) return 'downgradeBlocked';
  }

  return 'sameVersion';
}

export function validateBundle(raw: unknown): {
  bundle: LookupBundleSnapshot;
  version: string | null;
} {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid lookup bundle:\n- bundle: expected object');
  }

  const record = raw as Record<string, unknown>;
  const result = validateLookupBundle({
    manifest: record.manifest,
    medications: record.medications,
    algorithms: record.algorithms,
  });

  if (!result.ok) {
    throw new Error(
      `Invalid lookup bundle:\n${result.errors.map((error) => `- ${error}`).join('\n')}`,
    );
  }

  const bundle: LookupBundleSnapshot = {
    manifest: result.data.manifest,
    medications: result.data.medications,
    algorithms: result.data.algorithms,
  };

  return {
    bundle,
    version: getSnapshotVersion(bundle),
  };
}

export async function downloadBundle(
  bundleUrl: string,
): Promise<BundleDownloadResult> {
  let response: Response;
  try {
    response = await fetch(bundleUrl);
  } catch {
    return {
      status: 'error',
      reason: 'network',
    };
  }

  if (!response.ok) {
    return {
      status: 'error',
      reason: 'network',
    };
  }

  let payload: unknown;
  try {
    payload = (await response.json()) as unknown;
  } catch {
    return {
      status: 'error',
      reason: 'invalid-json',
    };
  }

  try {
    const validation = validateBundle(payload);
    return {
      status: 'success',
      bundle: validation.bundle,
      version: validation.version,
    };
  } catch {
    return {
      status: 'error',
      reason: 'invalid-schema',
    };
  }
}

export async function checkForBundleUpdate(
  bundleUrl: string,
): Promise<BundleUpdateCheckResult> {
  const currentVersion = (await getCachedVersion()) ?? getEmbeddedVersion();
  const download = await downloadBundle(bundleUrl);

  if (download.status === 'error') {
    return {
      status: 'error',
      currentVersion,
      remoteVersion: null,
    };
  }

  const remoteVersion = download.version;
  const comparison = compareBundleVersion(currentVersion, remoteVersion);
  return {
    status:
      comparison === 'updateAvailable'
        ? 'update-available'
        : comparison === 'downgradeBlocked'
          ? 'downgrade-blocked'
          : 'up-to-date',
    currentVersion,
    remoteVersion,
  };
}

export async function applyBundleUpdate(
  bundleUrl: string,
): Promise<ApplyBundleUpdateResult> {
  const currentVersion = (await getCachedVersion()) ?? getEmbeddedVersion();
  const download = await downloadBundle(bundleUrl);

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
      reason: 'downgrade-blocked',
    };
  }

  try {
    await saveBundle(download.bundle);
  } catch {
    return {
      status: 'error',
      version: currentVersion,
      reason: 'save-failed',
    };
  }

  return {
    status: 'updated',
    version: download.version,
  };
}
