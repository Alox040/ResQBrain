"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMINAL_APPROVAL_STATUSES = exports.IMMUTABLE_APPROVAL_STATUSES = exports.LOCKED_APPROVAL_STATUSES = exports.EDITABLE_APPROVAL_STATUSES = exports.APPROVAL_STATUS_TRANSITIONS = exports.ApprovalStatus = void 0;
exports.canTransitionApprovalStatus = canTransitionApprovalStatus;
exports.isEditableApprovalStatus = isEditableApprovalStatus;
exports.isLockedApprovalStatus = isLockedApprovalStatus;
exports.isImmutableApprovalStatus = isImmutableApprovalStatus;
exports.isTerminalApprovalStatus = isTerminalApprovalStatus;
/**
 * Canonical `ApprovalStatus` value type and transition graph for the domain.
 * `common/ApprovalStatus` re-exports this module for legacy import paths.
 */
exports.ApprovalStatus = {
    DRAFT: 'Draft',
    IN_REVIEW: 'InReview',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RELEASED: 'Released',
    DEPRECATED: 'Deprecated',
};
exports.APPROVAL_STATUS_TRANSITIONS = Object.freeze({
    [exports.ApprovalStatus.DRAFT]: Object.freeze([exports.ApprovalStatus.IN_REVIEW]),
    [exports.ApprovalStatus.IN_REVIEW]: Object.freeze([
        exports.ApprovalStatus.APPROVED,
        exports.ApprovalStatus.REJECTED,
    ]),
    [exports.ApprovalStatus.APPROVED]: Object.freeze([
        exports.ApprovalStatus.IN_REVIEW,
        exports.ApprovalStatus.RELEASED,
    ]),
    [exports.ApprovalStatus.REJECTED]: Object.freeze([]),
    [exports.ApprovalStatus.RELEASED]: Object.freeze([exports.ApprovalStatus.DEPRECATED]),
    [exports.ApprovalStatus.DEPRECATED]: Object.freeze([]),
});
exports.EDITABLE_APPROVAL_STATUSES = Object.freeze([
    exports.ApprovalStatus.DRAFT,
]);
exports.LOCKED_APPROVAL_STATUSES = Object.freeze([
    exports.ApprovalStatus.IN_REVIEW,
    exports.ApprovalStatus.APPROVED,
    exports.ApprovalStatus.REJECTED,
    exports.ApprovalStatus.RELEASED,
    exports.ApprovalStatus.DEPRECATED,
]);
exports.IMMUTABLE_APPROVAL_STATUSES = Object.freeze([
    exports.ApprovalStatus.RELEASED,
    exports.ApprovalStatus.DEPRECATED,
]);
exports.TERMINAL_APPROVAL_STATUSES = Object.freeze([
    exports.ApprovalStatus.REJECTED,
    exports.ApprovalStatus.DEPRECATED,
]);
function canTransitionApprovalStatus(from, to) {
    return exports.APPROVAL_STATUS_TRANSITIONS[from].includes(to);
}
function isEditableApprovalStatus(status) {
    return exports.EDITABLE_APPROVAL_STATUSES.includes(status);
}
function isLockedApprovalStatus(status) {
    return exports.LOCKED_APPROVAL_STATUSES.includes(status);
}
function isImmutableApprovalStatus(status) {
    return exports.IMMUTABLE_APPROVAL_STATUSES.includes(status);
}
function isTerminalApprovalStatus(status) {
    return exports.TERMINAL_APPROVAL_STATUSES.includes(status);
}
