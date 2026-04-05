import type {
  ContentPackageId,
  CountyId,
  OrgId,
  RegionId,
  StationId,
  UserRoleId,
  VersionId,
} from '../../shared/types';
import type { ContentPackage } from '../../content/entities';

import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { createCompositionEntry, type CompositionEntry } from './CompositionEntry';
import {
  createContentPackageDependencyNote,
  ContentPackageDependencyType,
  type ContentPackageDependencyNote,
} from './ContentPackageDependency';
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
  readonly regionId?: string | null;
  readonly versionNumber: number;
  readonly hasSuccessor?: boolean;
}

export interface ContentPackageVersion {
  readonly kind: 'ContentPackageVersion';
  readonly id: VersionId;
  readonly organizationId: OrgId;
  readonly packageId: ContentPackageId;
  readonly regionId?: string;
  readonly versionNumber: number;
  readonly predecessorVersionId: VersionId | null;
  readonly lineageState: ImmutableLineageStateSet;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly changeReason: string | null;
  readonly composition: ReadonlyArray<CompositionEntry>;
  readonly targetScope: VersionTargetScope;
  readonly applicabilityScopes: ReadonlyArray<VersionTargetScope>;
  readonly excludedScopes: ReadonlyArray<VersionTargetScope>;
  readonly releaseNotes: string | null;
  readonly compatibilityNotes: string | null;
  readonly dependencyNotes: ReadonlyArray<ContentPackageDependencyNote>;
}

export interface CreateContentPackageVersionInput {
  readonly id: VersionId;
  readonly contentPackage: Pick<ContentPackage, 'id' | 'organizationId' | 'regionId'>;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly composition: ReadonlyArray<CompositionEntry>;
  readonly targetScope: VersionTargetScope;
  readonly applicabilityScopes?: ReadonlyArray<VersionTargetScope>;
  readonly excludedScopes?: ReadonlyArray<VersionTargetScope>;
  readonly predecessor?: ContentPackageVersionPredecessor;
  readonly changeReason?: string | null;
  readonly releaseNotes?: string | null;
  readonly compatibilityNotes?: string | null;
  readonly dependencyNotes?: ReadonlyArray<ContentPackageDependencyNote>;
}

export function createContentPackageVersion(
  input: CreateContentPackageVersionInput,
): ContentPackageVersion {
  assertNonEmptyId(input.id, 'id');
  const contentPackage = freezeContentPackageIdentity(input.contentPackage);
  const createdAt = cloneDate(input.createdAt, 'createdAt');
  assertNonEmptyId(input.createdBy, 'createdBy');
  const targetScope = freezeTargetScope(input.targetScope);
  const applicabilityScopes = freezeTargetScopes(input.applicabilityScopes);
  const excludedScopes = freezeTargetScopes(input.excludedScopes);
  const composition = Object.freeze(
    input.composition.map((entry) => createCompositionEntry(entry)),
  );
  validateUniqueComposition(composition);
  const predecessor = input.predecessor;
  const dependencyNotes = Object.freeze(
    (input.dependencyNotes ?? []).map((note) =>
      createContentPackageDependencyNote(note),
    ),
  );
  validateDependencyNotes(dependencyNotes);

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
    organizationId: contentPackage.organizationId,
    packageId: contentPackage.id,
    ...(contentPackage.regionId != null ? { regionId: contentPackage.regionId } : {}),
    versionNumber,
    predecessorVersionId,
    lineageState: createLineageStateSet([LineageState.ACTIVE]),
    createdAt,
    createdBy: input.createdBy,
    changeReason,
    composition,
    targetScope,
    applicabilityScopes,
    excludedScopes,
    releaseNotes: normalizeOptionalText(input.releaseNotes),
    compatibilityNotes: normalizeOptionalText(input.compatibilityNotes),
    dependencyNotes,
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
  if (predecessor.organizationId !== input.contentPackage.organizationId) {
    throw new DomainError(
      'CROSS_TENANT_ACCESS_DENIED',
      'predecessorVersionId must stay within the same organization.',
    );
  }

  if (predecessor.packageId !== input.contentPackage.id) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'predecessorVersionId must reference the same package lineage.',
    );
  }

  if ((predecessor.regionId ?? null) !== (input.contentPackage.regionId ?? null)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'predecessorVersionId must preserve the inherited package region.',
    );
  }

  if (predecessor.hasSuccessor === true) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Branching is prohibited in Phase 0.',
    );
  }
}

function freezeContentPackageIdentity(
  input: Pick<ContentPackage, 'id' | 'organizationId' | 'regionId'>,
): Pick<ContentPackage, 'id' | 'organizationId' | 'regionId'> {
  if (input == null || typeof input !== 'object') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'contentPackage is required.',
    );
  }

  const id = assertNonEmptyId(input.id, 'contentPackage.id');
  const organizationId = assertOrgId(input.organizationId);
  const regionId =
    typeof input.regionId === 'string' && input.regionId.trim().length > 0
      ? (input.regionId.trim() as RegionId)
      : null;

  return Object.freeze({
    id,
    organizationId,
    regionId,
  });
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

function freezeTargetScopes(
  inputs: ReadonlyArray<VersionTargetScope> | undefined,
): ReadonlyArray<VersionTargetScope> {
  return Object.freeze((inputs ?? []).map((input) => freezeTargetScope(input)));
}

function validateUniqueComposition(
  composition: ReadonlyArray<CompositionEntry>,
): void {
  const seen = new Map<string, CompositionEntry>();

  for (const entry of composition) {
    const key = `${entry.entityType}:${entry.entityId}`;
    const duplicate = seen.get(key);

    if (duplicate) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'A ContentPackageVersion cannot contain multiple versions of the same content entity.',
        {
          entityType: entry.entityType,
          entityId: entry.entityId,
          versionIds: [duplicate.versionId, entry.versionId],
        },
      );
    }

    seen.set(key, entry);
  }
}

function validateDependencyNotes(
  dependencyNotes: ReadonlyArray<ContentPackageDependencyNote>,
): void {
  const exactKeys = new Map<string, ContentPackageDependencyNote>();
  const targetRelations = new Map<string, Set<ContentPackageDependencyType>>();

  for (const note of dependencyNotes) {
    const exactKey = [
      note.dependencyType,
      note.targetEntityType,
      note.targetEntityId,
      note.targetVersionId ?? '*',
    ].join(':');
    const targetKey = [
      note.targetEntityType,
      note.targetEntityId,
      note.targetVersionId ?? '*',
    ].join(':');
    const existing = exactKeys.get(exactKey);

    if (existing) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'Duplicate dependencyNotes entries are not allowed.',
        {
          dependencyType: note.dependencyType,
          targetEntityType: note.targetEntityType,
          targetEntityId: note.targetEntityId,
          targetVersionId: note.targetVersionId,
        },
      );
    }

    const relations = targetRelations.get(targetKey) ?? new Set<ContentPackageDependencyType>();
    relations.add(note.dependencyType);
    targetRelations.set(targetKey, relations);
    exactKeys.set(exactKey, note);

    if (
      relations.has(ContentPackageDependencyType.REQUIRES) &&
      relations.has(ContentPackageDependencyType.CONFLICTS)
    ) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'dependencyNotes cannot both require and conflict with the same target.',
        {
          targetEntityType: note.targetEntityType,
          targetEntityId: note.targetEntityId,
          targetVersionId: note.targetVersionId,
        },
      );
    }
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
