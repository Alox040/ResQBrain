"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_ENTITY_TYPES = exports.LIFECYCLE_AGGREGATE_KINDS = void 0;
exports.isLifecycleStateEditable = isLifecycleStateEditable;
exports.isLifecycleStateImmutable = isLifecycleStateImmutable;
exports.isLifecycleStateTerminal = isLifecycleStateTerminal;
const ApprovalStatus_1 = require("./ApprovalStatus");
exports.LIFECYCLE_AGGREGATE_KINDS = Object.freeze([
    'ContentEntity',
    'ContentPackage',
]);
exports.CONTENT_ENTITY_TYPES = Object.freeze([
    'Algorithm',
    'Medication',
    'Protocol',
    'Guideline',
]);
function isLifecycleStateEditable(state) {
    return (0, ApprovalStatus_1.isEditableApprovalStatus)(state.approvalStatus);
}
function isLifecycleStateImmutable(state) {
    return (0, ApprovalStatus_1.isImmutableApprovalStatus)(state.approvalStatus);
}
function isLifecycleStateTerminal(state) {
    return (0, ApprovalStatus_1.isTerminalApprovalStatus)(state.approvalStatus);
}
