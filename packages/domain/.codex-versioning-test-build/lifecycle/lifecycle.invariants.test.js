import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApprovalStatus, APPROVAL_STATUS_TRANSITIONS, isEditableApprovalStatus, isImmutableApprovalStatus, isTerminalApprovalStatus, } from './entities/ApprovalStatus';
import { LIFECYCLE_TRANSITION_OPERATIONS, TRANSITION_POLICY_RULES, evaluateLifecycleTransition, } from './policies/TransitionPolicy';
const orgA = 'org-A';
function createState(status) {
    return {
        aggregate: 'ContentEntity',
        organizationId: orgA,
        approvalStatus: ApprovalStatus[status],
        currentVersionId: 'ver-1',
        entityType: 'Algorithm',
        entityId: 'alg-1',
    };
}
test('INV-B-01/02/04: only Draft is editable and Released artifacts stay immutable', () => {
    assert.equal(isEditableApprovalStatus(ApprovalStatus.DRAFT), true);
    assert.equal(isEditableApprovalStatus(ApprovalStatus.IN_REVIEW), false);
    assert.equal(isEditableApprovalStatus(ApprovalStatus.APPROVED), false);
    assert.equal(isImmutableApprovalStatus(ApprovalStatus.RELEASED), true);
    assert.equal(isImmutableApprovalStatus(ApprovalStatus.DEPRECATED), true);
});
test('INV-B-05/06: Rejected and Deprecated are terminal states', () => {
    assert.equal(isTerminalApprovalStatus(ApprovalStatus.REJECTED), true);
    assert.equal(isTerminalApprovalStatus(ApprovalStatus.DEPRECATED), true);
    assert.equal(isTerminalApprovalStatus(ApprovalStatus.APPROVED), false);
});
test('INV-B-03/07/08/09/10/11: prohibited transitions are absent from the explicit transition matrix', () => {
    assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.DRAFT], [
        ApprovalStatus.IN_REVIEW,
    ]);
    assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.IN_REVIEW], [
        ApprovalStatus.APPROVED,
        ApprovalStatus.REJECTED,
    ]);
    assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.REJECTED], []);
    assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.DEPRECATED], []);
});
test('LC-10: lifecycle exposes only explicit named operations with no auto-approval or auto-release path', () => {
    assert.deepEqual(LIFECYCLE_TRANSITION_OPERATIONS, [
        'submit',
        'approve',
        'reject',
        'release',
        'recall',
        'deprecate',
    ]);
    assert.equal(TRANSITION_POLICY_RULES.some((rule) => rule.operation.includes('auto')), false);
});
test('P-11/INV-H-04: lifecycle foundation has no survey import path', () => {
    const lifecycleFiles = [
        'entities/ApprovalStatus.ts',
        'entities/ContentLifecycle.ts',
        'policies/TransitionPolicy.ts',
    ];
    for (const fileName of lifecycleFiles) {
        const source = readFileSync(join(process.cwd(), 'packages/domain/src/lifecycle', fileName), 'utf8');
        assert.equal(/\bsurvey\b/i.test(source), false, `${fileName} must not import survey`);
    }
});
test('implementation constraint: lifecycle foundation uses no common/* imports', () => {
    const lifecycleFiles = [
        'entities/ApprovalStatus.ts',
        'entities/ContentLifecycle.ts',
        'policies/TransitionPolicy.ts',
    ];
    for (const fileName of lifecycleFiles) {
        const source = readFileSync(join(process.cwd(), 'packages/domain/src/lifecycle', fileName), 'utf8');
        assert.equal(/from ['"]\.\.\/\.\.\/common\//.test(source) ||
            /from ['"]\.\.\/common\//.test(source), false, `${fileName} must not import common/*`);
    }
});
test('INV-B-12: transitions remain explicit structural checks and require tenant context', () => {
    const decision = evaluateLifecycleTransition({
        state: createState('DRAFT'),
        operation: 'submit',
        targetStatus: ApprovalStatus.IN_REVIEW,
        organizationId: null,
        structuralCompletenessSatisfied: true,
        organizationIsActive: true,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, 'MISSING_ORGANIZATION_CONTEXT');
});
