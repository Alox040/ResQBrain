import type {
  AlgorithmId,
  OrgId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { assertExplicitVersionId as assertExplicitVersionDecision } from '../../shared/versioning';
import { ScopeLevel } from '../../tenant/entities';

import type { ApprovalStatus } from './ApprovalStatus';
import {
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isLockedApprovalStatus,
} from './ApprovalStatus';
import type { ScopeTarget } from './ScopeTarget';
import { createScopeTarget } from './ScopeTarget';

export interface ContentAuditTrailEntry {
  readonly recordedAt: Date;
  readonly actorRoleId: UserRoleId;
  readonly operation: string;
  readonly rationale: string;
}

export interface Algorithm {
  readonly kind: 'Algorithm';
  readonly id: AlgorithmId;
  readonly organizationId: OrgId;
  readonly entityType: 'Algorithm';
  readonly title: string;
  readonly steps: string;
  readonly applicabilityScope: ScopeTarget;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateAlgorithmInput {
  readonly id: AlgorithmId;
  readonly organizationId: OrgId;
  readonly title: string;
  readonly steps?: string;
  readonly applicabilityScope?: ScopeTarget;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createAlgorithm(input: CreateAlgorithmInput): Algorithm {
  return Object.freeze({
    kind: 'Algorithm',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId: assertOrgId(input.organizationId),
    entityType: 'Algorithm',
    title: assertNonEmptyText(input.title, 'title'),
    steps: normalizeSteps(input.steps),
    applicabilityScope: input.applicabilityScope
      ? createScopeTarget(input.applicabilityScope)
      : createScopeTarget({ scopeLevel: ScopeLevel.ORGANIZATION }),
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    approvalStatus: input.approvalStatus,
    effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

export function isAlgorithmEditable(
  algorithm: Pick<Algorithm, 'approvalStatus'>,
): boolean {
  return isEditableApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmLocked(
  algorithm: Pick<Algorithm, 'approvalStatus'>,
): boolean {
  return isLockedApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmImmutable(
  algorithm: Pick<Algorithm, 'approvalStatus'>,
): boolean {
  return isImmutableApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmStructurallyComplete(
  algorithm: Pick<Algorithm, 'steps'>,
): boolean {
  return algorithm.steps.trim().length > 0;
}

function normalizeSteps(value: string | undefined): string {
  if (value == null) {
    return '';
  }

  if (typeof value !== 'string') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'steps must be a string.',
      { field: 'steps' },
    );
  }

  return value.trim();
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
