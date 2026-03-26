import { ApprovalOutcome, DecisionStatus, QuorumType, } from '../entities';
export function evaluateQuorum(context) {
    if (context.policy == null) {
        return unresolvedOutcome();
    }
    const decisions = getRelevantDecisions(context.decisions, context.currentVersionId);
    const consideredDecisionIds = Object.freeze(decisions.map((decision) => decision.id));
    const approvals = decisions.filter((decision) => decision.outcome === ApprovalOutcome.APPROVED);
    const rejections = decisions.filter((decision) => decision.outcome === ApprovalOutcome.REJECTED);
    const abstained = decisions.filter((decision) => decision.outcome === ApprovalOutcome.ABSTAINED);
    const requestChanges = decisions.filter((decision) => decision.outcome === ApprovalOutcome.REQUEST_CHANGES);
    const participantDecisions = decisions.filter((decision) => decision.outcome !== ApprovalOutcome.REQUEST_CHANGES);
    const participatingDecisionIds = Object.freeze(participantDecisions.map((decision) => decision.id));
    if (context.policy.quorumType === QuorumType.SINGLE_REJECT && rejections.length > 0) {
        return resolvedOutcome('Rejected', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    if (context.policy.quorumType === QuorumType.SINGLE_APPROVE && approvals.length > 0) {
        return resolvedOutcome('Approved', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    if (participantDecisions.length < context.policy.minimumReviewers) {
        return unresolvedOutcome(participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    if (context.policy.quorumType === QuorumType.UNANIMOUS) {
        if (rejections.length > 0) {
            return resolvedOutcome('Rejected', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
        }
        if (approvals.length >= context.policy.minimumReviewers) {
            return resolvedOutcome('Approved', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
        }
        return unresolvedOutcome(participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    if (context.policy.quorumType === QuorumType.MAJORITY) {
        return resolvedOutcome(approvals.length > rejections.length ? 'Approved' : 'Rejected', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    if (context.policy.quorumType === QuorumType.SINGLE_REJECT) {
        return resolvedOutcome(approvals.length > 0 ? 'Approved' : 'Rejected', participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
    }
    return unresolvedOutcome(participatingDecisionIds, consideredDecisionIds, approvals.length, rejections.length, abstained.length, requestChanges.length);
}
function getRelevantDecisions(decisions, currentVersionId) {
    return Object.freeze(decisions.filter((decision) => decision.status === DecisionStatus.SUBMITTED &&
        decision.versionId === currentVersionId));
}
function resolvedOutcome(outcome, participatingDecisionIds, consideredDecisionIds, approvalCount, rejectionCount, abstainedCount, requestChangesCount) {
    return Object.freeze({
        resolved: true,
        outcome,
        participatingDecisionIds,
        consideredDecisionIds,
        approvalCount,
        rejectionCount,
        abstainedCount,
        requestChangesCount,
    });
}
function unresolvedOutcome(participatingDecisionIds = Object.freeze([]), consideredDecisionIds = Object.freeze([]), approvalCount = 0, rejectionCount = 0, abstainedCount = 0, requestChangesCount = 0) {
    return Object.freeze({
        resolved: false,
        outcome: null,
        participatingDecisionIds,
        consideredDecisionIds,
        approvalCount,
        rejectionCount,
        abstainedCount,
        requestChangesCount,
    });
}
