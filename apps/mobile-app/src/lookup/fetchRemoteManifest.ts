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
  const manifestUrl = buildManifestUrl(options.baseUrl);
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(manifestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        status: 'error',
        reason: 'invalid-response',
      };
    }

    let payload: unknown;
    try {
      payload = (await response.json()) as unknown;
    } catch {
      return {
        status: 'error',
        reason: 'invalid-response',
      };
    }

    const manifest = parseManifestPayload(payload, manifestUrl);
    if (!manifest) {
      return {
        status: 'error',
        reason: 'invalid-response',
      };
    }

    return {
      status: 'success',
      manifest,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: 'error',
        reason: 'timeout',
      };
    }

    return {
      status: 'error',
      reason: 'offline',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
