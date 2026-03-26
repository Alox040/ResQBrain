import { DomainError } from '../../shared/errors';
import { ApprovalOutcome as ApprovalOutcomeValue } from './ApprovalOutcome';
import { DecisionStatus as DecisionStatusValue } from './DecisionStatus';
export function createApprovalDecision(input) {
    const status = input.status ?? DecisionStatusValue.SUBMITTED;
    const changeRequests = freezeChangeRequests(input.changeRequests);
    const rationale = assertNonEmptyText(input.rationale, 'ApprovalDecision.rationale');
    if (input.outcome === ApprovalOutcomeValue.REQUEST_CHANGES &&
        changeRequests.length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalDecision.changeRequests are required for RequestChanges outcomes.');
    }
    if (input.outcome !== ApprovalOutcomeValue.REQUEST_CHANGES &&
        changeRequests.length > 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalDecision.changeRequests are only permitted for RequestChanges.');
    }
    if (status === DecisionStatusValue.SUPERSEDED &&
        (input.supersededBy == null || input.supersededBy.trim().length === 0)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Superseded ApprovalDecision records must reference supersededBy.');
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
        supersededBy: input.supersededBy == null
            ? null
            : assertNonEmptyId(input.supersededBy, 'ApprovalDecision.supersededBy'),
    });
}
function freezeChangeRequests(changeRequests) {
    return Object.freeze((changeRequests ?? []).map((changeRequest) => Object.freeze({
        path: assertNonEmptyText(changeRequest.path, 'ApprovalDecision.changeRequests.path'),
        detail: assertNonEmptyText(changeRequest.detail, 'ApprovalDecision.changeRequests.detail'),
    })));
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'ApprovalDecision.organizationId is required.');
    }
    return value;
}
function assertNonEmptyText(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value.trim();
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, { field });
    }
    return new Date(value.getTime());
}
