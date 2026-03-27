import type {
  AlgorithmId,
  GuidelineId,
  MedicationId,
  ProtocolId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { assertExplicitVersionId as assertExplicitVersionDecision } from '../../shared/versioning';
import { CONTENT_ENTITY_TYPES, type ContentEntityType } from './EntityType';

export type CompositionEntityId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;

export interface CompositionEntry {
  readonly entityId: CompositionEntityId;
  readonly versionId: VersionId;
  readonly entityType: ContentEntityType;
}

export interface CreateCompositionEntryInput {
  readonly entityId: CompositionEntityId;
  readonly versionId: VersionId;
  readonly entityType: ContentEntityType;
}

export function createCompositionEntry(
  input: CreateCompositionEntryInput,
): CompositionEntry {
  assertNonEmptyId(input.entityId, 'entityId');
  assertExplicitVersionId(input.versionId);
  assertEntityType(input.entityType);

  return Object.freeze({
    entityId: input.entityId,
    versionId: input.versionId,
    entityType: input.entityType,
  });
}

function assertEntityType(value: ContentEntityType): ContentEntityType {
  if (!CONTENT_ENTITY_TYPES.includes(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'CompositionEntry.entityType must be a content entity type.',
      { entityType: value },
    );
  }

  return value;
}

function assertExplicitVersionId(value: VersionId): VersionId {
  const normalized = assertNonEmptyId(value, 'versionId');
  const versionCheck = assertExplicitVersionDecision(normalized.toLowerCase());

  if (!versionCheck.allowed) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'CompositionEntry.versionId must be an explicit version identifier.',
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
