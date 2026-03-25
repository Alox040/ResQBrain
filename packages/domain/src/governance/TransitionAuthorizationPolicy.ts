import type { ApprovalStatus } from '../common/ApprovalStatus';
import type {
  TransitionActor,
  TransitionPolicyEvaluation,
} from '../lifecycle/TransitionPolicy';
import { evaluateTransitionPolicy } from '../lifecycle/TransitionPolicy';
import type { LifecycleState } from '../lifecycle/ContentLifecycle';

export interface TransitionAuthorizationRequest {
  readonly state: LifecycleState;
  readonly nextStatus: ApprovalStatus;
  readonly actor: TransitionActor;
}

export type TransitionAuthorizationDenyReason =
  | 'no-policy-rule-defined'
  | 'cross-tenant-transition-forbidden'
  | 'required-role-not-held'
  | 'required-permission-not-granted'
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

  if (!evaluation.hasRequiredRole) {
    return 'required-role-not-held';
  }

  if (!evaluation.hasRequiredPermission) {
    return 'required-permission-not-granted';
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
