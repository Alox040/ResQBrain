import type {
  AlgorithmId,
  ContentPackageId,
  GuidelineId,
  MedicationId,
  OrgId,
  ProtocolId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';

/** Draft/released state for the release-subsystem id-list package (not content `ContentPackage`). */
export const ReleaseBundleStatus = {
  DRAFT: 'Draft',
  RELEASED: 'Released',
} as const;

export type ReleaseBundleStatus =
  (typeof ReleaseBundleStatus)[keyof typeof ReleaseBundleStatus];

export interface ReleaseContentCollection {
  readonly algorithms: ReadonlyArray<AlgorithmId>;
  readonly medications: ReadonlyArray<MedicationId>;
  readonly protocols: ReadonlyArray<ProtocolId>;
  readonly guidelines: ReadonlyArray<GuidelineId>;
}

export interface ReleaseBundle extends ReleaseContentCollection {
  readonly kind: 'ReleaseBundle';
  readonly id: ContentPackageId;
  readonly organizationId: OrgId;
  readonly version: VersionId;
  readonly createdAt: Date;
  readonly releasedAt: Date | null;
  readonly status: ReleaseBundleStatus;
}

export interface CreateReleaseBundleInput extends ReleaseContentCollection {
  readonly id: ContentPackageId;
  readonly organizationId: OrgId;
  readonly version: VersionId;
  readonly createdAt: Date;
  readonly releasedAt?: Date | null;
  readonly status?: ReleaseBundleStatus;
}

export interface PublishReleaseBundleInput {
  readonly releasedAt: Date;
}

export function createReleaseBundle(input: CreateReleaseBundleInput): ReleaseBundle {
  const status = assertStatus(input.status ?? ReleaseBundleStatus.DRAFT);
  const releasedAt = cloneOptionalDate(input.releasedAt, 'releasedAt');

  if (status === ReleaseBundleStatus.DRAFT && releasedAt !== null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Draft release bundles must not define releasedAt.',
    );
  }

  if (status === ReleaseBundleStatus.RELEASED && releasedAt === null) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Released bundles require releasedAt.',
    );
  }

  return Object.freeze({
    kind: 'ReleaseBundle',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId: assertOrgId(input.organizationId),
    version: assertVersionId(input.version),
    createdAt: cloneDate(input.createdAt, 'createdAt'),
    releasedAt,
    status,
    algorithms: freezeIdArray(input.algorithms, 'algorithms'),
    medications: freezeIdArray(input.medications, 'medications'),
    protocols: freezeIdArray(input.protocols, 'protocols'),
    guidelines: freezeIdArray(input.guidelines, 'guidelines'),
  });
}

export function publishReleaseBundle(
  bundle: ReleaseBundle,
  input: PublishReleaseBundleInput,
): ReleaseBundle {
  if (isReleaseBundlePublished(bundle)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ReleaseBundle is immutable after release.',
      { id: bundle.id, status: bundle.status },
    );
  }

  return Object.freeze({
    ...bundle,
    releasedAt: cloneDate(input.releasedAt, 'releasedAt'),
    status: ReleaseBundleStatus.RELEASED,
  });
}

export function isReleaseBundlePublished(
  bundle: Pick<ReleaseBundle, 'status'>,
): boolean {
  return bundle.status === ReleaseBundleStatus.RELEASED;
}

export function assertReleaseBundleMutable(
  bundle: Pick<ReleaseBundle, 'id' | 'status'>,
): void {
  if (isReleaseBundlePublished(bundle)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ReleaseBundle is immutable after release.',
      { id: bundle.id, status: bundle.status },
    );
  }
}

function assertStatus(value: ReleaseBundleStatus): ReleaseBundleStatus {
  if (
    value !== ReleaseBundleStatus.DRAFT &&
    value !== ReleaseBundleStatus.RELEASED
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'status must be a valid release bundle status.',
      { status: value },
    );
  }

  return value;
}

function freezeIdArray<TValue extends string>(
  values: ReadonlyArray<TValue>,
  field: string,
): ReadonlyArray<TValue> {
  const normalized = values.map((value) => assertNonEmptyId(value, field));

  if (new Set(normalized).size !== normalized.length) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must not contain duplicate ids.`,
      { field },
    );
  }

  return Object.freeze([...normalized]);
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

function assertVersionId(value: VersionId): VersionId {
  return assertNonEmptyId(value, 'version');
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

function cloneOptionalDate(
  value: Date | null | undefined,
  field: string,
): Date | null {
  if (value == null) {
    return null;
  }

  return cloneDate(value, field);
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
