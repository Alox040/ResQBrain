import assert from 'node:assert/strict';
import test from 'node:test';
import { ApprovalStatus } from './entities/ApprovalStatus';
import { evaluateLifecycleTransition } from './policies/TransitionPolicy';
const orgA = 'org-A';
function createEntityState(approvalStatus) {
    return {
        aggregate: 'ContentEntity',
        organizationId: orgA,
        approvalStatus: ApprovalStatus[approvalStatus],
        currentVersionId: 'ver-1',
        entityType: 'Algorithm',
        entityId: 'alg-1',
    };
}
function createPackageState(approvalStatus) {
    return {
        aggregate: 'ContentPackage',
        organizationId: orgA,
        approvalStatus: ApprovalStatus[approvalStatus],
        currentVersionId: 'ver-pkg-1',
        contentPackageId: 'pkg-1',
        releasedArtifactIds: Object.freeze([]),
    };
}
test('T-LC-01: Draft -> InReview denies structurally incomplete content', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Draft'),
        operation: 'submit',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
        organizationIsActive: true,
        structuralCompletenessSatisfied: false,
        hasDeprecatedReferences: false,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'CONTENT_STRUCTURALLY_INCOMPLETE');
});
test('T-LC-02: Draft -> InReview denies deprecated references at submission time', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Draft'),
        operation: 'submit',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
        organizationIsActive: true,
        structuralCompletenessSatisfied: true,
        hasDeprecatedReferences: true,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'DEPRECATED_REFERENCE_IN_SUBMISSION');
});
test('T-LC-03: InReview -> Approved requires quorum resolution', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('InReview'),
        operation: 'approve',
        targetStatus: ApprovalStatus.Approved,
        organizationId: orgA,
        quorumResolved: false,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'QUORUM_NOT_RESOLVED');
});
test('T-LC-04: Approved -> Released is forbidden for content outside ContentPackage release path', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Approved'),
        operation: 'release',
        targetStatus: ApprovalStatus.Released,
        organizationId: orgA,
        organizationIsActive: true,
        viaContentPackageRelease: false,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'TRANSITION_NOT_PERMITTED');
});
test('T-LC-05: Released -> Draft is denied as immutable', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Released'),
        operation: 'submit',
        targetStatus: ApprovalStatus.Draft,
        organizationId: orgA,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'ENTITY_IMMUTABLE');
});
test('T-LC-06: Rejected versions are terminal', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Rejected'),
        operation: 'submit',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'VERSION_TERMINAL');
});
test('T-LC-07: Deprecated versions are terminal', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Deprecated'),
        operation: 'submit',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'VERSION_TERMINAL');
});
test('T-LC-08: recall is denied when the approved version is already released in a package', () => {
    const decision = evaluateLifecycleTransition({
        state: createEntityState('Approved'),
        operation: 'recall',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
        alreadyReleasedInPackage: true,
        rationale: 'clinical correction required',
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'ENTITY_ALREADY_RELEASED');
});
test('T-LC-09: suspended organizations block submissions but not structural approval resolution', () => {
    const submitDecision = evaluateLifecycleTransition({
        state: createPackageState('Draft'),
        operation: 'submit',
        targetStatus: ApprovalStatus.InReview,
        organizationId: orgA,
        organizationIsActive: false,
        structuralCompletenessSatisfied: true,
    });
    const approveDecision = evaluateLifecycleTransition({
        state: createPackageState('InReview'),
        operation: 'approve',
        targetStatus: ApprovalStatus.Approved,
        organizationId: orgA,
        organizationIsActive: false,
        quorumResolved: true,
    });
    assert.equal(submitDecision.allowed, false);
    assert.equal(submitDecision.denyReason, 'ORGANIZATION_NOT_ACTIVE');
    assert.equal(approveDecision.allowed, true);
});
