import assert from 'node:assert/strict';
import test from 'node:test';

import { stampAuditEventForPersistence } from '../../audit';
import {
  Capability,
  RoleType,
  createPermission,
  createUserRole,
  createApprovalPolicy,
  QuorumType,
} from '../entities';
import type {
  ApprovalDecisionId,
  ApprovalPolicyId,
  OrgId,
  PermissionId,
  UserId,
  UserRoleId,
  VersionId,
} from '../../shared/types';
import { ScopeLevel } from '../../tenant/entities';
import {
  ApprovalDecisionValue,
  collectApprovalState,
  detectStaleApproval,
  submitApprovalDecision,
  type ApprovalDecisionRecord,
} from './services';

const organizationId = 'org-approval' as OrgId;
const otherOrganizationId = 'org-other' as OrgId;
const userId = 'user-approval' as UserId;
const roleId = 'role-approval' as UserRoleId;
const currentVersionId = 'ver-2' as VersionId;

function createActor(withPermission = true, orgId: OrgId = organizationId) {
  const role = createUserRole({
    id: roleId,
    organizationId: orgId,
    userId,
    roleType: RoleType.ORG_ADMIN,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-27T08:00:00.000Z'),
    assignedBy: roleId,
  });

  return {
    userId,
    organizationId: orgId,
    roles: Object.freeze([role]),
    permissions: withPermission
      ? Object.freeze([
          createPermission({
            id: 'perm-approval' as PermissionId,
            organizationId: orgId,
            userRoleId: role.id,
            capability: Capability.GOVERNANCE_APPROVE,
            entityScope: 'Algorithm',
          }),
        ])
      : Object.freeze([]),
  };
}

function createPolicy(orgId: OrgId = organizationId, minimumReviewers = 2) {
  return createApprovalPolicy({
    id: 'pol-approval' as ApprovalPolicyId,
    organizationId: orgId,
    appliesTo: 'Algorithm',
    eligibleRoles: [RoleType.ORG_ADMIN],
    minimumReviewers,
    quorumType: QuorumType.UNANIMOUS,
    requireSeparationOfDuty: false,
  });
}

function createDecision(
  id: string,
  actorId: string,
  decision: ApprovalDecisionRecord['decision'],
  versionId: VersionId = currentVersionId,
): ApprovalDecisionRecord {
  return Object.freeze({
    id: id as ApprovalDecisionId,
    actorId: actorId as UserId,
    actorRoleId: `${id}-role` as UserRoleId,
    organizationId,
    targetEntityType: 'Algorithm',
    targetEntityId: 'alg-approval',
    versionId,
    decision,
    rationale: null,
    auditEventId: `evt-${id}`,
  });
}

test('approve flow appends decision, keeps lifecycle untouched, and returns pending quorum when still short', () => {
  const result = submitApprovalDecision({
    approvalDecisionId: 'dec-approve-1' as ApprovalDecisionId,
    auditEventId: 'evt-approve-1',
    actor: createActor(true),
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(),
    existingDecisions: Object.freeze([]),
    decision: ApprovalDecisionValue.APPROVE,
    rationale: 'Looks good.',
  });

  assert.equal(result.allowed, true);
  assert.equal(result.approvalRecord.decision, 'approve');
  assert.equal(result.approvalState.quorum.reached, false);
  assert.equal(result.approvalState.quorum.outcome, 'pending');
  assert.equal('nextState' in result, false);
});

test('reject flow returns business rejection outcome without triggering release logic', () => {
  const result = submitApprovalDecision({
    approvalDecisionId: 'dec-reject-1' as ApprovalDecisionId,
    auditEventId: 'evt-reject-1',
    actor: createActor(true),
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(),
    existingDecisions: Object.freeze([
      createDecision('seed-approve', 'reviewer-a', ApprovalDecisionValue.APPROVE),
    ]),
    decision: ApprovalDecisionValue.REJECT,
    rationale: 'Medical inconsistency found.',
  });

  assert.equal(result.allowed, true);
  assert.equal(result.approvalState.quorum.reached, true);
  assert.equal(result.approvalState.quorum.outcome, 'rejected');
  assert.equal(result.auditRecord.operation, 'reject');
});

test('quorum reached when required approvals are met and stale approvals are ignored', () => {
  const state = collectApprovalState({
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(),
    decisions: Object.freeze([
      createDecision('stale-approve', 'reviewer-a', ApprovalDecisionValue.APPROVE, 'ver-1' as VersionId),
      createDecision('approve-1', 'reviewer-b', ApprovalDecisionValue.APPROVE),
      createDecision('approve-2', 'reviewer-c', ApprovalDecisionValue.APPROVE),
      createDecision('abstain-1', 'reviewer-d', ApprovalDecisionValue.ABSTAIN),
    ]),
  });

  assert.equal(state.staleDecisions.length, 1);
  assert.equal(state.approvalCount, 2);
  assert.equal(state.abstainCount, 1);
  assert.equal(state.quorum.reached, true);
  assert.equal(state.quorum.outcome, 'approved');
});

test('quorum not reached when approvals are below threshold and abstain does not count', () => {
  const state = collectApprovalState({
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(organizationId, 2),
    decisions: Object.freeze([
      createDecision('approve-1', 'reviewer-a', ApprovalDecisionValue.APPROVE),
      createDecision('abstain-1', 'reviewer-b', ApprovalDecisionValue.ABSTAIN),
    ]),
  });

  assert.equal(state.quorum.reached, false);
  assert.equal(state.quorum.outcome, 'pending');
  assert.equal(state.approvalCount, 1);
  assert.equal(state.abstainCount, 1);
});

test('stale approval detection invalidates previous-version decisions', () => {
  assert.equal(
    detectStaleApproval({
      currentVersionId,
      decision: createDecision('stale-check', 'reviewer-a', ApprovalDecisionValue.APPROVE, 'ver-1' as VersionId),
    }),
    true,
  );
});

test('missing governance permission returns denied business result', () => {
  const result = submitApprovalDecision({
    approvalDecisionId: 'dec-denied-1' as ApprovalDecisionId,
    auditEventId: 'evt-denied-1',
    actor: createActor(false),
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(),
    existingDecisions: Object.freeze([]),
    decision: ApprovalDecisionValue.APPROVE,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, 'CAPABILITY_NOT_GRANTED');
});

test('cross tenant block denies decision submission', () => {
  const result = submitApprovalDecision({
    approvalDecisionId: 'dec-cross-1' as ApprovalDecisionId,
    auditEventId: 'evt-cross-1',
    actor: createActor(true, otherOrganizationId),
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(),
    existingDecisions: Object.freeze([]),
    decision: ApprovalDecisionValue.APPROVE,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, 'CROSS_TENANT_ACCESS_DENIED');
});

test('audit record is created for approval decisions and receives timestamp via audit layer', () => {
  const result = submitApprovalDecision({
    approvalDecisionId: 'dec-audit-1' as ApprovalDecisionId,
    auditEventId: 'evt-audit-1',
    actor: createActor(true),
    target: {
      organizationId,
      entityType: 'Algorithm',
      entityId: 'alg-approval',
      currentVersionId,
    },
    policy: createPolicy(organizationId, 1),
    existingDecisions: Object.freeze([]),
    decision: ApprovalDecisionValue.APPROVE,
    rationale: 'Ready.',
  });

  assert.equal(result.allowed, true);
  const persisted = stampAuditEventForPersistence(
    result.auditRecord,
    '2026-03-27T09:30:00.000Z',
  );

  assert.equal(persisted.eventType, 'approval_decision');
  assert.equal(persisted.timestamp, '2026-03-27T09:30:00.000Z');
  assert.equal(persisted.decision, 'approve');
  assert.equal(persisted.operation, 'approve');
});
