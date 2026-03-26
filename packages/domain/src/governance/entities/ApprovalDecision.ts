import type {
  ApprovalDecisionId,
  ApprovalPolicyId,
  OrgId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { EntityType } from '../../versioning/entities';
import type { ApprovalOutcome } from './ApprovalOutcome';
import { ApprovalOutcome as ApprovalOutcomeValue } from './ApprovalOutcome';
import type { DecisionStatus } from './DecisionStatus';
import { DecisionStatus as DecisionStatusValue } from './DecisionStatus';

export interface ApprovalChangeRequest {
  readonly path: string;
  readonly detail: string;
}

export interface ApprovalDecision {
  readonly id: ApprovalDecisionId;
  readonly organizationId: OrgId;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly versionId: VersionId;
  readonly policyId: ApprovalPolicyId;
  readonly outcome: ApprovalOutcome;
  readonly reviewerId: UserRoleId;
  readonly reviewedAt: Date;
  readonly rationale: string;
  readonly changeRequests: ReadonlyArray<ApprovalChangeRequest>;
  readonly status: DecisionStatus;
  readonly supersededBy: ApprovalDecisionId | null;
}

export interface CreateApprovalDecisionInput {
  readonly id: ApprovalDecisionId;
  readonly organizationId: OrgId;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly versionId: VersionId;
  readonly policyId: ApprovalPolicyId;
  readonly outcome: ApprovalOutcome;
  readonly reviewerId: UserRoleId;
  readonly reviewedAt: Date;
  readonly rationale: string;
  readonly changeRequests?: ReadonlyArray<ApprovalChangeRequest>;
  readonly status?: DecisionStatus;
  readonly supersededBy?: ApprovalDecisionId | null;
}

export function createApprovalDecision(
  input: CreateApprovalDecisionInput,
): ApprovalDecision {
  const status = input.status ?? DecisionStatusValue.SUBMITTED;
  const changeRequests = freezeChangeRequests(input.changeRequests);
  const rationale = assertNonEmptyText(input.rationale, 'ApprovalDecision.rationale');

  if (
    input.outcome === ApprovalOutcomeValue.REQUEST_CHANGES &&
    changeRequests.length === 0
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalDecision.changeRequests are required for RequestChanges outcomes.',
    );
  }

  if (
    input.outcome !== ApprovalOutcomeValue.REQUEST_CHANGES &&
    changeRequests.length > 0
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalDecision.changeRequests are only permitted for RequestChanges.',
    );
  }

  if (
    status === DecisionStatusValue.SUPERSEDED &&
    (input.supersededBy == null || input.supersededBy.trim().length === 0)
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Superseded ApprovalDecision records must reference supersededBy.',
    );
  }

  return Object.freeze({
    id: assertNonEmptyId(input.id, 'ApprovalDecision.id'),
    organizationId: assertOrgId(input.organizationId),
    entityId: assertNonEmptyId(input.entityId, 'ApprovalDecision.entityId'),
    entityType: assertNonEmptyId(input.entityType, 'ApprovalDecision.entityType'),
    versionId: assertNonEmptyId(input.versionId, 'ApprovalDecision.versionId'),
    policyId: assertNonEmptyId(input.policyId, 'ApprovalDecision.policyId'),
    outcome: input.outcome,
    reviewerId: assertNonEmptyId(input.reviewerId, 'ApprovalDecision.reviewerId'),
    reviewedAt: cloneDate(input.reviewedAt, 'ApprovalDecision.reviewedAt'),
    rationale,
    changeRequests,
    status,
    supersededBy:
      input.supersededBy == null
        ? null
        : assertNonEmptyId(input.supersededBy, 'ApprovalDecision.supersededBy'),
  });
}

function freezeChangeRequests(
  changeRequests: ReadonlyArray<ApprovalChangeRequest> | undefined,
): ReadonlyArray<ApprovalChangeRequest> {
  return Object.freeze(
    (changeRequests ?? []).map((changeRequest) =>
      Object.freeze({
        path: assertNonEmptyText(changeRequest.path, 'ApprovalDecision.changeRequests.path'),
        detail: assertNonEmptyText(
          changeRequest.detail,
          'ApprovalDecision.changeRequests.detail',
        ),
      }),
    ),
  );
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'ApprovalDecision.organizationId is required.',
    );
  }

  return value;
}

function assertNonEmptyText(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value.trim();
}

function assertNonEmptyId<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
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
