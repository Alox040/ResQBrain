import type {
  ContentPackageId,
  OrgId,
  ReleaseVersionRecordId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { createCompositionEntry, type CompositionEntry } from './CompositionEntry';
import {
  ReleaseStatus,
  type ReleaseStatus as ReleaseStatusValue,
} from './ReleaseStatus';
import { ReleaseType, type ReleaseType as ReleaseTypeValue } from './ReleaseType';
import {
  freezeTargetScope,
  type VersionTargetScope,
} from './ContentPackageVersion';

export interface ReleaseVersion {
  readonly kind: 'ReleaseVersion';
  readonly id: ReleaseVersionRecordId;
  readonly organizationId: OrgId;
  readonly packageVersionId: VersionId;
  readonly packageId: ContentPackageId;
  readonly releasedAt: Date;
  readonly releasedBy: UserRoleId;
  readonly targetScope: VersionTargetScope;
  readonly releaseType: ReleaseTypeValue;
  readonly supersededReleaseId: ReleaseVersionRecordId | null;
  readonly rollbackSourceVersionId: VersionId | null;
  readonly compositionSnapshot: ReadonlyArray<CompositionEntry>;
  readonly status: ReleaseStatusValue;
}

export interface CreateReleaseVersionInput {
  readonly id: ReleaseVersionRecordId;
  readonly organizationId: OrgId;
  readonly packageVersionId: VersionId;
  readonly packageId: ContentPackageId;
  readonly releasedAt: Date;
  readonly releasedBy: UserRoleId;
  readonly targetScope: VersionTargetScope;
  readonly releaseType: ReleaseTypeValue;
  readonly compositionSnapshot: ReadonlyArray<CompositionEntry>;
  readonly supersededReleaseId?: ReleaseVersionRecordId | null;
  readonly rollbackSourceVersionId?: VersionId | null;
  readonly status?: ReleaseStatusValue;
}

export function createReleaseVersion(
  input: CreateReleaseVersionInput,
): ReleaseVersion {
  assertNonEmptyId(input.id, 'id');
  assertOrgId(input.organizationId);
  assertNonEmptyId(input.packageVersionId, 'packageVersionId');
  assertNonEmptyId(input.packageId, 'packageId');
  const releasedAt = cloneDate(input.releasedAt, 'releasedAt');
  assertNonEmptyId(input.releasedBy, 'releasedBy');
  const targetScope = freezeTargetScope(input.targetScope);
  const compositionSnapshot = Object.freeze(
    input.compositionSnapshot.map((entry) => createCompositionEntry(entry)),
  );
  const status = assertReleaseStatus(input.status ?? ReleaseStatus.ACTIVE);

  validateReleaseType(input.releaseType);
  validateReleaseLinks(
    input.releaseType,
    input.supersededReleaseId ?? null,
    input.rollbackSourceVersionId ?? null,
  );

  return Object.freeze({
    kind: 'ReleaseVersion',
    id: input.id,
    organizationId: input.organizationId,
    packageVersionId: input.packageVersionId,
    packageId: input.packageId,
    releasedAt,
    releasedBy: input.releasedBy,
    targetScope,
    releaseType: input.releaseType,
    supersededReleaseId: input.supersededReleaseId ?? null,
    rollbackSourceVersionId: input.rollbackSourceVersionId ?? null,
    compositionSnapshot,
    status,
  });
}

function assertReleaseStatus(value: ReleaseStatusValue): ReleaseStatusValue {
  if (value !== ReleaseStatus.ACTIVE && value !== ReleaseStatus.SUPERSEDED) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'status must be a valid release status.',
      { status: value },
    );
  }

  return value;
}

function validateReleaseType(value: ReleaseTypeValue): ReleaseTypeValue {
  if (
    value !== ReleaseType.INITIAL &&
    value !== ReleaseType.UPDATE &&
    value !== ReleaseType.ROLLBACK
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'releaseType must be a valid release type.',
      { releaseType: value },
    );
  }

  return value;
}

export function markReleaseVersionSuperseded(
  releaseVersion: ReleaseVersion,
): ReleaseVersion {
  if (releaseVersion.status === ReleaseStatus.SUPERSEDED) {
    return releaseVersion;
  }

  return Object.freeze({
    ...releaseVersion,
    status: ReleaseStatus.SUPERSEDED,
  });
}

function validateReleaseLinks(
  releaseType: ReleaseTypeValue,
  supersededReleaseId: ReleaseVersionRecordId | null,
  rollbackSourceVersionId: VersionId | null,
): void {
  if (releaseType === ReleaseType.INITIAL) {
    if (supersededReleaseId != null || rollbackSourceVersionId != null) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'Initial releases must not carry supersession or rollback links.',
      );
    }

    return;
  }

  if (supersededReleaseId == null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Update and rollback releases require supersededReleaseId.',
    );
  }

  if (releaseType === ReleaseType.ROLLBACK && rollbackSourceVersionId == null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Rollback releases require rollbackSourceVersionId.',
    );
  }

  if (releaseType === ReleaseType.UPDATE && rollbackSourceVersionId != null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Update releases must not define rollbackSourceVersionId.',
    );
  }
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
