import type {
  ContentPackageId,
  OrgId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { assertExplicitVersionId as assertExplicitVersionDecision } from '../../shared/versioning';

import {
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isLockedApprovalStatus,
  type ApprovalStatus,
} from './ApprovalStatus';
import type { ContentAuditTrailEntry } from './Algorithm';
import {
  createScopeTarget,
  createScopeTargets,
  type ScopeTarget,
} from './ScopeTarget';

export type ContentPackageScopeType = 'global' | 'organization' | 'region';

export interface ContentPackage {
  readonly kind: 'ContentPackage';
  readonly id: ContentPackageId;
  readonly organizationId: OrgId;
  readonly regionId: string | null;
  readonly scopeType: ContentPackageScopeType;
  readonly entityType: 'ContentPackage';
  readonly title: string;
  readonly label: string | null;
  readonly description: string | null;
  readonly targetAudience: ReadonlyArray<string>;
  readonly targetScope: ScopeTarget;
  readonly applicabilityScopes: ReadonlyArray<ScopeTarget>;
  readonly excludedScopes: ReadonlyArray<ScopeTarget>;
  readonly approvalStatus: ApprovalStatus;
  readonly currentVersionId: VersionId;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateContentPackageInput {
  readonly id: ContentPackageId;
  readonly organizationId: OrgId;
  readonly regionId?: string | null;
  readonly scopeType?: ContentPackageScopeType;
  readonly title: string;
  readonly label?: string | null;
  readonly description?: string | null;
  readonly targetAudience?: ReadonlyArray<string>;
  readonly targetScope: ScopeTarget;
  readonly applicabilityScopes?: ReadonlyArray<ScopeTarget>;
  readonly excludedScopes?: ReadonlyArray<ScopeTarget>;
  readonly approvalStatus: ApprovalStatus;
  readonly currentVersionId: VersionId;
  readonly createdAt: Date;
  readonly createdBy: UserRoleId;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createContentPackage(
  input: CreateContentPackageInput,
): ContentPackage {
  const { regionId, scopeType } = resolveRegionScope(input.regionId, input.scopeType);

  return Object.freeze({
    kind: 'ContentPackage',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId: assertOrgId(input.organizationId),
    regionId,
    scopeType,
    entityType: 'ContentPackage',
    title: assertNonEmptyText(input.title, 'title'),
    label: normalizeOptionalText(input.label, 'label'),
    description: normalizeOptionalText(input.description, 'description'),
    targetAudience: freezeTextArray(input.targetAudience, 'targetAudience'),
    targetScope: createScopeTarget(input.targetScope),
    applicabilityScopes: createScopeTargets(input.applicabilityScopes),
    excludedScopes: createScopeTargets(input.excludedScopes),
    approvalStatus: input.approvalStatus,
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    createdAt: cloneDate(input.createdAt, 'createdAt'),
    createdBy: assertNonEmptyId(input.createdBy, 'createdBy'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

function resolveRegionScope(
  rawRegionId: string | null | undefined,
  rawScopeType: ContentPackageScopeType | undefined,
): { readonly regionId: string | null; readonly scopeType: ContentPackageScopeType } {
  const regionId =
    typeof rawRegionId === 'string' && rawRegionId.trim().length > 0
      ? rawRegionId.trim()
      : null;

  if (regionId !== null) {
    if (rawScopeType !== undefined && rawScopeType !== 'region') {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'ContentPackage.scopeType must be "region" when regionId is set.',
        { scopeType: rawScopeType },
      );
    }

    return { regionId, scopeType: 'region' };
  }

  if (rawScopeType === 'region') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ContentPackage.regionId is required when scopeType is "region".',
    );
  }

  return { regionId: null, scopeType: rawScopeType ?? 'global' };
}

export function isContentPackageEditable(
  contentPackage: Pick<ContentPackage, 'approvalStatus'>,
): boolean {
  return isEditableApprovalStatus(contentPackage.approvalStatus);
}

export function isContentPackageLocked(
  contentPackage: Pick<ContentPackage, 'approvalStatus'>,
): boolean {
  return isLockedApprovalStatus(contentPackage.approvalStatus);
}

export function isContentPackageImmutable(
  contentPackage: Pick<ContentPackage, 'approvalStatus'>,
): boolean {
  return isImmutableApprovalStatus(contentPackage.approvalStatus);
}

function freezeAuditTrail(
  entries: ReadonlyArray<ContentAuditTrailEntry> | undefined,
): ReadonlyArray<ContentAuditTrailEntry> {
  return Object.freeze(
    (entries ?? []).map((entry) =>
      Object.freeze({
        recordedAt: cloneDate(entry.recordedAt, 'auditTrail.recordedAt'),
        actorRoleId: assertNonEmptyId(entry.actorRoleId, 'auditTrail.actorRoleId'),
        operation: assertNonEmptyText(entry.operation, 'auditTrail.operation'),
        rationale: assertNonEmptyText(entry.rationale, 'auditTrail.rationale'),
      }),
    ),
  );
}

function normalizeDeprecation(
  dateValue: Date | null | undefined,
  reasonValue: string | null | undefined,
): { readonly deprecationDate: Date | null; readonly deprecationReason: string | null } {
  const deprecationDate = cloneOptionalDate(dateValue, 'deprecationDate');
  const deprecationReason = normalizeOptionalText(
    reasonValue,
    'deprecationReason',
  );

  if ((deprecationDate == null) !== (deprecationReason == null)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'deprecationDate and deprecationReason must be provided together.',
    );
  }

  return { deprecationDate, deprecationReason };
}

function assertExplicitVersionId(value: VersionId): VersionId {
  const versionId = assertNonEmptyId(value, 'currentVersionId');
  const versionCheck = assertExplicitVersionDecision(versionId.toLowerCase());

  if (!versionCheck.allowed) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'currentVersionId must be an explicit version identifier.',
    );
  }

  return versionId;
}

function freezeTextArray(
  values: ReadonlyArray<string> | undefined,
  field: string,
): ReadonlyArray<string> {
  return Object.freeze((values ?? []).map((value) => assertNonEmptyText(value, field)));
}

function normalizeOptionalText(
  value: string | null | undefined,
  field: string,
): string | null {
  if (value == null) {
    return null;
  }

  return assertNonEmptyText(value, field);
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
