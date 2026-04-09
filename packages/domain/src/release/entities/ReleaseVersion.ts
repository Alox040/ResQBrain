import type { UserRoleId, VersionId } from '../../shared/types';

import { DomainError } from '../../shared/errors';

/** Semver display record for release lookups (distinct from versioning `ReleaseVersion`). */
export interface SemanticReleaseVersion {
  readonly kind: 'SemanticReleaseVersion';
  readonly version: VersionId;
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly createdAt: Date;
  readonly releasedBy: UserRoleId;
}

export interface CreateSemanticReleaseVersionInput {
  readonly version: VersionId;
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly createdAt: Date;
  readonly releasedBy: UserRoleId;
}

export function createSemanticReleaseVersion(
  input: CreateSemanticReleaseVersionInput,
): SemanticReleaseVersion {
  const major = assertVersionSegment(input.major, 'major');
  const minor = assertVersionSegment(input.minor, 'minor');
  const patch = assertVersionSegment(input.patch, 'patch');
  const version = assertVersion(input.version);
  const expectedVersion = `${major}.${minor}.${patch}`;

  if (version !== expectedVersion) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'version must match major.minor.patch.',
      { version, expectedVersion },
    );
  }

  return Object.freeze({
    kind: 'SemanticReleaseVersion',
    version,
    major,
    minor,
    patch,
    createdAt: cloneDate(input.createdAt, 'createdAt'),
    releasedBy: assertNonEmptyId(input.releasedBy, 'releasedBy'),
  });
}

function assertVersion(value: VersionId): VersionId {
  return assertNonEmptyId(value, 'version');
}

function assertVersionSegment(value: number, field: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a non-negative integer.`,
      { field, value },
    );
  }

  return value;
}

function assertNonEmptyId<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} is required.`,
      { field },
    );
  }

  return value;
}

function cloneDate(value: Date, field: string): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a valid Date.`,
      { field },
    );
  }

  return new Date(value.getTime());
}
