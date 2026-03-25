"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELEASE_SOURCE_APPROVAL_STATUSES = exports.APPROVAL_STATUSES = void 0;
exports.isReleaseSourceApprovalStatus = isReleaseSourceApprovalStatus;
/**
 * Compatibility surface for content/release code paths that historically imported
 * `ApprovalStatus` from `common/`. Canonical definitions (transition graph, terminals,
 * immutability helpers) live in `lifecycle/entities/ApprovalStatus.ts`.
 */
__exportStar(require("../lifecycle/entities/ApprovalStatus"), exports);
const ApprovalStatus_1 = require("../lifecycle/entities/ApprovalStatus");
/** Prefer {@link ApprovalStatusValues} object keys; kept for legacy iteration. */
exports.APPROVAL_STATUSES = [
    ApprovalStatus_1.ApprovalStatus.DRAFT,
    ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
    ApprovalStatus_1.ApprovalStatus.APPROVED,
    ApprovalStatus_1.ApprovalStatus.REJECTED,
    ApprovalStatus_1.ApprovalStatus.RELEASED,
    ApprovalStatus_1.ApprovalStatus.DEPRECATED,
];
exports.RELEASE_SOURCE_APPROVAL_STATUSES = [
    ApprovalStatus_1.ApprovalStatus.APPROVED,
    ApprovalStatus_1.ApprovalStatus.RELEASED,
];
function isReleaseSourceApprovalStatus(status) {
    return exports.RELEASE_SOURCE_APPROVAL_STATUSES.includes(status);
}
