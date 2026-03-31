import type { ValidatedLookupBundle } from './lookupSchema';

type BundleLike = Pick<ValidatedLookupBundle, 'manifest'>;

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

function parseGeneratedAt(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isNewerBundle(a: BundleLike, b: BundleLike): boolean {
  const aGeneratedAt = parseGeneratedAt(a.manifest.generatedAt);
  const bGeneratedAt = parseGeneratedAt(b.manifest.generatedAt);

  if (aGeneratedAt !== null && bGeneratedAt !== null && aGeneratedAt !== bGeneratedAt) {
    return aGeneratedAt > bGeneratedAt;
  }

  return compareBundleIds(a.manifest.bundleId, b.manifest.bundleId) > 0;
}
