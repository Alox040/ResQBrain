import type { OrgId, UserId } from '../../shared/types';
import { allow, DenyReason, deny, type PolicyDecision } from '../../shared/types';

import {
  ApprovalStatus,
  canTransitionApprovalStatus,
  type ApprovalStatus as ApprovalStatusValue,
  isImmutableApprovalStatus,
  isTerminalApprovalStatus,
} from '../entities/ApprovalStatus';
import type {
  LifecycleAggregateKind,
  LifecycleState,
} from '../entities/ContentLifecycle';

export const LIFECYCLE_TRANSITION_OPERATIONS = Object.freeze([
  'submit',
  'approve',
  'reject',
  'release',
  'recall',
  'deprecate',
] as const);

export type LifecycleTransitionOperation =
  (typeof LIFECYCLE_TRANSITION_OPERATIONS)[number];

export type LifecycleReleaseChannel = 'direct' | 'content-package';

export interface LifecycleTransitionRule {
  readonly aggregate: LifecycleAggregateKind;
  readonly operation: LifecycleTransitionOperation;
  readonly from: ApprovalStatusValue;
  readonly to: ApprovalStatusValue;
  readonly releaseChannel?: LifecycleReleaseChannel;
  readonly requiresOrganizationActive: boolean;
  readonly requiresStructuralCompleteness: boolean;
  readonly requiresNoDeprecatedReferences: boolean;
  readonly requiresResolvedQuorum: boolean;
  readonly requiresRationale: boolean;
  readonly requiresDeprecationDate: boolean;
}

export type TransitionPolicyRule = LifecycleTransitionRule;

function freezeRule(
  rule: LifecycleTransitionRule,
): Readonly<LifecycleTransitionRule> {
  return Object.freeze({ ...rule });
}

export const TRANSITION_POLICY_RULES: readonly Readonly<LifecycleTransitionRule>[] =
  Object.freeze([
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'submit',
      from: ApprovalStatus.Draft,
      to: ApprovalStatus.InReview,
      requiresOrganizationActive: true,
      requiresStructuralCompleteness: true,
      requiresNoDeprecatedReferences: true,
      requiresResolvedQuorum: false,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'approve',
      from: ApprovalStatus.InReview,
      to: ApprovalStatus.Approved,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: true,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'reject',
      from: ApprovalStatus.InReview,
      to: ApprovalStatus.Rejected,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: true,
      requiresRationale: true,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'release',
      from: ApprovalStatus.Approved,
      to: ApprovalStatus.Released,
      releaseChannel: 'content-package',
      requiresOrganizationActive: true,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'recall',
      from: ApprovalStatus.Approved,
      to: ApprovalStatus.InReview,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: true,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentEntity',
      operation: 'deprecate',
      from: ApprovalStatus.Released,
      to: ApprovalStatus.Deprecated,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: true,
      requiresDeprecationDate: true,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'submit',
      from: ApprovalStatus.Draft,
      to: ApprovalStatus.InReview,
      requiresOrganizationActive: true,
      requiresStructuralCompleteness: true,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'approve',
      from: ApprovalStatus.InReview,
      to: ApprovalStatus.Approved,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: true,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'reject',
      from: ApprovalStatus.InReview,
      to: ApprovalStatus.Rejected,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: true,
      requiresRationale: true,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'release',
      from: ApprovalStatus.Approved,
      to: ApprovalStatus.Released,
      releaseChannel: 'direct',
      requiresOrganizationActive: true,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: false,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'recall',
      from: ApprovalStatus.Approved,
      to: ApprovalStatus.InReview,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: true,
      requiresDeprecationDate: false,
    }),
    freezeRule({
      aggregate: 'ContentPackage',
      operation: 'deprecate',
      from: ApprovalStatus.Released,
      to: ApprovalStatus.Deprecated,
      requiresOrganizationActive: false,
      requiresStructuralCompleteness: false,
      requiresNoDeprecatedReferences: false,
      requiresResolvedQuorum: false,
      requiresRationale: true,
      requiresDeprecationDate: true,
    }),
  ]);

export function getTransitionPolicyRule(
  aggregate: LifecycleAggregateKind,
  from: ApprovalStatusValue,
  to: ApprovalStatusValue,
): TransitionPolicyRule | null {
  return (
    TRANSITION_POLICY_RULES.find(
      (rule) =>
        rule.aggregate === aggregate && rule.from === from && rule.to === to,
    ) ?? null
  );
}

export interface StructuralTransitionContext {
  readonly state: LifecycleState;
  readonly operation: LifecycleTransitionOperation;
  readonly targetStatus: ApprovalStatusValue;
  readonly organizationId: OrgId | null | undefined;
  readonly organizationIsActive?: boolean;
  readonly structuralCompletenessSatisfied?: boolean;
  readonly hasDeprecatedReferences?: boolean;
  readonly quorumResolved?: boolean;
  readonly rationale?: string | null;
  readonly deprecationDate?: Date | string | null;
  readonly deprecationReason?: string | null;
  readonly viaContentPackageRelease?: boolean;
  readonly alreadyReleasedInPackage?: boolean;
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function evaluateLifecycleTransition(
  context: StructuralTransitionContext,
): PolicyDecision {
  if (!context.organizationId) {
    return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT);
  }

  if (context.organizationId !== context.state.organizationId) {
    return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
      aggregate: context.state.aggregate,
    });
  }

  if (isTerminalApprovalStatus(context.state.approvalStatus)) {
    return deny(DenyReason.VERSION_TERMINAL, {
      from: context.state.approvalStatus,
      to: context.targetStatus,
    });
  }

  if (
    isImmutableApprovalStatus(context.state.approvalStatus) &&
    !(
      context.state.approvalStatus === ApprovalStatus.Released &&
      context.targetStatus === ApprovalStatus.Deprecated &&
      context.operation === 'deprecate'
    )
  ) {
    return deny(DenyReason.ENTITY_IMMUTABLE, {
      from: context.state.approvalStatus,
      to: context.targetStatus,
    });
  }

  if (
    !canTransitionApprovalStatus(context.state.approvalStatus, context.targetStatus)
  ) {
    return deny(DenyReason.TRANSITION_NOT_PERMITTED, {
      from: context.state.approvalStatus,
      to: context.targetStatus,
    });
  }

  const rule = TRANSITION_POLICY_RULES.find(
    (candidate) =>
      candidate.aggregate === context.state.aggregate &&
      candidate.operation === context.operation &&
      candidate.from === context.state.approvalStatus &&
      candidate.to === context.targetStatus,
  );

  if (context.alreadyReleasedInPackage && context.operation === 'recall') {
    return deny(DenyReason.ENTITY_ALREADY_RELEASED, {
      currentVersionId: context.state.currentVersionId,
    });
  }

  if (!rule) {
    return deny(DenyReason.TRANSITION_NOT_PERMITTED, {
      aggregate: context.state.aggregate,
      operation: context.operation,
      from: context.state.approvalStatus,
      to: context.targetStatus,
    });
  }

  if (rule.requiresOrganizationActive && context.organizationIsActive === false) {
    return deny(DenyReason.ORGANIZATION_NOT_ACTIVE);
  }

  if (
    rule.requiresStructuralCompleteness &&
    context.structuralCompletenessSatisfied === false
  ) {
    return deny(DenyReason.CONTENT_STRUCTURALLY_INCOMPLETE);
  }

  if (rule.requiresNoDeprecatedReferences && context.hasDeprecatedReferences) {
    return deny(DenyReason.DEPRECATED_REFERENCE_IN_SUBMISSION);
  }

  if (rule.requiresResolvedQuorum && context.quorumResolved !== true) {
    return deny(DenyReason.QUORUM_NOT_RESOLVED);
  }

  if (
    rule.releaseChannel === 'content-package' &&
    context.viaContentPackageRelease !== true
  ) {
    return deny(DenyReason.TRANSITION_NOT_PERMITTED, {
      releaseChannel: 'content-package',
    });
  }

  if (rule.requiresRationale && !hasText(context.rationale)) {
    return deny(DenyReason.RATIONALE_REQUIRED);
  }

  if (rule.requiresDeprecationDate && !context.deprecationDate) {
    return deny(DenyReason.DEPRECATION_DATE_REQUIRED);
  }

  if (
    rule.operation === 'deprecate' &&
    !hasText(context.deprecationReason ?? context.rationale)
  ) {
    return deny(DenyReason.RATIONALE_REQUIRED);
  }

  return allow({
    context: {
      aggregate: rule.aggregate,
      operation: rule.operation,
      from: rule.from,
      to: rule.to,
    },
  });
}

export interface TransitionActor {
  readonly organizationId: OrgId;
  readonly userId?: UserId;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

/**
 * Structural lifecycle + org-scope result only. Role and capability checks are
 * caller / governance responsibility — not represented here.
 */
export interface TransitionPolicyEvaluation {
  readonly allowed: boolean;
  readonly rule: TransitionPolicyRule | null;
  readonly sameOrganization: boolean;
  readonly lifecycleAllowsTransition: boolean;
  readonly decision: PolicyDecision;
}

/** Optional inputs for structural lifecycle checks when composing governance + lifecycle. */
export type TransitionPolicyLifecycleInput = Partial<
  Pick<
    StructuralTransitionContext,
    | 'organizationIsActive'
    | 'structuralCompletenessSatisfied'
    | 'hasDeprecatedReferences'
    | 'quorumResolved'
    | 'rationale'
    | 'deprecationDate'
    | 'deprecationReason'
    | 'viaContentPackageRelease'
    | 'alreadyReleasedInPackage'
  >
>;

/**
 * Bridges actor org-scope with {@link evaluateLifecycleTransition}. Does not invent
 * satisfied preconditions: omitted lifecycle fields are left unset so rule-required
 * checks fail unless the caller supplies them via `lifecycleInput`.
 */
export function evaluateTransitionPolicy(
  state: LifecycleState,
  nextStatus: ApprovalStatusValue,
  actor: TransitionActor,
  lifecycleInput?: TransitionPolicyLifecycleInput,
): TransitionPolicyEvaluation {
  const rule = getTransitionPolicyRule(
    state.aggregate,
    state.approvalStatus,
    nextStatus,
  );
  const sameOrganization = actor.organizationId === state.organizationId;
  const decision =
    rule === null
      ? deny(DenyReason.TRANSITION_NOT_PERMITTED, {
          aggregate: state.aggregate,
          from: state.approvalStatus,
          to: nextStatus,
        })
      : evaluateLifecycleTransition({
          state,
          operation: rule.operation,
          targetStatus: nextStatus,
          organizationId: actor.organizationId,
          organizationIsActive: lifecycleInput?.organizationIsActive,
          structuralCompletenessSatisfied: lifecycleInput?.structuralCompletenessSatisfied,
          hasDeprecatedReferences: lifecycleInput?.hasDeprecatedReferences,
          quorumResolved: lifecycleInput?.quorumResolved,
          rationale: lifecycleInput?.rationale,
          deprecationDate: lifecycleInput?.deprecationDate,
          deprecationReason: lifecycleInput?.deprecationReason,
          viaContentPackageRelease: lifecycleInput?.viaContentPackageRelease,
          alreadyReleasedInPackage: lifecycleInput?.alreadyReleasedInPackage ?? false,
        });

  const lifecycleAllowsTransition = decision.allowed;

  return {
    allowed: sameOrganization && lifecycleAllowsTransition,
    rule,
    sameOrganization,
    lifecycleAllowsTransition,
    decision,
  };
}
