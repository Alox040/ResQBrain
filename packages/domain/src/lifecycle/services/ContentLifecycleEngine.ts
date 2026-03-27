import {
  AuditOperation,
  type LifecycleAuditEvent,
} from '../../shared/audit';
import { deny, type AllowedPolicyDecision, type DeniedPolicyDecision } from '../../shared/types';
import type { OrgId, UserId, UserRoleId } from '../../shared/types';
import type { ApprovalStatus } from '../entities/ApprovalStatus';
import type { LifecycleState } from '../entities/ContentLifecycle';
import {
  evaluateTransitionPolicy,
  type TransitionPolicyEvaluation,
  type TransitionPolicyLifecycleInput,
  type TransitionPolicyRule,
} from '../policies/TransitionPolicy';

export interface LifecycleEngineActor {
  readonly organizationId: OrgId | null | undefined;
  readonly userId: UserId;
  readonly roleId: UserRoleId;
}

export interface LifecycleTransitionCommand extends TransitionPolicyLifecycleInput {
  readonly state: LifecycleState;
  readonly targetStatus: ApprovalStatus;
  readonly actor: LifecycleEngineActor;
  readonly auditEventId: string;
  readonly rationale?: string | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LifecycleTransitionDeniedResult {
  readonly allowed: false;
  readonly state: LifecycleState;
  readonly nextState?: undefined;
  readonly rule: TransitionPolicyRule | null;
  readonly decision: DeniedPolicyDecision;
  readonly auditRecord?: undefined;
}

export interface LifecycleTransitionAllowedResult {
  readonly allowed: true;
  readonly state: LifecycleState;
  readonly nextState: LifecycleState;
  readonly rule: TransitionPolicyRule;
  readonly decision: AllowedPolicyDecision;
  readonly auditRecord: Omit<LifecycleAuditEvent, 'timestamp'>;
}

export type LifecycleTransitionResult =
  | LifecycleTransitionDeniedResult
  | LifecycleTransitionAllowedResult;

export function transitionLifecycle(
  command: LifecycleTransitionCommand,
): LifecycleTransitionResult {
  const evaluation = evaluateTransition(command);

  if (evaluation.rule?.operation === 'release') {
    return createDeniedResult(
      command.state,
      evaluation.rule,
      deny('TRANSITION_NOT_PERMITTED', {
        aggregate: command.state.aggregate,
        operation: evaluation.rule.operation,
        from: command.state.approvalStatus,
        to: command.targetStatus,
        reason: 'RELEASE_EXECUTION_NOT_IMPLEMENTED_IN_LIFECYCLE_ENGINE',
      }),
    );
  }

  if (!evaluation.decision.allowed || evaluation.rule === null) {
    return createDeniedResult(
      command.state,
      evaluation.rule,
      evaluation.decision as DeniedPolicyDecision,
    );
  }

  const nextState = freezeNextState(command.state, command.targetStatus);

  return Object.freeze({
    allowed: true,
    state: command.state,
    nextState,
    rule: evaluation.rule,
    decision: evaluation.decision,
    auditRecord: createLifecycleAuditRecord(command, evaluation.rule, nextState),
  });
}

function evaluateTransition(
  command: LifecycleTransitionCommand,
): TransitionPolicyEvaluation {
  return evaluateTransitionPolicy(
    command.state,
    command.targetStatus,
    {
      organizationId: command.actor.organizationId as OrgId,
      userId: command.actor.userId,
    },
    {
      organizationIsActive: command.organizationIsActive,
      structuralCompletenessSatisfied: command.structuralCompletenessSatisfied,
      hasDeprecatedReferences: command.hasDeprecatedReferences,
      quorumResolved: command.quorumResolved,
      rationale: command.rationale,
      deprecationDate: command.deprecationDate,
      deprecationReason: command.deprecationReason,
      viaContentPackageRelease: command.viaContentPackageRelease,
      alreadyReleasedInPackage: command.alreadyReleasedInPackage,
    },
  );
}

function createDeniedResult(
  state: LifecycleState,
  rule: TransitionPolicyRule | null,
  decision: DeniedPolicyDecision,
): LifecycleTransitionDeniedResult {
  return Object.freeze({
    allowed: false,
    state,
    rule,
    decision,
  });
}

function freezeNextState(
  state: LifecycleState,
  targetStatus: ApprovalStatus,
): LifecycleState {
  return Object.freeze({
    ...state,
    approvalStatus: targetStatus,
  }) as LifecycleState;
}

function createLifecycleAuditRecord(
  command: LifecycleTransitionCommand,
  rule: TransitionPolicyRule,
  nextState: LifecycleState,
): Omit<LifecycleAuditEvent, 'timestamp'> {
  return Object.freeze({
    id: command.auditEventId,
    eventType: 'lifecycle',
    organizationId: command.state.organizationId,
    actorUserId: command.actor.userId,
    actorRoleId: command.actor.roleId,
    operation: mapAuditOperation(rule.operation),
    targetEntityType: resolveAuditTargetEntityType(command.state),
    targetEntityId: resolveTargetEntityId(command.state),
    versionId: nextState.currentVersionId,
    fromState: command.state.approvalStatus,
    toState: nextState.approvalStatus,
    beforeState: command.state.approvalStatus,
    afterState: nextState.approvalStatus,
    capability: resolveCapability(rule),
    rationale: normalizeRationale(command.rationale),
    metadata: freezeMetadata(command, rule),
  });
}

function mapAuditOperation(operation: TransitionPolicyRule['operation']) {
  switch (operation) {
    case 'submit':
      return AuditOperation.Submit;
    case 'approve':
      return AuditOperation.Approve;
    case 'reject':
      return AuditOperation.Reject;
    case 'release':
      return AuditOperation.Release;
    case 'recall':
      return AuditOperation.Recall;
    case 'deprecate':
      return AuditOperation.Deprecate;
  }
}

function resolveAuditTargetEntityType(
  state: LifecycleState,
): LifecycleAuditEvent['targetEntityType'] {
  if (state.aggregate === 'ContentPackage') {
    return 'ContentPackage';
  }

  return state.entityType;
}

function resolveTargetEntityId(state: LifecycleState): string {
  if (state.aggregate === 'ContentPackage') {
    return state.contentPackageId;
  }

  return state.entityId;
}

function resolveCapability(rule: TransitionPolicyRule): string {
  const prefix = rule.aggregate === 'ContentPackage' ? 'package' : 'content';

  return `${prefix}.${rule.operation}`;
}

function normalizeRationale(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function freezeMetadata(
  command: LifecycleTransitionCommand,
  rule: TransitionPolicyRule,
): Readonly<Record<string, unknown>> {
  const metadata: Record<string, unknown> = {
    aggregate: command.state.aggregate,
    ruleAggregate: rule.aggregate,
    releaseChannel: rule.releaseChannel ?? null,
    organizationIsActive: command.organizationIsActive ?? null,
    structuralCompletenessSatisfied:
      command.structuralCompletenessSatisfied ?? null,
    hasDeprecatedReferences: command.hasDeprecatedReferences ?? null,
    quorumResolved: command.quorumResolved ?? null,
    deprecationDate: command.deprecationDate ?? null,
    deprecationReason: command.deprecationReason ?? null,
    viaContentPackageRelease: command.viaContentPackageRelease ?? null,
    alreadyReleasedInPackage: command.alreadyReleasedInPackage ?? null,
  };

  if (command.metadata) {
    Object.assign(metadata, command.metadata);
  }

  return Object.freeze(metadata);
}
