/**
 * Layer 3 — `ApprovalStatus` value type embedded on all content entities.
 * Transition authority and graphs live in `lifecycle/entities/ApprovalStatus.ts`.
 */
export const ApprovalStatus = {
    Draft: 'Draft',
    InReview: 'InReview',
    Approved: 'Approved',
    Rejected: 'Rejected',
    Released: 'Released',
    Deprecated: 'Deprecated',
};
const EDITABLE = new Set([ApprovalStatus.Draft]);
const IMMUTABLE = new Set([
    ApprovalStatus.Released,
    ApprovalStatus.Deprecated,
]);
const TERMINAL = new Set([
    ApprovalStatus.Rejected,
    ApprovalStatus.Deprecated,
]);
/** Draft only — structural edit window (no policy authority). */
export function isEditableApprovalStatus(status) {
    return EDITABLE.has(status);
}
/** Not Draft — locked for ordinary authoring (structural, not governance). */
export function isLockedApprovalStatus(status) {
    return !isEditableApprovalStatus(status);
}
export function isImmutableApprovalStatus(status) {
    return IMMUTABLE.has(status);
}
export function isTerminalApprovalStatus(status) {
    return TERMINAL.has(status);
}
