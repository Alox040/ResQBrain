import { evaluateTransitionPolicy, } from '../lifecycle';
function deriveTransitionAuthorizationDenyReason(evaluation) {
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
export function authorizeTransition(request) {
    const evaluation = evaluateTransitionPolicy(request.state, request.nextStatus, request.actor);
    return {
        allowed: evaluation.allowed,
        evaluation,
        denyReason: deriveTransitionAuthorizationDenyReason(evaluation),
    };
}
