import { allow, DenyReason, deny } from '../../shared/types';
import { ApprovalStatus, canTransitionApprovalStatus, isImmutableApprovalStatus, isTerminalApprovalStatus, } from '../entities/ApprovalStatus';
export const LIFECYCLE_TRANSITION_OPERATIONS = Object.freeze([
    'submit',
    'approve',
    'reject',
    'release',
    'recall',
    'deprecate',
]);
function freezeRule(rule) {
    return Object.freeze({ ...rule });
}
export const TRANSITION_POLICY_RULES = Object.freeze([
    freezeRule({
        aggregate: 'ContentEntity',
        operation: 'submit',
        from: ApprovalStatus.DRAFT,
        to: ApprovalStatus.IN_REVIEW,
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
        from: ApprovalStatus.IN_REVIEW,
        to: ApprovalStatus.APPROVED,
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
        from: ApprovalStatus.IN_REVIEW,
        to: ApprovalStatus.REJECTED,
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
        from: ApprovalStatus.APPROVED,
        to: ApprovalStatus.RELEASED,
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
        from: ApprovalStatus.APPROVED,
        to: ApprovalStatus.IN_REVIEW,
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
        from: ApprovalStatus.RELEASED,
        to: ApprovalStatus.DEPRECATED,
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
        from: ApprovalStatus.DRAFT,
        to: ApprovalStatus.IN_REVIEW,
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
        from: ApprovalStatus.IN_REVIEW,
        to: ApprovalStatus.APPROVED,
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
        from: ApprovalStatus.IN_REVIEW,
        to: ApprovalStatus.REJECTED,
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
        from: ApprovalStatus.APPROVED,
        to: ApprovalStatus.RELEASED,
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
        from: ApprovalStatus.APPROVED,
        to: ApprovalStatus.IN_REVIEW,
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
        from: ApprovalStatus.RELEASED,
        to: ApprovalStatus.DEPRECATED,
        requiresOrganizationActive: false,
        requiresStructuralCompleteness: false,
        requiresNoDeprecatedReferences: false,
        requiresResolvedQuorum: false,
        requiresRationale: true,
        requiresDeprecationDate: true,
    }),
]);
export function getTransitionPolicyRule(aggregate, from, to) {
    return (TRANSITION_POLICY_RULES.find((rule) => rule.aggregate === aggregate && rule.from === from && rule.to === to) ?? null);
}
function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
export function evaluateLifecycleTransition(context) {
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
    if (isImmutableApprovalStatus(context.state.approvalStatus) &&
        !(context.state.approvalStatus === ApprovalStatus.RELEASED &&
            context.targetStatus === ApprovalStatus.DEPRECATED &&
            context.operation === 'deprecate')) {
        return deny(DenyReason.ENTITY_IMMUTABLE, {
            from: context.state.approvalStatus,
            to: context.targetStatus,
        });
    }
    if (!canTransitionApprovalStatus(context.state.approvalStatus, context.targetStatus)) {
        return deny(DenyReason.TRANSITION_NOT_PERMITTED, {
            from: context.state.approvalStatus,
            to: context.targetStatus,
        });
    }
    const rule = TRANSITION_POLICY_RULES.find((candidate) => candidate.aggregate === context.state.aggregate &&
        candidate.operation === context.operation &&
        candidate.from === context.state.approvalStatus &&
        candidate.to === context.targetStatus);
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
    if (rule.requiresStructuralCompleteness &&
        context.structuralCompletenessSatisfied === false) {
        return deny(DenyReason.CONTENT_STRUCTURALLY_INCOMPLETE);
    }
    if (rule.requiresNoDeprecatedReferences && context.hasDeprecatedReferences) {
        return deny(DenyReason.DEPRECATED_REFERENCE_IN_SUBMISSION);
    }
    if (rule.requiresResolvedQuorum && context.quorumResolved !== true) {
        return deny(DenyReason.QUORUM_NOT_RESOLVED);
    }
    if (rule.releaseChannel === 'content-package' &&
        context.viaContentPackageRelease !== true) {
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
    if (rule.operation === 'deprecate' &&
        !hasText(context.deprecationReason ?? context.rationale)) {
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
/**
 * Bridges actor org-scope with {@link evaluateLifecycleTransition}. Does not invent
 * satisfied preconditions: omitted lifecycle fields are left unset so rule-required
 * checks fail unless the caller supplies them via `lifecycleInput`.
 */
export function evaluateTransitionPolicy(state, nextStatus, actor, lifecycleInput) {
    const rule = getTransitionPolicyRule(state.aggregate, state.approvalStatus, nextStatus);
    const sameOrganization = actor.organizationId === state.organizationId;
    const decision = rule === null
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
