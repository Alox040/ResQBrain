"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const ApprovalStatus_1 = require("./entities/ApprovalStatus");
const TransitionPolicy_1 = require("./policies/TransitionPolicy");
const orgA = 'org-A';
function createEntityState(approvalStatus) {
    return {
        aggregate: 'ContentEntity',
        organizationId: orgA,
        approvalStatus: ApprovalStatus_1.ApprovalStatus[approvalStatus],
        currentVersionId: 'ver-1',
        entityType: 'Algorithm',
        entityId: 'alg-1',
    };
}
function createPackageState(approvalStatus) {
    return {
        aggregate: 'ContentPackage',
        organizationId: orgA,
        approvalStatus: ApprovalStatus_1.ApprovalStatus[approvalStatus],
        currentVersionId: 'ver-pkg-1',
        contentPackageId: 'pkg-1',
        releasedArtifactIds: Object.freeze([]),
    };
}
(0, node_test_1.default)('T-LC-01: Draft -> InReview denies structurally incomplete content', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('DRAFT'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
        organizationIsActive: true,
        structuralCompletenessSatisfied: false,
        hasDeprecatedReferences: false,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'CONTENT_STRUCTURALLY_INCOMPLETE');
});
(0, node_test_1.default)('T-LC-02: Draft -> InReview denies deprecated references at submission time', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('DRAFT'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
        organizationIsActive: true,
        structuralCompletenessSatisfied: true,
        hasDeprecatedReferences: true,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'DEPRECATED_REFERENCE_IN_SUBMISSION');
});
(0, node_test_1.default)('T-LC-03: InReview -> Approved requires quorum resolution', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('IN_REVIEW'),
        operation: 'approve',
        targetStatus: ApprovalStatus_1.ApprovalStatus.APPROVED,
        organizationId: orgA,
        quorumResolved: false,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'QUORUM_NOT_RESOLVED');
});
(0, node_test_1.default)('T-LC-04: Approved -> Released is forbidden for content outside ContentPackage release path', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('APPROVED'),
        operation: 'release',
        targetStatus: ApprovalStatus_1.ApprovalStatus.RELEASED,
        organizationId: orgA,
        organizationIsActive: true,
        viaContentPackageRelease: false,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'TRANSITION_NOT_PERMITTED');
});
(0, node_test_1.default)('T-LC-05: Released -> Draft is denied as immutable', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('RELEASED'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.DRAFT,
        organizationId: orgA,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'ENTITY_IMMUTABLE');
});
(0, node_test_1.default)('T-LC-06: Rejected versions are terminal', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('REJECTED'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'VERSION_TERMINAL');
});
(0, node_test_1.default)('T-LC-07: Deprecated versions are terminal', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('DEPRECATED'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'VERSION_TERMINAL');
});
(0, node_test_1.default)('T-LC-08: recall is denied when the approved version is already released in a package', () => {
    const decision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createEntityState('APPROVED'),
        operation: 'recall',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
        alreadyReleasedInPackage: true,
        rationale: 'clinical correction required',
    });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, 'ENTITY_ALREADY_RELEASED');
});
(0, node_test_1.default)('T-LC-09: suspended organizations block submissions but not structural approval resolution', () => {
    const submitDecision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createPackageState('DRAFT'),
        operation: 'submit',
        targetStatus: ApprovalStatus_1.ApprovalStatus.IN_REVIEW,
        organizationId: orgA,
        organizationIsActive: false,
        structuralCompletenessSatisfied: true,
    });
    const approveDecision = (0, TransitionPolicy_1.evaluateLifecycleTransition)({
        state: createPackageState('IN_REVIEW'),
        operation: 'approve',
        targetStatus: ApprovalStatus_1.ApprovalStatus.APPROVED,
        organizationId: orgA,
        organizationIsActive: false,
        quorumResolved: true,
    });
    strict_1.default.equal(submitDecision.allowed, false);
    strict_1.default.equal(submitDecision.denyReason, 'ORGANIZATION_NOT_ACTIVE');
    strict_1.default.equal(approveDecision.allowed, true);
});
