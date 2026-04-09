import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  AlgorithmId,
  ContentPackageId,
  OrgId,
  UserId,
  UserRoleId,
  VersionId,
} from '../shared/types';

import { ApprovalStatus } from './entities/ApprovalStatus';
import type {
  ContentEntityLifecycleState,
  ContentPackageLifecycleState,
} from './entities/ContentLifecycle';
import { transitionLifecycle } from './services/ContentLifecycleEngine';

const organizationId = 'org-lifecycle' as OrgId;
const actorUserId = 'user-lifecycle' as UserId;
const actorRoleId = 'role-lifecycle' as UserRoleId;

function createEntityState(
  approvalStatus: keyof typeof ApprovalStatus,
): ContentEntityLifecycleState {
  return {
    aggregate: 'ContentEntity',
    organizationId,
    approvalStatus: ApprovalStatus[approvalStatus],
    currentVersionId: 'ver-1' as VersionId,
    entityType: 'Algorithm',
    entityId: 'alg-1' as AlgorithmId,
  };
}

function createPackageState(
  approvalStatus: keyof typeof ApprovalStatus,
): ContentPackageLifecycleState {
  return {
    aggregate: 'ContentPackage',
    organizationId,
    approvalStatus: ApprovalStatus[approvalStatus],
    currentVersionId: 'pkg-ver-1' as VersionId,
    contentPackageId: 'pkg-1' as ContentPackageId,
    releasedArtifactIds: Object.freeze(['alg-1' as AlgorithmId]),
  };
}

function createActor(orgId: OrgId | null | undefined = organizationId) {
  return {
    organizationId: orgId,
    userId: actorUserId,
    roleId: actorRoleId,
  };
}

test('engine allows Draft -> InReview when policy preconditions are satisfied', () => {
  const result = transitionLifecycle({
    state: createEntityState('Draft'),
    targetStatus: ApprovalStatus.InReview,
    actor: createActor(),
    auditEventId: 'evt-1',
    organizationIsActive: true,
    structuralCompletenessSatisfied: true,
    hasDeprecatedReferences: false,
    rationale: 'Ready for review',
  });

  assert.equal(result.allowed, true);
  assert.equal(result.nextState.approvalStatus, ApprovalStatus.InReview);
  assert.equal(result.rule.operation, 'submit');
  assert.equal(result.auditRecord.operation, 'submit');
});

test('engine allows InReview -> Approved and creates audit record data', () => {
  const result = transitionLifecycle({
    state: createEntityState('InReview'),
    targetStatus: ApprovalStatus.Approved,
    actor: createActor(),
    auditEventId: 'evt-2',
    quorumResolved: true,
    metadata: Object.freeze({ source: 'unit-test' }),
  });

  assert.equal(result.allowed, true);
  assert.equal(result.auditRecord.eventType, 'lifecycle');
  assert.equal(result.auditRecord.targetEntityType, 'Algorithm');
  assert.equal(result.auditRecord.targetEntityId, 'alg-1');
  assert.equal(result.auditRecord.versionId, 'ver-1');
  assert.equal(result.auditRecord.fromState, 'InReview');
  assert.equal(result.auditRecord.toState, 'Approved');
  assert.equal(result.auditRecord.capability, 'content.approve');
  assert.deepEqual(result.auditRecord.metadata, {
    aggregate: 'ContentEntity',
    ruleAggregate: 'ContentEntity',
    releaseChannel: null,
    organizationIsActive: null,
    structuralCompletenessSatisfied: null,
    hasDeprecatedReferences: null,
    quorumResolved: true,
    deprecationDate: null,
    deprecationReason: null,
    viaContentPackageRelease: null,
    alreadyReleasedInPackage: null,
    source: 'unit-test',
  });
});

test('engine allows Released -> Deprecated for content packages with explicit rationale', () => {
  const result = transitionLifecycle({
    state: createPackageState('Released'),
    targetStatus: ApprovalStatus.Deprecated,
    actor: createActor(),
    auditEventId: 'evt-3',
    rationale: 'Superseded by newer package',
    deprecationDate: '2026-03-27',
    deprecationReason: 'superseded',
  });

  assert.equal(result.allowed, true);
  assert.equal(result.nextState.approvalStatus, ApprovalStatus.Deprecated);
  assert.equal(result.rule.operation, 'deprecate');
  assert.equal(result.auditRecord.targetEntityType, 'ContentPackage');
  assert.equal(result.auditRecord.capability, 'package.deprecate');
});

test('engine denies forbidden transition Draft -> Approved as business result', () => {
  const result = transitionLifecycle({
    state: createEntityState('Draft'),
    targetStatus: ApprovalStatus.Approved,
    actor: createActor(),
    auditEventId: 'evt-4',
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, 'TRANSITION_NOT_PERMITTED');
  assert.equal(result.auditRecord, undefined);
});

test('engine allows Approved -> Released for content entities via content-package release channel', () => {
  const result = transitionLifecycle({
    state: createEntityState('Approved'),
    targetStatus: ApprovalStatus.Released,
    actor: createActor(),
    auditEventId: 'evt-5',
    organizationIsActive: true,
    viaContentPackageRelease: true,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.nextState.approvalStatus, ApprovalStatus.Released);
  assert.equal(result.rule.operation, 'release');
  assert.equal(result.auditRecord.operation, 'release');
  assert.deepEqual(result.auditRecord.metadata, {
    aggregate: 'ContentEntity',
    ruleAggregate: 'ContentEntity',
    releaseChannel: 'content-package',
    organizationIsActive: true,
    structuralCompletenessSatisfied: null,
    hasDeprecatedReferences: null,
    quorumResolved: null,
    deprecationDate: null,
    deprecationReason: null,
    viaContentPackageRelease: true,
    alreadyReleasedInPackage: null,
  });
});

test('engine denies missing organization context without throwing', () => {
  const result = transitionLifecycle({
    state: createEntityState('Draft'),
    targetStatus: ApprovalStatus.InReview,
    actor: createActor(null),
    auditEventId: 'evt-6',
    organizationIsActive: true,
    structuralCompletenessSatisfied: true,
    hasDeprecatedReferences: false,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, 'MISSING_ORGANIZATION_CONTEXT');
});
