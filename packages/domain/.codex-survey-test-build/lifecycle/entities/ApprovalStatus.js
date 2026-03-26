/**
 * Lifecycle-owned transition graph for `ApprovalStatus`.
 * Canonical value literals are defined in `content/entities/ApprovalStatus.ts`.
 */
export * from '../../content/entities/ApprovalStatus';
import { ApprovalStatus as S } from '../../content/entities/ApprovalStatus';
export const APPROVAL_STATUS_TRANSITIONS = Object.freeze({
    [S.Draft]: Object.freeze([S.InReview]),
    [S.InReview]: Object.freeze([S.Approved, S.Rejected]),
    [S.Approved]: Object.freeze([S.InReview, S.Released]),
    [S.Rejected]: Object.freeze([]),
    [S.Released]: Object.freeze([S.Deprecated]),
    [S.Deprecated]: Object.freeze([]),
});
export const EDITABLE_APPROVAL_STATUSES = Object.freeze([S.Draft]);
export const LOCKED_APPROVAL_STATUSES = Object.freeze([
    S.InReview,
    S.Approved,
    S.Rejected,
    S.Released,
    S.Deprecated,
]);
export const IMMUTABLE_APPROVAL_STATUSES = Object.freeze([
    S.Released,
    S.Deprecated,
]);
export const TERMINAL_APPROVAL_STATUSES = Object.freeze([
    S.Rejected,
    S.Deprecated,
]);
export function canTransitionApprovalStatus(from, to) {
    return APPROVAL_STATUS_TRANSITIONS[from].includes(to);
}
