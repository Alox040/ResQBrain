import { isEditableApprovalStatus, isImmutableApprovalStatus, isTerminalApprovalStatus, } from './ApprovalStatus';
export const LIFECYCLE_AGGREGATE_KINDS = Object.freeze([
    'ContentEntity',
    'ContentPackage',
]);
export const CONTENT_ENTITY_TYPES = Object.freeze([
    'Algorithm',
    'Medication',
    'Protocol',
    'Guideline',
]);
export function isLifecycleStateEditable(state) {
    return isEditableApprovalStatus(state.approvalStatus);
}
export function isLifecycleStateImmutable(state) {
    return isImmutableApprovalStatus(state.approvalStatus);
}
export function isLifecycleStateTerminal(state) {
    return isTerminalApprovalStatus(state.approvalStatus);
}
