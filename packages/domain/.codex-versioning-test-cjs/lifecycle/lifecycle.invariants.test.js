"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const ApprovalStatus_1 = require("./entities/ApprovalStatus");
const TransitionPolicy_1 = require("./policies/TransitionPolicy");
const orgA = 'org-A';
function createState(status) {
    return {
        aggregate: 'ContentEntity',
        organizationId: orgA,
        approvalStatus: ApprovalStatus_1.ApprovalStatus[status],
        currentVersionId: 'ver-1',
        entityType: 'Algorithm',
        entityId: 'alg-1',
    };
}
(0, node_test_1.default)('INV-B-01/02/04: only Draft is editable and Released artifacts stay immutable', () => {
    strict_1.default.equal((0, ApprovalStatus_1.isEditableApprovalStatus)(ApprovalStatus_1.ApprovalStatus.DRAFT), true);
    strict_1.default.equal((0, ApprovalStatus_1.isEditableApprovalStatus)(ApprovalStatus_1.ApprovalStatus.IN_REVIEW), false);
    strict_1.default.equal((0, ApprovalStatus_1.isEditableApprovalStatus)(ApprovalStatus_1.ApprovalStatus.APPROVED), false);
    strict_1.default.equal((0, ApprovalStatus_1.isImmutableApprovalStatus)(ApprovalStatus_1.ApprovalStatus.RELEASED), true);
    strict_1.default.equal((0, ApprovalStatus_1.isImmutableApprovalStatus)(ApprovalStatus_1.ApprovalStatus.DEPRECATED), true);
});
(0, node_test_1.default)('INV-B-05/06: Rejected and Deprecated are terminal states', () => {
    strict_1.default.equal((0, ApprovalStatus_1.isTerminalApprovalStatus)(ApprovalStatus_1.ApprovalStatus.REJECTED), true);
    strict_1.default.equal((0, ApprovalStatus_1.isTerminalApprovalStatus)(ApprovalStatus_1.ApprovalStatus.DEPRECATED), true);
    strict_1.default.equal((0, ApprovalStatus_1.isTerminalApprovalStatus)(ApprovalStatus_1.ApprovalStatus.APPROVED), false);
});
(0, node_test_1.default)('INV-B-03/07/08/09/10/11: prohibited transitions are absent from the explicit transition matrix', () => {
    strict_1.default.deepEqual(ApprovalStatus_1.APPROVAL_STATUS_TRANSITIONS[ApprovalStatus_1.ApprovalStatus.DRAFT], [
        ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
    ]);
    strict_1.default.deepEqual(ApprovalStatus_1.APPROVAL_STATUS_TRANSITIONS[ApprovalStatus_1.ApprovalStatus.IN_REVIEW], [
        ApprovalStatus_1.ApprovalStatus.APPROVED,
        ApprovalStatus_1.ApprovalStatus.REJECTED,
    ]);
    strict_1.default.deepEqual(ApprovalStatus_1.APPROVAL_STATUS_TRANSITIONS[ApprovalStatus_1.ApprovalStatus.REJECTED], []);
    strict_1.default.deepEqual(ApprovalStatus_1.APPROVAL_STATUS_TRANSITIONS[ApprovalStatus_1.ApprovalStatus.DEPRECATED], []);
});
(0, node_test_1.default)('LC-10: lifecycle exposes only explicit named operations with no auto-approval or auto-release path', () => {
    strict_1.default.deepEqual(TransitionPolicy_1.LIFECYCLE_TRANSITION_OPERATIONS, [
        'submit',
        'approve',
        'reject',
        'release',
        'recall',
        'deprecate',
    ]);
    strict_1.default.equal(TransitionPolicy_1.TRANSITION_POLICY_RULES.some((rule) => rule.operation.includes('auto')), false);
});
(0, node_test_1.default)('P-11/INV-H-04: lifecycle foundation has no survey import path', () => {
    const lifecycleFiles = [
        'entities/ApprovalStatus.ts',
        'entities/ContentLifecycle.ts',
        'policies/TransitionPolicy.ts',
    ];
    for (const fileName of lifecycleFiles) {
        const source = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'packages/domain/src/lifecycle', fileName), 'utf8');
        strict_1.default.equal(/\bsurvey\b/i.test(source), false, `${fileName} must not import survey`);
    }
});
(0, node_test_1.default)('implementation constraint: lifecycle foundation uses no common/* imports', () => {
    const lifecycleFiles = [
        'entities/ApprovalStatus.ts',
        'entities/ContentLifecycle.ts',
        'policies/TransitionPolicy.ts',
    ];
    for (const fileName of lifecycleFiles) {
        const source = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'packages/domain/src/lifecycle', fileName), 'utf8');
        strict_1.default.equal(/from ['"]\.\.\/\.\.\/common\//.test(source) ||
            /from ['"]\.\.\/common\//.test(source), false, `${fileName} must not import common/*`);
    }
});
(0, node_test_1.default)('INV-B-12: transitions remain explicit structural checks and require tenant context', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createState('DRAFT'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: null,
        structuralCompletenessSatisfied: true,
        organizationIsActive: true,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'MISSING_ORGANIZATION_CONTEXT');
});
