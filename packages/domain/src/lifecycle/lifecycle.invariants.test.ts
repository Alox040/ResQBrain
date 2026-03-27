import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { AlgorithmId, OrgId, VersionId } from '../shared/types';

import {
  ApprovalStatus,
  APPROVAL_STATUS_TRANSITIONS,
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isTerminalApprovalStatus,
} from './entities/ApprovalStatus';
import type { ContentEntityLifecycleState } from './entities/ContentLifecycle';
import {
  LIFECYCLE_TRANSITION_OPERATIONS,
  TRANSITION_POLICY_RULES,
  evaluateLifecycleTransition,
} from './policies/TransitionPolicy';

const orgA = 'org-A' as OrgId;

function createState(
  status: keyof typeof ApprovalStatus,
): ContentEntityLifecycleState {
  return {
    aggregate: 'ContentEntity',
    organizationId: orgA,
    approvalStatus: ApprovalStatus[status],
    currentVersionId: 'ver-1' as VersionId,
    entityType: 'Algorithm',
    entityId: 'alg-1' as AlgorithmId,
  };
}

test('INV-B-01/02/04: only Draft is editable and Released artifacts stay immutable', () => {
  assert.equal(isEditableApprovalStatus(ApprovalStatus.Draft), true);
  assert.equal(isEditableApprovalStatus(ApprovalStatus.InReview), false);
  assert.equal(isEditableApprovalStatus(ApprovalStatus.Approved), false);
  assert.equal(isImmutableApprovalStatus(ApprovalStatus.Released), true);
  assert.equal(isImmutableApprovalStatus(ApprovalStatus.Deprecated), true);
});

test('INV-B-05/06: Rejected and Deprecated are terminal states', () => {
  assert.equal(isTerminalApprovalStatus(ApprovalStatus.Rejected), true);
  assert.equal(isTerminalApprovalStatus(ApprovalStatus.Deprecated), true);
  assert.equal(isTerminalApprovalStatus(ApprovalStatus.Approved), false);
});

test('INV-B-03/07/08/09/10/11: prohibited transitions are absent from the explicit transition matrix', () => {
  assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.Draft], [
    ApprovalStatus.InReview,
  ]);
  assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.InReview], [
    ApprovalStatus.Approved,
    ApprovalStatus.Rejected,
  ]);
  assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.Rejected], []);
  assert.deepEqual(APPROVAL_STATUS_TRANSITIONS[ApprovalStatus.Deprecated], []);
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
  assert.equal(
    TRANSITION_POLICY_RULES.some((rule) => rule.operation.includes('auto')),
    false,
  );
});

test('P-11/INV-H-04: lifecycle foundation has no survey import path', () => {
  const lifecycleFiles = [
    'entities/ApprovalStatus.ts',
    'entities/ContentLifecycle.ts',
    'policies/TransitionPolicy.ts',
    'services/ContentLifecycleEngine.ts',
  ];

  for (const fileName of lifecycleFiles) {
    const source = readFileSync(
      join(process.cwd(), 'src/lifecycle', fileName),
      'utf8',
    );
    assert.equal(
      /\bsurvey\b/i.test(source),
      false,
      `${fileName} must not import survey`,
    );
  }
});

test('implementation constraint: lifecycle foundation uses no common/* imports', () => {
  const lifecycleFiles = [
    'entities/ApprovalStatus.ts',
    'entities/ContentLifecycle.ts',
    'policies/TransitionPolicy.ts',
    'services/ContentLifecycleEngine.ts',
  ];

  for (const fileName of lifecycleFiles) {
    const source = readFileSync(
      join(process.cwd(), 'src/lifecycle', fileName),
      'utf8',
    );
    assert.equal(
      /from ['"]\.\.\/\.\.\/common\//.test(source) ||
        /from ['"]\.\.\/common\//.test(source),
      false,
      `${fileName} must not import common/*`,
    );
  }
});

test('INV-B-12: transitions remain explicit structural checks and require tenant context', () => {
  const decision = evaluateLifecycleTransition({
    state: createState('Draft'),
    operation: 'submit',
    targetStatus: ApprovalStatus.InReview,
    organizationId: null,
    structuralCompletenessSatisfied: true,
    organizationIsActive: true,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, 'MISSING_ORGANIZATION_CONTEXT');
});
