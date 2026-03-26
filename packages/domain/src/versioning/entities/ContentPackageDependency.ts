import type {
  ContentPackageId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { CompositionEntityId } from './CompositionEntry';
import {
  CONTENT_ENTITY_TYPES,
  EntityType,
  type ContentEntityType,
} from './EntityType';

export const ContentPackageDependencyType = {
  REQUIRES: 'Requires',
  SUPERSEDES: 'Supersedes',
  CONFLICTS: 'Conflicts',
  RECOMMENDS_ALONGSIDE: 'RecommendsAlongside',
} as const;

export type ContentPackageDependencyType =
  (typeof ContentPackageDependencyType)[keyof typeof ContentPackageDependencyType];

export const ContentPackageDependencySeverity = {
  WARNING: 'Warning',
  HARD_BLOCK: 'HardBlock',
} as const;

export type ContentPackageDependencySeverity =
  (typeof ContentPackageDependencySeverity)[keyof typeof ContentPackageDependencySeverity];

export type ContentPackageDependencyTargetEntityType =
  | ContentEntityType
  | typeof EntityType.ContentPackage;

export type ContentPackageDependencyTargetEntityId =
  | CompositionEntityId
  | ContentPackageId;

export interface ContentPackageDependencyNote {
  readonly dependencyType: ContentPackageDependencyType;
  readonly targetEntityType: ContentPackageDependencyTargetEntityType;
  readonly targetEntityId: ContentPackageDependencyTargetEntityId;
  readonly targetVersionId: VersionId | null;
  readonly severity: ContentPackageDependencySeverity;
  readonly rationale: string;
}

export interface CreateContentPackageDependencyNoteInput {
  readonly dependencyType: ContentPackageDependencyType;
  readonly targetEntityType: ContentPackageDependencyTargetEntityType;
  readonly targetEntityId: ContentPackageDependencyTargetEntityId;
  readonly targetVersionId?: VersionId | null;
  readonly severity: ContentPackageDependencySeverity;
  readonly rationale: string;
}

const DEPENDENCY_TYPES = Object.freeze(
  Object.values(ContentPackageDependencyType),
);

const DEPENDENCY_SEVERITIES = Object.freeze(
  Object.values(ContentPackageDependencySeverity),
);

export function createContentPackageDependencyNote(
  input: CreateContentPackageDependencyNoteInput,
): ContentPackageDependencyNote {
  return Object.freeze({
    dependencyType: assertDependencyType(input.dependencyType),
    targetEntityType: assertTargetEntityType(input.targetEntityType),
    targetEntityId: assertNonEmptyId(input.targetEntityId, 'targetEntityId'),
    targetVersionId: normalizeOptionalVersionId(input.targetVersionId),
    severity: assertSeverity(input.severity),
    rationale: assertNonEmptyText(input.rationale, 'rationale'),
  });
}

function assertDependencyType(
  value: ContentPackageDependencyType,
): ContentPackageDependencyType {
  if (!DEPENDENCY_TYPES.includes(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'dependencyType is invalid.',
      { dependencyType: value },
    );
  }

  return value;
}

function assertTargetEntityType(
  value: ContentPackageDependencyTargetEntityType,
): ContentPackageDependencyTargetEntityType {
  if (value === EntityType.ContentPackage) {
    return value;
  }

  if (!CONTENT_ENTITY_TYPES.includes(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'targetEntityType is invalid.',
      { targetEntityType: value },
    );
  }

  return value;
}

function normalizeOptionalVersionId(value: VersionId | null | undefined): VersionId | null {
  if (value == null) {
    return null;
  }

  const normalized = assertNonEmptyId(value, 'targetVersionId');

  if (normalized.toLowerCase() === 'latest') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'targetVersionId must be an explicit version identifier.',
      { targetVersionId: value },
    );
  }

  return normalized;
}

function assertSeverity(
  value: ContentPackageDependencySeverity,
): ContentPackageDependencySeverity {
  if (!DEPENDENCY_SEVERITIES.includes(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'severity is invalid.',
      { severity: value },
    );
  }

  return value;
}

function assertNonEmptyText(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} is required.`,
      { field },
    );
  }

  return value.trim();
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
