import type {
  ContentPackageId,
  CountyId,
  OrgId,
  RegionId,
  StationId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { createCompositionEntry, type CompositionEntry } from './CompositionEntry';
import {
  appendLineageStates,
  createLineageStateSet,
  type ImmutableLineageStateSet,
  LineageState,
  type LineageState as LineageStateValue,
} from './LineageState';

export interface VersionTargetScope {
  readonly scopeLevel: ScopeLevel;
  readonly scopeTargetId?: RegionId | CountyId | StationId | null;
}

export interface ContentPackageVersionPredecessor {
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly packageId: ContentPackageId;
  readonly versionNumber: number;
  readonly hasSuccessor?: boolean;
}

export interface ContentPackageVersion {
  readonly kind: 'ContentPackageVersion';
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly packageId: ContentPackageId;
  readonly versionNumber: number;
  readonly predecessorVersionId: VersionId | null;
  readonly lineageState: ImmutableLineageStateSet;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly changeReason: string | null;
  readonly composition: ReadonlyArray<CompositionEntry>;
  readonly targetScope: VersionTargetScope;
  readonly releaseNotes: string | null;
  readonly compatibilityNotes: string | null;
}

export interface CreateContentPackageVersionInput {
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly packageId: ContentPackageId;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly composition: ReadonlyArray<CompositionEntry>;
  readonly targetScope: VersionTargetScope;
  readonly predecessor?: ContentPackageVersionPredecessor;
  readonly changeReason?: string | null;
  readonly releaseNotes?: string | null;
  readonly compatibilityNotes?: string | null;
}

export function createContentPackageVersion(
  input: CreateContentPackageVersionInput,
): ContentPackageVersion {
  assertNonEmptyId(input.id, 'id');
  assertOrgId(input.organizationId);
  assertNonEmptyId(input.packageId, 'packageId');
  const createdAt = cloneDate(input.createdAt, 'createdAt');
  assertNonEmptyId(input.createdBy, 'createdBy');
  const targetScope = freezeTargetScope(input.targetScope);
  const composition = Object.freeze(
    input.composition.map((entry) => createCompositionEntry(entry)),
  );
  const predecessor = input.predecessor;

  let versionNumber = 1;
  let predecessorVersionId: VersionId | null = null;
  let changeReason: string | null = null;

  if (predecessor) {
    validateContentPackagePredecessor(input, predecessor);
    versionNumber = predecessor.versionNumber + 1;
    predecessorVersionId = predecessor.id;
    changeReason = assertRequiredChangeReason(input.changeReason);
  }

  if (!predecessor && input.changeReason != null) {
    changeReason = assertOptionalChangeReason(input.changeReason);
  }

  return Object.freeze({
    kind: 'ContentPackageVersion',
    id: input.id,
    organizationId: input.organizationId,
    packageId: input.packageId,
    versionNumber,
    predecessorVersionId,
    lineageState: createLineageStateSet([LineageState.ACTIVE]),
    createdAt,
    createdBy: input.createdBy,
    changeReason,
    composition,
    targetScope,
    releaseNotes: normalizeOptionalText(input.releaseNotes),
    compatibilityNotes: normalizeOptionalText(input.compatibilityNotes),
  });
}

export function withAdditionalContentPackageLineageStates(
  version: ContentPackageVersion,
  additions: Iterable<LineageStateValue>,
): ContentPackageVersion {
  return Object.freeze({
    ...version,
    lineageState: appendLineageStates(version.lineageState, additions),
  });
}

function validateContentPackagePredecessor(
  input: CreateContentPackageVersionInput,
  predecessor: ContentPackageVersionPredecessor,
): void {
  if (predecessor.organizationId !== input.organizationId) {
    throw new DomainError(
      'CROSS_TENANT_ACCESS_DENIED',
      'predecessorVersionId must stay within the same organization.',
    );
  }

  if (predecessor.packageId !== input.packageId) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'predecessorVersionId must reference the same package lineage.',
    );
  }

  if (predecessor.hasSuccessor === true) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Branching is prohibited in Phase 0.',
    );
  }
}

export function freezeTargetScope(input: VersionTargetScope): VersionTargetScope {
  if (input == null || typeof input !== 'object') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'targetScope is required.',
    );
  }

  if (input.scopeLevel === ScopeLevel.ORGANIZATION) {
    if (input.scopeTargetId != null) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'Organization targetScope must not define scopeTargetId.',
      );
    }

    return Object.freeze({
      scopeLevel: input.scopeLevel,
    });
  }

  assertNonEmptyId(input.scopeTargetId as string, 'targetScope.scopeTargetId');

  return Object.freeze({
    scopeLevel: input.scopeLevel,
    scopeTargetId: input.scopeTargetId ?? null,
  });
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'organizationId is required.',
    );
  }

  return value;
}

function assertRequiredChangeReason(value: string | null | undefined): string {
  const normalized = assertOptionalChangeReason(value, true);

  if (normalized == null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'changeReason is required from version 2 onward.',
    );
  }

  return normalized;
}

function assertOptionalChangeReason(
  value: string | null | undefined,
  required = false,
): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    if (required) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'changeReason is required from version 2 onward.',
      );
    }

    return null;
  }

  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Optional text fields must be non-empty when provided.',
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
