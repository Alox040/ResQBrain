import type { ValidatedLookupBundle } from './lookupSchema';

type BundleLike = Pick<ValidatedLookupBundle, 'manifest'>;

export const BUNDLE_VERSION_COMPARISON = {
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UP_TO_DATE: 'UP_TO_DATE',
  ROLLBACK_REQUIRED: 'ROLLBACK_REQUIRED',
} as const;

export type BundleVersionComparison =
  (typeof BUNDLE_VERSION_COMPARISON)[keyof typeof BUNDLE_VERSION_COMPARISON];

function normalizeComparableParts(value: string): string[] {
  return value
    .split(/[^0-9A-Za-z]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function compareComparableParts(left: string, right: string): number {
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

function compareBundleIds(left: string, right: string): number {
  const leftParts = normalizeComparableParts(left);
  const rightParts = normalizeComparableParts(right);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const result = compareComparableParts(leftParts[index] ?? '0', rightParts[index] ?? '0');
    if (result !== 0) {
      return result;
    }
  }

  return 0;
}

function compareVersionStrings(left: string | undefined, right: string | undefined): number | null {
  if (!left && !right) {
    return 0;
  }

  if (!left || !right) {
    return null;
  }

  return compareBundleIds(left, right);
}

function parseGeneratedAt(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function compareManifestAge(
  localManifest: BundleLike['manifest'],
  remoteManifest: BundleLike['manifest'],
): number {
  const localVersion = localManifest.version;
  const remoteVersion = remoteManifest.version;
  const versionComparison = compareVersionStrings(localVersion, remoteVersion);

  if (versionComparison !== null && versionComparison !== 0) {
    return versionComparison;
  }

  const localGeneratedAt = parseGeneratedAt(localManifest.generatedAt ?? localManifest.createdAt);
  const remoteGeneratedAt = parseGeneratedAt(remoteManifest.generatedAt ?? remoteManifest.createdAt);

  if (
    localGeneratedAt !== null &&
    remoteGeneratedAt !== null &&
    localGeneratedAt !== remoteGeneratedAt
  ) {
    return localGeneratedAt > remoteGeneratedAt ? 1 : -1;
  }

  return compareBundleIds(localManifest.bundleId, remoteManifest.bundleId);
}

export function compareBundleVersion(
  localManifest: BundleLike['manifest'],
  remoteManifest: BundleLike['manifest'],
): BundleVersionComparison {
  const comparison = compareManifestAge(localManifest, remoteManifest);

  if (comparison < 0) {
    return BUNDLE_VERSION_COMPARISON.UPDATE_AVAILABLE;
  }

  if (comparison > 0) {
    return BUNDLE_VERSION_COMPARISON.ROLLBACK_REQUIRED;
  }

  return BUNDLE_VERSION_COMPARISON.UP_TO_DATE;
}

export function isNewerBundle(a: BundleLike, b: BundleLike): boolean {
  return compareManifestAge(b.manifest, a.manifest) < 0;
}
