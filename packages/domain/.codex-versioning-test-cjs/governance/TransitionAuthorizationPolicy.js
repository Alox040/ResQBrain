"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeTransition = authorizeTransition;
const lifecycle_1 = require("../lifecycle");
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
function authorizeTransition(request) {
    const evaluation = (0, lifecycle_1.evaluateTransitionPolicy)(request.state, request.nextStatus, request.actor);
    return {
        allowed: evaluation.allowed,
        evaluation,
        denyReason: deriveTransitionAuthorizationDenyReason(evaluation),
    };
}
