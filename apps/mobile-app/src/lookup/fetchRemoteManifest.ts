/**
 * Phase-2 helper.
 *
 * This manifest fetcher is currently not wired into the active lookup update
 * path. Phase-0 keeps this file disabled to prevent accidental HTTP usage.
 */
const LOOKUP_MANIFEST_PATH = '/lookup/manifest.json';
const DEFAULT_TIMEOUT_MS = 8000;

export type RemoteLookupManifest = {
  bundleId: string;
  version: string;
  checksum: string;
  url: string;
};

export type FetchRemoteManifestResult =
  | {
      status: 'success';
      manifest: RemoteLookupManifest;
    }
  | {
      status: 'error';
      reason: 'offline' | 'timeout' | 'invalid-response';
    };

export type FetchRemoteManifestOptions = {
  baseUrl?: string;
  timeoutMs?: number;
};

function buildManifestUrl(baseUrl?: string): string {
  if (!baseUrl) {
    return LOOKUP_MANIFEST_PATH;
  }

  return new URL(LOOKUP_MANIFEST_PATH, baseUrl).toString();
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseManifestPayload(payload: unknown, manifestUrl: string): RemoteLookupManifest | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (
    !isNonEmptyString(record.bundleId) ||
    !isNonEmptyString(record.version) ||
    !isNonEmptyString(record.checksum) ||
    !isNonEmptyString(record.url)
  ) {
    return null;
  }

  let resolvedBundleUrl: string;
  try {
    resolvedBundleUrl = new URL(record.url, manifestUrl).toString();
  } catch {
    return null;
  }

  return {
    bundleId: record.bundleId,
    version: record.version,
    checksum: record.checksum,
    url: resolvedBundleUrl,
  };
}

export async function fetchRemoteManifest(
  options: FetchRemoteManifestOptions = {},
): Promise<FetchRemoteManifestResult> {
  void options;
  return {
    status: 'error',
    reason: 'offline',
  };
}
