import type {
  AlgorithmId,
  GuidelineId,
  MedicationId,
  OrgId,
  ProtocolId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import {
  appendLineageStates,
  createLineageStateSet,
  type ImmutableLineageStateSet,
  LineageState,
  type LineageState as LineageStateValue,
} from './LineageState';
import {
  CONTENT_ENTITY_TYPES,
  type ContentEntityType,
} from './EntityType';

export type ContentEntityVersionEntityId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;

export type ContentEntitySnapshot = Readonly<Record<string, unknown>>;

export interface ContentEntityVersionPredecessor {
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly entityId: ContentEntityVersionEntityId;
  readonly entityType: ContentEntityType;
  readonly versionNumber: number;
  readonly hasSuccessor?: boolean;
}

export interface ContentEntityVersion<
  TSnapshot extends ContentEntitySnapshot = ContentEntitySnapshot,
> {
  readonly kind: 'ContentEntityVersion';
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly entityId: ContentEntityVersionEntityId;
  readonly entityType: ContentEntityType;
  readonly versionNumber: number;
  readonly predecessorVersionId: VersionId | null;
  readonly lineageState: ImmutableLineageStateSet;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly changeReason: string | null;
  readonly snapshot: TSnapshot;
}

export interface CreateContentEntityVersionInput<
  TSnapshot extends ContentEntitySnapshot = ContentEntitySnapshot,
> {
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly entityId: ContentEntityVersionEntityId;
  readonly entityType: ContentEntityType;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly snapshot: TSnapshot;
  readonly predecessor?: ContentEntityVersionPredecessor;
  readonly changeReason?: string | null;
}

export function createContentEntityVersion<
  TSnapshot extends ContentEntitySnapshot,
>(
  input: CreateContentEntityVersionInput<TSnapshot>,
): ContentEntityVersion<TSnapshot> {
  assertNonEmptyId(input.id, 'id');
  assertOrgId(input.organizationId);
  assertNonEmptyId(input.entityId, 'entityId');
  assertEntityType(input.entityType);
  const createdAt = cloneDate(input.createdAt, 'createdAt');
  assertNonEmptyId(input.createdBy, 'createdBy');
  const snapshot = deepFreezeSnapshot(input.snapshot);
  const predecessor = input.predecessor;

  let versionNumber = 1;
  let predecessorVersionId: VersionId | null = null;
  let changeReason: string | null = null;

  if (predecessor) {
    validateContentEntityPredecessor(input, predecessor);
    versionNumber = predecessor.versionNumber + 1;
    predecessorVersionId = predecessor.id;
    changeReason = assertRequiredChangeReason(input.changeReason);
  }

  if (!predecessor && input.changeReason != null) {
    changeReason = assertOptionalChangeReason(input.changeReason);
  }

  return Object.freeze({
    kind: 'ContentEntityVersion',
    id: input.id,
    organizationId: input.organizationId,
    entityId: input.entityId,
    entityType: input.entityType,
    versionNumber,
    predecessorVersionId,
    lineageState: createLineageStateSet([LineageState.ACTIVE]),
    createdAt,
    createdBy: input.createdBy,
    changeReason,
    snapshot,
  });
}

export function withAdditionalContentEntityLineageStates<
  TSnapshot extends ContentEntitySnapshot,
>(
  version: ContentEntityVersion<TSnapshot>,
  additions: Iterable<LineageStateValue>,
): ContentEntityVersion<TSnapshot> {
  return Object.freeze({
    ...version,
    lineageState: appendLineageStates(version.lineageState, additions),
  });
}

function validateContentEntityPredecessor<
  TSnapshot extends ContentEntitySnapshot,
>(
  input: CreateContentEntityVersionInput<TSnapshot>,
  predecessor: ContentEntityVersionPredecessor,
): void {
  if (predecessor.organizationId !== input.organizationId) {
    throw new DomainError(
      'CROSS_TENANT_ACCESS_DENIED',
      'predecessorVersionId must stay within the same organization.',
    );
  }

  if (predecessor.entityId !== input.entityId) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'predecessorVersionId must reference the same entity lineage.',
    );
  }

  if (predecessor.entityType !== input.entityType) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'predecessorVersionId must reference the same entity type.',
    );
  }

  if (predecessor.hasSuccessor === true) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Branching is prohibited in Phase 0.',
    );
  }
}

function assertEntityType(value: ContentEntityType): ContentEntityType {
  if (!CONTENT_ENTITY_TYPES.includes(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'entityType must be a content entity type.',
      { entityType: value },
    );
  }

  return value;
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

function deepFreezeSnapshot<TSnapshot extends ContentEntitySnapshot>(
  snapshot: TSnapshot,
): TSnapshot {
  if (snapshot === null || Array.isArray(snapshot) || typeof snapshot !== 'object') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'snapshot must be a plain object.',
    );
  }

  return deepFreezeValue(structuredClone(snapshot)) as TSnapshot;
}

function deepFreezeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    for (const item of value) {
      deepFreezeValue(item);
    }

    return Object.freeze(value);
  }

  if (value instanceof Date) {
    return Object.freeze(new Date(value.getTime()));
  }

  if (value !== null && typeof value === 'object') {
    for (const propertyValue of Object.values(value)) {
      deepFreezeValue(propertyValue);
    }

    return Object.freeze(value);
  }

  return value;
}
