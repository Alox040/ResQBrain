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
import type { ContentEntityType } from '../../versioning/entities';

import {
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isLockedApprovalStatus,
  type ApprovalStatus,
} from './ApprovalStatus';

export interface ContentAuditTrailEntry {
  readonly recordedAt: Date;
  readonly actorRoleId: UserRoleId;
  readonly operation: string;
  readonly rationale: string;
}

export interface AlgorithmReference<TEntityType extends ContentEntityType> {
  readonly entityId:
    | AlgorithmId
    | MedicationId
    | ProtocolId
    | GuidelineId;
  readonly entityType: TEntityType;
  readonly organizationId: OrgId;
}

export interface AlgorithmDecisionNode {
  readonly id: string;
  readonly label: string;
  readonly terminal: boolean;
  readonly nextNodeIds: ReadonlyArray<string>;
  readonly medicationReferences: ReadonlyArray<
    AlgorithmReference<'Medication'>
  >;
}

export interface Algorithm {
  readonly kind: 'Algorithm';
  readonly id: AlgorithmId;
  readonly organizationId: OrgId;
  readonly entityType: 'Algorithm';
  readonly title: string;
  readonly category: string | null;
  readonly targetAudience: ReadonlyArray<string>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly decisionLogic: ReadonlyArray<AlgorithmDecisionNode>;
  readonly prerequisites: ReadonlyArray<AlgorithmReference<ContentEntityType>>;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}

export interface CreateAlgorithmInput {
  readonly id: AlgorithmId;
  readonly organizationId: OrgId;
  readonly title: string;
  readonly category?: string | null;
  readonly targetAudience?: ReadonlyArray<string>;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly decisionLogic?: ReadonlyArray<AlgorithmDecisionNode>;
  readonly prerequisites?: ReadonlyArray<AlgorithmReference<ContentEntityType>>;
  readonly auditTrail?: ReadonlyArray<ContentAuditTrailEntry>;
}

export function createAlgorithm(input: CreateAlgorithmInput): Algorithm {
  const organizationId = assertOrgId(input.organizationId);

  return Object.freeze({
    kind: 'Algorithm',
    id: assertNonEmptyId(input.id, 'id'),
    organizationId,
    entityType: 'Algorithm',
    title: assertNonEmptyText(input.title, 'title'),
    category: normalizeOptionalText(input.category, 'category'),
    targetAudience: freezeTextArray(input.targetAudience, 'targetAudience'),
    currentVersionId: assertExplicitVersionId(input.currentVersionId),
    approvalStatus: input.approvalStatus,
    effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
    ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
    decisionLogic: freezeDecisionLogic(input.decisionLogic, organizationId),
    prerequisites: freezeReferences(
      input.prerequisites,
      organizationId,
      'prerequisites',
    ),
    auditTrail: freezeAuditTrail(input.auditTrail),
  });
}

export function isAlgorithmEditable(algorithm: Pick<Algorithm, 'approvalStatus'>): boolean {
  return isEditableApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmLocked(algorithm: Pick<Algorithm, 'approvalStatus'>): boolean {
  return isLockedApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmImmutable(
  algorithm: Pick<Algorithm, 'approvalStatus'>,
): boolean {
  return isImmutableApprovalStatus(algorithm.approvalStatus);
}

export function isAlgorithmStructurallyComplete(algorithm: Pick<Algorithm, 'decisionLogic'>): boolean {
  if (algorithm.decisionLogic.length === 0) {
    return false;
  }

  const nodeIds = new Set<string>();
  let hasTerminalNode = false;

  for (const node of algorithm.decisionLogic) {
    if (node.id.trim().length === 0 || nodeIds.has(node.id)) {
      return false;
    }

    nodeIds.add(node.id);

    if (node.terminal) {
      hasTerminalNode = true;

      if (node.nextNodeIds.length > 0) {
        return false;
      }

      continue;
    }

    if (node.nextNodeIds.length === 0) {
      return false;
    }
  }

  if (!hasTerminalNode) {
    return false;
  }

  for (const node of algorithm.decisionLogic) {
    for (const nextNodeId of node.nextNodeIds) {
      if (!nodeIds.has(nextNodeId)) {
        return false;
      }
    }
  }

  return true;
}

function freezeDecisionLogic(
  nodes: ReadonlyArray<AlgorithmDecisionNode> | undefined,
  organizationId: OrgId,
): ReadonlyArray<AlgorithmDecisionNode> {
  return Object.freeze(
    (nodes ?? []).map((node) =>
      Object.freeze({
        id: assertNonEmptyText(node.id, 'decisionLogic.id'),
        label: assertNonEmptyText(node.label, 'decisionLogic.label'),
        terminal: Boolean(node.terminal),
        nextNodeIds: freezeTextArray(node.nextNodeIds, 'decisionLogic.nextNodeIds'),
        medicationReferences: freezeReferences(
          node.medicationReferences,
          organizationId,
          'decisionLogic.medicationReferences',
        ) as ReadonlyArray<AlgorithmReference<'Medication'>>,
      }),
    ),
  );
}

function freezeReferences<TEntityType extends ContentEntityType>(
  references: ReadonlyArray<AlgorithmReference<TEntityType>> | undefined,
  organizationId: OrgId,
  field: string,
): ReadonlyArray<AlgorithmReference<TEntityType>> {
  return Object.freeze(
    (references ?? []).map((reference) => {
      if (reference.organizationId !== organizationId) {
        throw new DomainError(
          'CROSS_TENANT_ACCESS_DENIED',
          `${field} must stay within the same organization.`,
        );
      }

      return Object.freeze({
        entityId: assertNonEmptyId(reference.entityId, `${field}.entityId`),
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
