import type {
  GuidelineId,
  OrgId,
  ProtocolId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';

import {
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isLockedApprovalStatus,
  type ApprovalStatus,
} from './ApprovalStatus';
import type { ContentAuditTrailEntry } from './Algorithm';
import { createScopeTarget, type ScopeTarget } from './ScopeTarget';

export interface GuidelineReference {
  readonly entityId: ProtocolId;
  readonly entityType: 'Protocol';
  readonly organizationId: OrgId;
}

export interface Guideline {
  readonly kind: 'Guideline';
  readonly id: GuidelineId;
  readonly organizationId: OrgId;
  readonly entityType: 'Guideline';
  readonly title: string;
  readonly guidelineCategory: string | null;
  readonly evidenceBasis: string | null;
  readonly advisory: boolean;
  readonly applicabilityScope: ScopeTarget | null;
  readonly references: ReadonlyArray<GuidelineReference>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateGuidelineInput {
  readonly id: GuidelineId;
  readonly organizationId: OrgId;
  readonly title: string;
  readonly guidelineCategory?: string | null;
  readonly evidenceBasis?: string | null;
  readonly advisory: boolean;
  readonly applicabilityScope?: ScopeTarget | null;
  readonly references?: ReadonlyArray<GuidelineReference>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createGuideline(input: CreateGuidelineInput): Guideline {
  const organizationId = assertOrgId(input.organizationId);

  return Object.freeze({
    kind: 'Guideline',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId,
    entityType: 'Guideline',
    title: assertNonEmptyText(input.title, 'title'),
    guidelineCategory: normalizeOptionalText(
      input.guidelineCategory,
      'guidelineCategory',
    ),
    evidenceBasis: normalizeOptionalText(input.evidenceBasis, 'evidenceBasis'),
    advisory: Boolean(input.advisory),
    applicabilityScope: input.applicabilityScope
      ? createScopeTarget(input.applicabilityScope)
      : null,
    references: freezeReferences(input.references, organizationId),
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    approvalStatus: input.approvalStatus,
    effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

export function isGuidelineEditable(
  guideline: Pick<Guideline, 'approvalStatus'>,
): boolean {
  return isEditableApprovalStatus(guideline.approvalStatus);
}

export function isGuidelineLocked(
  guideline: Pick<Guideline, 'approvalStatus'>,
): boolean {
  return isLockedApprovalStatus(guideline.approvalStatus);
}

export function isGuidelineImmutable(
  guideline: Pick<Guideline, 'approvalStatus'>,
): boolean {
  return isImmutableApprovalStatus(guideline.approvalStatus);
}

export function isGuidelineStructurallyComplete(
  guideline: Pick<Guideline, 'evidenceBasis'>,
): boolean {
  return guideline.evidenceBasis != null && guideline.evidenceBasis.trim().length > 0;
}

function freezeReferences(
  references: ReadonlyArray<GuidelineReference> | undefined,
  organizationId: OrgId,
): ReadonlyArray<GuidelineReference> {
  return Object.freeze(
    (references ?? []).map((reference) => {
      if (reference.organizationId !== organizationId) {
        throw new DomainError(
          'CROSS_TENANT_ACCESS_DENIED',
          'Guideline references must stay within the same organization.',
        );
      }

      return Object.freeze({
        entityId: assertNonEmptyId(reference.entityId, 'references.entityId'),
        entityType: reference.entityType,
        organizationId: assertOrgId(reference.organizationId),
      });
    }),
  );
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

  if (versionId.toLowerCase() === 'latest') {
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
