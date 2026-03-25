import type {
  MedicationId,
  OrgId,
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

export interface MedicationDosageGuideline {
  readonly route: string;
  readonly doseRange: string;
  readonly weightBased: boolean;
}

export interface Medication {
  readonly kind: 'Medication';
  readonly id: MedicationId;
  readonly organizationId: OrgId;
  readonly entityType: 'Medication';
  readonly title: string;
  readonly genericName: string;
  readonly brandNames: ReadonlyArray<string>;
  readonly dosageGuidelines: ReadonlyArray<MedicationDosageGuideline>;
  readonly contraindicationsRef: string | null;
  readonly storageRequirements: string | null;
  readonly formularyScope: ScopeTarget | null;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateMedicationInput {
  readonly id: MedicationId;
  readonly organizationId: OrgId;
  readonly title: string;
  readonly genericName: string;
  readonly brandNames?: ReadonlyArray<string>;
  readonly dosageGuidelines?: ReadonlyArray<MedicationDosageGuideline>;
  readonly contraindicationsRef?: string | null;
  readonly storageRequirements?: string | null;
  readonly formularyScope?: ScopeTarget | null;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createMedication(input: CreateMedicationInput): Medication {
  return Object.freeze({
    kind: 'Medication',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId: assertOrgId(input.organizationId),
    entityType: 'Medication',
    title: assertNonEmptyText(input.title, 'title'),
    genericName: assertNonEmptyText(input.genericName, 'genericName'),
    brandNames: freezeTextArray(input.brandNames, 'brandNames'),
    dosageGuidelines: freezeDosageGuidelines(input.dosageGuidelines),
    contraindicationsRef: normalizeOptionalText(
      input.contraindicationsRef,
      'contraindicationsRef',
    ),
    storageRequirements: normalizeOptionalText(
      input.storageRequirements,
      'storageRequirements',
    ),
    formularyScope: input.formularyScope
      ? createScopeTarget(input.formularyScope)
      : null,
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    approvalStatus: input.approvalStatus,
    effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

export function isMedicationEditable(
  medication: Pick<Medication, 'approvalStatus'>,
): boolean {
  return isEditableApprovalStatus(medication.approvalStatus);
}

export function isMedicationLocked(
  medication: Pick<Medication, 'approvalStatus'>,
): boolean {
  return isLockedApprovalStatus(medication.approvalStatus);
}

export function isMedicationImmutable(
  medication: Pick<Medication, 'approvalStatus'>,
): boolean {
  return isImmutableApprovalStatus(medication.approvalStatus);
}

export function isMedicationStructurallyComplete(
  medication: Pick<Medication, 'dosageGuidelines'>,
): boolean {
  return medication.dosageGuidelines.some(
    (guideline) =>
      guideline.route.trim().length > 0 && guideline.doseRange.trim().length > 0,
  );
}

function freezeDosageGuidelines(
  guidelines: ReadonlyArray<MedicationDosageGuideline> | undefined,
): ReadonlyArray<MedicationDosageGuideline> {
  return Object.freeze(
    (guidelines ?? []).map((guideline) =>
      Object.freeze({
        route: assertNonEmptyText(guideline.route, 'dosageGuidelines.route'),
        doseRange: assertNonEmptyText(
          guideline.doseRange,
          'dosageGuidelines.doseRange',
        ),
        weightBased: Boolean(guideline.weightBased),
      }),
    ),
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
