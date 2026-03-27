import type {
  AlgorithmId,
  OrgId,
  ProtocolId,
  MedicationId,
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
import { createScopeTarget, type ScopeTarget } from './ScopeTarget';

export interface ProtocolReference {
  readonly entityId: AlgorithmId | MedicationId;
  readonly entityType: 'Algorithm' | 'Medication';
  readonly organizationId: OrgId;
}

export interface Protocol {
  readonly kind: 'Protocol';
  readonly id: ProtocolId;
  readonly organizationId: OrgId;
  readonly entityType: 'Protocol';
  readonly title: string;
  readonly procedureCategory: string | null;
  readonly regulatoryBasis: string | null;
  readonly applicabilityScope: ScopeTarget | null;
  readonly requiredEquipment: ReadonlyArray<string>;
  readonly references: ReadonlyArray<ProtocolReference>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateProtocolInput {
  readonly id: ProtocolId;
  readonly organizationId: OrgId;
  readonly title: string;
  readonly procedureCategory?: string | null;
  readonly regulatoryBasis?: string | null;
  readonly applicabilityScope?: ScopeTarget | null;
  readonly requiredEquipment?: ReadonlyArray<string>;
  readonly references?: ReadonlyArray<ProtocolReference>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createProtocol(input: CreateProtocolInput): Protocol {
  const organizationId = assertOrgId(input.organizationId);

  return Object.freeze({
    kind: 'Protocol',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId,
    entityType: 'Protocol',
    title: assertNonEmptyText(input.title, 'title'),
    procedureCategory: normalizeOptionalText(
      input.procedureCategory,
      'procedureCategory',
    ),
    regulatoryBasis: normalizeOptionalText(
      input.regulatoryBasis,
      'regulatoryBasis',
    ),
    applicabilityScope: input.applicabilityScope
      ? createScopeTarget(input.applicabilityScope)
      : null,
    requiredEquipment: freezeTextArray(input.requiredEquipment, 'requiredEquipment'),
    references: freezeReferences(input.references, organizationId),
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    approvalStatus: input.approvalStatus,
    effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

export function isProtocolEditable(protocol: Pick<Protocol, 'approvalStatus'>): boolean {
  return isEditableApprovalStatus(protocol.approvalStatus);
}

export function isProtocolLocked(protocol: Pick<Protocol, 'approvalStatus'>): boolean {
  return isLockedApprovalStatus(protocol.approvalStatus);
}

export function isProtocolImmutable(protocol: Pick<Protocol, 'approvalStatus'>): boolean {
  return isImmutableApprovalStatus(protocol.approvalStatus);
}

export function isProtocolStructurallyComplete(
  protocol: Pick<Protocol, 'regulatoryBasis'>,
): boolean {
  return protocol.regulatoryBasis != null && protocol.regulatoryBasis.trim().length > 0;
}

function freezeReferences(
  references: ReadonlyArray<ProtocolReference> | undefined,
  organizationId: OrgId,
): ReadonlyArray<ProtocolReference> {
  return Object.freeze(
    (references ?? []).map((reference) => {
      if (reference.organizationId !== organizationId) {
        throw new DomainError(
          'CROSS_TENANT_ACCESS_DENIED',
          'Protocol references must stay within the same organization.',
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
