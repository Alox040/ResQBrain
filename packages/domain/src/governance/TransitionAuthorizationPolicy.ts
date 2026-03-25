import {
  evaluateTransitionPolicy,
  type ApprovalStatus,
  type LifecycleState,
  type TransitionActor,
  type TransitionPolicyEvaluation,
} from '../lifecycle';

export interface TransitionAuthorizationRequest {
  readonly state: LifecycleState;
  readonly nextStatus: ApprovalStatus;
  readonly actor: TransitionActor;
}

export type TransitionAuthorizationDenyReason =
  | 'no-policy-rule-defined'
  | 'cross-tenant-transition-forbidden'
  | 'lifecycle-state-does-not-allow-transition';

export interface TransitionAuthorizationDecision {
  readonly allowed: boolean;
  readonly evaluation: TransitionPolicyEvaluation;
  readonly denyReason?: TransitionAuthorizationDenyReason;
}

function deriveTransitionAuthorizationDenyReason(
  evaluation: TransitionPolicyEvaluation,
): TransitionAuthorizationDenyReason | undefined {
  if (evaluation.rule === null) {
    return 'no-policy-rule-defined';
  }

  if (!evaluation.sameOrganization) {
    return 'cross-tenant-transition-forbidden';
  }

  if (!evaluation.lifecycleAllowsTransition) {
    return 'lifecycle-state-does-not-allow-transition';
  }

  return undefined;
}

export function authorizeTransition(
  request: TransitionAuthorizationRequest,
): TransitionAuthorizationDecision {
  const evaluation = evaluateTransitionPolicy(
    request.state,
    request.nextStatus,
    request.actor,
  );

  return {
    allowed: evaluation.allowed,
    evaluation,
    denyReason: deriveTransitionAuthorizationDenyReason(evaluation),
  };
}
