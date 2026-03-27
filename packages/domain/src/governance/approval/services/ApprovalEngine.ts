import {
  AuditOperation,
  type ApprovalDecisionAuditEvent,
} from '../../../shared/audit';
import { deny, type AllowedPolicyDecision, type DeniedPolicyDecision } from '../../../shared/types';
import type {
  ApprovalDecisionId,
  ApprovalPolicyId,
  OrgId,
  UserId,
  UserRoleId,
  VersionId,
} from '../../../shared/types';
import { validateOrgIdPresent } from '../../../tenant/policies';
import type { EntityType } from '../../../versioning/entities';
import {
  ApprovalOutcome,
  Capability,
  DecisionStatus,
  createApprovalDecision,
  type ApprovalDecision,
  type ApprovalPolicy,
} from '../../entities';
import { evaluateQuorum, type QuorumOutcome } from '../../policies/ApprovalResolutionPolicy';
import { getCapabilityGrantingRoles } from '../../policies/hasCapability';
import { ScopeLevel } from '../../../tenant/entities';

export const ApprovalDecisionValue = {
  APPROVE: 'approve',
  REJECT: 'reject',
  REQUEST_CHANGES: 'request_changes',
  ABSTAIN: 'abstain',
} as const;

export type ApprovalDecisionValue =
  (typeof ApprovalDecisionValue)[keyof typeof ApprovalDecisionValue];

export interface ApprovalActorContext {
  readonly userId: UserId;
  readonly organizationId: OrgId | null | undefined;
  readonly roles: Parameters<typeof getCapabilityGrantingRoles>[0]['roles'];
  readonly permissions: Parameters<typeof getCapabilityGrantingRoles>[0]['permissions'];
}

export interface ApprovalTargetContext {
  readonly organizationId: OrgId;
  readonly entityType: EntityType;
  readonly entityId: string;
  readonly currentVersionId: VersionId;
}

export interface ApprovalDecisionRecord {
  readonly id: ApprovalDecisionId;
  readonly actorId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly organizationId: OrgId;
  readonly targetEntityType: EntityType;
  readonly targetEntityId: string;
  readonly versionId: VersionId;
  readonly decision: ApprovalDecisionValue;
  readonly rationale: string | null;
  readonly auditEventId: string;
}

export interface ApprovalState {
  readonly organizationId: OrgId;
  readonly targetEntityType: EntityType;
  readonly targetEntityId: string;
  readonly currentVersionId: VersionId;
  readonly requiredApprovals: number;
  readonly totalActiveDecisions: number;
  readonly approvalCount: number;
  readonly rejectionCount: number;
  readonly requestChangesCount: number;
  readonly abstainCount: number;
  readonly activeDecisions: ReadonlyArray<ApprovalDecisionRecord>;
  readonly staleDecisions: ReadonlyArray<ApprovalDecisionRecord>;
  readonly quorum: ApprovalQuorumEvaluation;
}

export interface ApprovalQuorumEvaluation {
  readonly reached: boolean;
  readonly outcome: 'approved' | 'rejected' | 'changes_requested' | 'pending';
  readonly requiredApprovals: number;
  readonly approvalCount: number;
  readonly rejectionCount: number;
  readonly requestChangesCount: number;
  readonly abstainCount: number;
}

export interface SubmitApprovalDecisionCommand {
  readonly approvalDecisionId: ApprovalDecisionId;
  readonly auditEventId: string;
  readonly actor: ApprovalActorContext;
  readonly target: ApprovalTargetContext;
  readonly policy: ApprovalPolicy;
  readonly existingDecisions: ReadonlyArray<ApprovalDecisionRecord>;
  readonly decision: ApprovalDecisionValue;
  readonly rationale?: string | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface SubmitApprovalDecisionDeniedResult {
  readonly allowed: false;
  readonly decision: DeniedPolicyDecision;
  readonly approvalRecord?: undefined;
  readonly approvalState?: undefined;
  readonly auditRecord?: undefined;
}

export interface SubmitApprovalDecisionAllowedResult {
  readonly allowed: true;
  readonly decision: AllowedPolicyDecision;
  readonly approvalRecord: ApprovalDecisionRecord;
  readonly approvalState: ApprovalState;
  readonly auditRecord: Omit<ApprovalDecisionAuditEvent, 'timestamp'>;
}

export type SubmitApprovalDecisionResult =
  | SubmitApprovalDecisionDeniedResult
  | SubmitApprovalDecisionAllowedResult;

export interface CollectApprovalStateInput {
  readonly target: ApprovalTargetContext;
  readonly policy: ApprovalPolicy;
  readonly decisions: ReadonlyArray<ApprovalDecisionRecord>;
}

export interface DetectStaleApprovalInput {
  readonly currentVersionId: VersionId;
  readonly decision: Pick<ApprovalDecisionRecord, 'versionId'>;
}

export function submitApprovalDecision(
  command: SubmitApprovalDecisionCommand,
): SubmitApprovalDecisionResult {
  const actorOrganizationId = validateOrgIdPresent(command.actor.organizationId);
  const targetOrganizationId = validateOrgIdPresent(command.target.organizationId);
  const policyOrganizationId = validateOrgIdPresent(command.policy.organizationId);

  if (
    actorOrganizationId !== targetOrganizationId ||
    actorOrganizationId !== policyOrganizationId
  ) {
    return createDeniedResult(
      targetOrganizationId,
      deny('CROSS_TENANT_ACCESS_DENIED', {
        actorOrganizationId,
        targetOrganizationId,
        policyOrganizationId,
      }),
    );
  }

  const grantingRoles = getCapabilityGrantingRoles(
    command.actor,
    Capability.GOVERNANCE_APPROVE,
    targetOrganizationId,
    {
      entityType: command.target.entityType,
      targetScope: command.policy.scopeTargetId
        ? {
            scopeLevel: command.policy.scopeLevel,
            scopeTargetId: command.policy.scopeTargetId,
          }
        : command.policy.scopeLevel === ScopeLevel.ORGANIZATION
          ? {
              scopeLevel: ScopeLevel.ORGANIZATION,
            }
          : null,
    },
  );

  if (grantingRoles.length === 0) {
    return createDeniedResult(
      targetOrganizationId,
      deny('CAPABILITY_NOT_GRANTED', {
        capability: Capability.GOVERNANCE_APPROVE,
        entityType: command.target.entityType,
        entityId: command.target.entityId,
      }),
    );
  }

  const approvalRecord = freezeApprovalDecision({
    id: command.approvalDecisionId,
    actorId: command.actor.userId,
    actorRoleId: grantingRoles[0].id,
    organizationId: targetOrganizationId,
    targetEntityType: command.target.entityType,
    targetEntityId: command.target.entityId,
    versionId: command.target.currentVersionId,
    decision: command.decision,
    rationale: normalizeOptionalText(command.rationale),
    auditEventId: assertNonEmptyValue(command.auditEventId, 'auditEventId'),
  });

  const approvalState = collectApprovalState({
    target: command.target,
    policy: command.policy,
    decisions: Object.freeze([...command.existingDecisions, approvalRecord]),
  });

  return Object.freeze({
    allowed: true,
    decision: Object.freeze({
      allowed: true,
      warnings: Object.freeze([]),
      context: Object.freeze({
        approvalDecisionId: approvalRecord.id,
        outcome: approvalState.quorum.outcome,
        quorumReached: approvalState.quorum.reached,
      }),
    }),
    approvalRecord,
    approvalState,
    auditRecord: createApprovalAuditRecord(
      command,
      approvalRecord,
      grantingRoles[0].id,
      approvalState,
    ),
  });
}

export function collectApprovalState(
  input: CollectApprovalStateInput,
): ApprovalState {
  const organizationId = validateOrgIdPresent(input.target.organizationId);
  const policyOrganizationId = validateOrgIdPresent(input.policy.organizationId);

  if (organizationId !== policyOrganizationId) {
    throw new Error('Approval policy must be scoped to the same organization.');
  }

  const relevantDecisions = input.decisions.filter(
    (decision) =>
      decision.organizationId === organizationId &&
      decision.targetEntityType === input.target.entityType &&
      decision.targetEntityId === input.target.entityId,
  );

  const activeByActor = new Map<UserId, ApprovalDecisionRecord>();
  const staleDecisions: ApprovalDecisionRecord[] = [];

  for (const decision of relevantDecisions) {
    if (detectStaleApproval({ currentVersionId: input.target.currentVersionId, decision })) {
      staleDecisions.push(decision);
      continue;
    }

    activeByActor.set(decision.actorId, decision);
  }

  const activeDecisions = Object.freeze(Array.from(activeByActor.values()));
  const governanceDecisions = activeDecisions.map((record) =>
    mapRecordToGovernanceDecision(record, input.policy.id),
  );

  const quorumOutcome = evaluateQuorum({
    organizationId: input.target.organizationId,
    entityId: input.target.entityId,
    entityType: input.target.entityType,
    currentVersionId: input.target.currentVersionId,
    policy: input.policy,
    decisions: governanceDecisions,
  });

  const quorum = mapGovernanceQuorumToEngineEvaluation(quorumOutcome, input.policy);

  return Object.freeze({
    organizationId,
    targetEntityType: input.target.entityType,
    targetEntityId: input.target.entityId,
    currentVersionId: input.target.currentVersionId,
    requiredApprovals: input.policy.minimumReviewers,
    totalActiveDecisions: activeDecisions.length,
    approvalCount: quorum.approvalCount,
    rejectionCount: quorum.rejectionCount,
    requestChangesCount: quorum.requestChangesCount,
    abstainCount: quorum.abstainCount,
    activeDecisions,
    staleDecisions: Object.freeze(staleDecisions),
    quorum,
  });
}

export function evaluateApprovalQuorum(input: {
  readonly policy: ApprovalPolicy;
  readonly target: ApprovalTargetContext;
  readonly decisions: ReadonlyArray<ApprovalDecisionRecord>;
}): ApprovalQuorumEvaluation {
  return collectApprovalState({
    target: input.target,
    policy: input.policy,
    decisions: input.decisions,
  }).quorum;
}

export function detectStaleApproval(input: DetectStaleApprovalInput): boolean {
  return input.decision.versionId !== input.currentVersionId;
}

function mapRecordToGovernanceDecision(
  record: ApprovalDecisionRecord,
  policyId: ApprovalPolicyId,
): ApprovalDecision {
  const outcome = mapEngineDecisionToOutcome(record.decision);
  const changeRequests =
    outcome === ApprovalOutcome.REQUEST_CHANGES
      ? Object.freeze([
          Object.freeze({
            path: '/',
            detail: 'Change request submitted with the submission record.',
          }),
        ])
      : Object.freeze([]);

  return createApprovalDecision({
    id: record.id,
    organizationId: record.organizationId,
    entityId: record.targetEntityId,
    entityType: record.targetEntityType,
    versionId: record.versionId,
    policyId,
    outcome,
    reviewerId: record.actorRoleId,
    reviewedAt: new Date(0),
    rationale: mapRationaleForGovernance(record.rationale),
    changeRequests,
    status: DecisionStatus.SUBMITTED,
  });
}

function mapRationaleForGovernance(rationale: string | null): string {
  const trimmed = rationale?.trim();
  if (trimmed && trimmed.length > 0) {
    return trimmed;
  }

  return '(submitted)';
}

function mapEngineDecisionToOutcome(decision: ApprovalDecisionValue): ApprovalOutcome {
  switch (decision) {
    case ApprovalDecisionValue.APPROVE:
      return ApprovalOutcome.APPROVED;
    case ApprovalDecisionValue.REJECT:
      return ApprovalOutcome.REJECTED;
    case ApprovalDecisionValue.REQUEST_CHANGES:
      return ApprovalOutcome.REQUEST_CHANGES;
    case ApprovalDecisionValue.ABSTAIN:
      return ApprovalOutcome.ABSTAINED;
  }
}

function mapGovernanceQuorumToEngineEvaluation(
  quorum: QuorumOutcome,
  policy: ApprovalPolicy,
): ApprovalQuorumEvaluation {
  const requiredApprovals = normalizeRequiredApprovals(policy.minimumReviewers);
  if (quorum.resolved && quorum.outcome === 'Approved') {
    return freezeQuorum(
      true,
      'approved',
      requiredApprovals,
      quorum.approvalCount,
      quorum.rejectionCount,
      quorum.requestChangesCount,
      quorum.abstainedCount,
    );
  }

  if (quorum.resolved && quorum.outcome === 'Rejected') {
    return freezeQuorum(
      true,
      'rejected',
      requiredApprovals,
      quorum.approvalCount,
      quorum.rejectionCount,
      quorum.requestChangesCount,
      quorum.abstainedCount,
    );
  }

  if (!quorum.resolved && quorum.requestChangesCount > 0) {
    return freezeQuorum(
      false,
      'changes_requested',
      requiredApprovals,
      quorum.approvalCount,
      quorum.rejectionCount,
      quorum.requestChangesCount,
      quorum.abstainedCount,
    );
  }

  return freezeQuorum(
    false,
    'pending',
    requiredApprovals,
    quorum.approvalCount,
    quorum.rejectionCount,
    quorum.requestChangesCount,
    quorum.abstainedCount,
  );
}

function createDeniedResult(
  organizationId: OrgId,
  decision: DeniedPolicyDecision,
): SubmitApprovalDecisionDeniedResult {
  return Object.freeze({
    allowed: false,
    decision: Object.freeze({
      ...decision,
      context: Object.freeze({
        organizationId,
        ...decision.context,
      }),
    }),
  });
}

function createApprovalAuditRecord(
  command: SubmitApprovalDecisionCommand,
  record: ApprovalDecisionRecord,
  actorRoleId: UserRoleId,
  approvalState: ApprovalState,
): Omit<ApprovalDecisionAuditEvent, 'timestamp'> {
  return Object.freeze({
    id: record.auditEventId,
    eventType: 'approval_decision',
    organizationId: record.organizationId,
    actorUserId: record.actorId,
    actorRoleId,
    operation: mapDecisionToAuditOperation(record.decision),
    targetEntityType: record.targetEntityType,
    targetEntityId: record.targetEntityId,
    approvalDecisionId: record.id,
    versionId: record.versionId,
    decision: record.decision,
    rationale: record.rationale,
    metadata: Object.freeze({
      requiredApprovals: approvalState.requiredApprovals,
      approvalCount: approvalState.approvalCount,
      rejectionCount: approvalState.rejectionCount,
      requestChangesCount: approvalState.requestChangesCount,
      abstainCount: approvalState.abstainCount,
      quorumReached: approvalState.quorum.reached,
      quorumOutcome: approvalState.quorum.outcome,
      ...(command.metadata ?? {}),
    }),
  });
}

function mapDecisionToAuditOperation(
  decision: ApprovalDecisionValue,
): ApprovalDecisionAuditEvent['operation'] {
  switch (decision) {
    case ApprovalDecisionValue.APPROVE:
      return AuditOperation.Approve;
    case ApprovalDecisionValue.REJECT:
      return AuditOperation.Reject;
    case ApprovalDecisionValue.REQUEST_CHANGES:
      return AuditOperation.RequestChanges;
    case ApprovalDecisionValue.ABSTAIN:
      return AuditOperation.Abstain;
  }
}

function freezeApprovalDecision(
  input: ApprovalDecisionRecord,
): ApprovalDecisionRecord {
  return Object.freeze({
    id: assertNonEmptyValue(input.id, 'id'),
    actorId: assertNonEmptyValue(input.actorId, 'actorId'),
    actorRoleId: assertNonEmptyValue(input.actorRoleId, 'actorRoleId'),
    organizationId: validateOrgIdPresent(input.organizationId),
    targetEntityType: assertNonEmptyValue(input.targetEntityType, 'targetEntityType'),
    targetEntityId: assertNonEmptyValue(input.targetEntityId, 'targetEntityId'),
    versionId: assertNonEmptyValue(input.versionId, 'versionId'),
    decision: input.decision,
    rationale: input.rationale ?? null,
    auditEventId: assertNonEmptyValue(input.auditEventId, 'auditEventId'),
  });
}

function freezeQuorum(
  reached: boolean,
  outcome: ApprovalQuorumEvaluation['outcome'],
  requiredApprovals: number,
  approvalCount: number,
  rejectionCount: number,
  requestChangesCount: number,
  abstainCount: number,
): ApprovalQuorumEvaluation {
  return Object.freeze({
    reached,
    outcome,
    requiredApprovals,
    approvalCount,
    rejectionCount,
    requestChangesCount,
    abstainCount,
  });
}

function normalizeRequiredApprovals(value: number): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error('requiredApprovals must be an integer greater than or equal to 1.');
  }

  return value;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function assertNonEmptyValue<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  return value;
}
