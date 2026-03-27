export type ExplicitVersionDecision =
  | {
      readonly allowed: true;
      readonly denyReason?: undefined;
    }
  | {
      readonly allowed: false;
      readonly denyReason: 'EXPLICIT_VERSION_REQUIRED';
    };

export function assertExplicitVersionId(versionId: string): ExplicitVersionDecision {
  if (versionId === 'latest') {
    return Object.freeze({
      allowed: false,
      denyReason: 'EXPLICIT_VERSION_REQUIRED' as const,
    });
  }

  return Object.freeze({ allowed: true });
}
