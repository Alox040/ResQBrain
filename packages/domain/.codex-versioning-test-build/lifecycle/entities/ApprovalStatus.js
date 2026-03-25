/**
 * Canonical `ApprovalStatus` value type and transition graph for the domain.
 * `common/ApprovalStatus` re-exports this module for legacy import paths.
 */
export const ApprovalStatus = {
    DRAFT: 'Draft',
    IN_REVIEW: 'InReview',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RELEASED: 'Released',
    DEPRECATED: 'Deprecated',
};
export const APPROVAL_STATUS_TRANSITIONS = Object.freeze({
    [ApprovalStatus.DRAFT]: Object.freeze([ApprovalStatus.IN_REVIEW]),
    [ApprovalStatus.IN_REVIEW]: Object.freeze([
        ApprovalStatus.APPROVED,
        ApprovalStatus.REJECTED,
    ]),
    [ApprovalStatus.APPROVED]: Object.freeze([
        ApprovalStatus.IN_REVIEW,
        ApprovalStatus.RELEASED,
    ]),
    [ApprovalStatus.REJECTED]: Object.freeze([]),
    [ApprovalStatus.RELEASED]: Object.freeze([ApprovalStatus.DEPRECATED]),
    [ApprovalStatus.DEPRECATED]: Object.freeze([]),
});
export const EDITABLE_APPROVAL_STATUSES = Object.freeze([
    ApprovalStatus.DRAFT,
]);
export const LOCKED_APPROVAL_STATUSES = Object.freeze([
    ApprovalStatus.IN_REVIEW,
    ApprovalStatus.APPROVED,
    ApprovalStatus.REJECTED,
    ApprovalStatus.RELEASED,
    ApprovalStatus.DEPRECATED,
]);
export const IMMUTABLE_APPROVAL_STATUSES = Object.freeze([
    ApprovalStatus.RELEASED,
    ApprovalStatus.DEPRECATED,
]);
export const TERMINAL_APPROVAL_STATUSES = Object.freeze([
    ApprovalStatus.REJECTED,
    ApprovalStatus.DEPRECATED,
]);
export function canTransitionApprovalStatus(from, to) {
    return APPROVAL_STATUS_TRANSITIONS[from].includes(to);
}
export function isEditableApprovalStatus(status) {
    return EDITABLE_APPROVAL_STATUSES.includes(status);
}
export function isLockedApprovalStatus(status) {
    return LOCKED_APPROVAL_STATUSES.includes(status);
}
export function isImmutableApprovalStatus(status) {
    return IMMUTABLE_APPROVAL_STATUSES.includes(status);
}
export function isTerminalApprovalStatus(status) {
    return TERMINAL_APPROVAL_STATUSES.includes(status);
}
