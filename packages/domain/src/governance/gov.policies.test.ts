import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  ApprovalDecisionId,
  ApprovalPolicyId,
  OrgId,
  PermissionId,
  UserId,
  UserRoleId,
  VersionId,
} from '../shared/types';
import { DenyReason } from '../shared/types';
import { OrganizationStatus, ScopeLevel } from '../tenant/entities';
import { EntityType } from '../versioning/entities';
import { ApprovalOutcome } from './entities/ApprovalOutcome';
import { createApprovalDecision } from './entities/ApprovalDecision';
import { createApprovalPolicy } from './entities/ApprovalPolicy';
import { Capability } from './entities/Capability';
import { createPermission, PermissionEntityScope } from './entities/Permission';
import { QuorumType } from './entities/QuorumType';
import { RoleType } from './entities/RoleType';
import { createUserRole } from './entities/UserRole';
import { evaluateQuorum } from './policies/ApprovalResolutionPolicy';
import { evaluateAccess } from './policies/OrganizationScopedAccessPolicy';
import { evaluateRelease } from './policies/ReleaseAuthorizationPolicy';
import { evaluateTransition } from './policies/TransitionAuthorizationPolicy';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;
const actorUserId = 'user-1' as UserId;
const approverUserId = 'user-2' as UserId;

function createActorFixture(input?: {
  readonly organizationId?: OrgId;
  readonly expiresAt?: Date | null;
  readonly permissions?: ReadonlyArray<Capability>;
  readonly scopeLevel?: ScopeLevel;
  readonly scopeTargetId?: string | null;
}) {
  const role = createUserRole({
    id: 'role-1' as UserRoleId,
    organizationId: input?.organizationId ?? orgA,
    userId: actorUserId,
    roleType: RoleType.APPROVER,
    scopeLevel: input?.scopeLevel ?? ScopeLevel.ORGANIZATION,
    scopeTarget:
      input?.scopeLevel && input.scopeLevel !== ScopeLevel.ORGANIZATION
        ? {
            id: input.scopeTargetId as never,
            organizationId: input.organizationId ?? orgA,
          }
        : null,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
    expiresAt: input?.expiresAt,
  });

  const permissions = (input?.permissions ?? [Capability.CONTENT_APPROVE]).map(
    (capability, index) =>
      createPermission({
        id: `perm-${index}` as PermissionId,
        organizationId: role.organizationId,
        userRoleId: role.id,
        capability,
        entityScope: PermissionEntityScope.ALL,
      }),
  );

  return {
    actor: {
      userId: actorUserId,
      organizationId: role.organizationId,
      roles: [role],
      permissions,
    },
    role,
  };
}

test('G2-01/G2-02/G2-03/G2-04: evaluateAccess denies missing org, cross-tenant, inactive org, and missing capability', () => {
  const { actor } = createActorFixture();

  assert.equal(
    evaluateAccess({
      actor,
      organizationId: undefined,
      organization: { id: orgA, status: OrganizationStatus.ACTIVE },
      capability: Capability.CONTENT_APPROVE,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    }).denyReason,
    DenyReason.MISSING_ORGANIZATION_CONTEXT,
  );

  assert.equal(
    evaluateAccess({
      actor,
      organizationId: orgB,
      organization: { id: orgB, status: OrganizationStatus.ACTIVE },
      capability: Capability.CONTENT_APPROVE,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    }).denyReason,
    DenyReason.CROSS_TENANT_ACCESS_DENIED,
  );

  assert.equal(
    evaluateAccess({
      actor,
      organizationId: orgA,
      organization: { id: orgA, status: OrganizationStatus.SUSPENDED },
      capability: Capability.CONTENT_APPROVE,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    }).denyReason,
    DenyReason.ORGANIZATION_NOT_ACTIVE,
  );

  assert.equal(
    evaluateAccess({
      actor,
      organizationId: orgA,
      organization: { id: orgA, status: OrganizationStatus.ACTIVE },
      capability: Capability.PACKAGE_RELEASE,
      entityId: 'pkg-1',
      entityType: EntityType.ContentPackage,
    }).denyReason,
    DenyReason.CAPABILITY_NOT_GRANTED,
  );
});

test('T-GOV-03/T-GOV-14: expired or absent roles are treated as no active role', () => {
  const { actor } = createActorFixture({
    expiresAt: new Date('2026-03-25T08:30:00.000Z'),
  });

  const decision = evaluateAccess({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    capability: Capability.CONTENT_APPROVE,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.NO_ACTIVE_ROLE);
});

test('T-GOV-05: role assignment to self is structurally denied', () => {
  const { actor } = createActorFixture({
    permissions: [Capability.ROLE_ASSIGN],
  });

  const decision = evaluateAccess({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    capability: Capability.ROLE_ASSIGN,
    entityId: 'role-assignment',
    entityType: EntityType.Algorithm,
    targetUserId: actor.userId,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.SELF_ASSIGNMENT_PROHIBITED);
});

test('G2-05: evaluateTransition denies author approval of own submission as SoD violation', () => {
  const { actor } = createActorFixture({
    permissions: [Capability.CONTENT_APPROVE],
  });

  const decision = evaluateTransition({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
    currentState: 'InReview',
    targetState: 'Approved',
    submittedBy: actor.userId,
    requireSeparationOfDuty: true,
    quorumResolved: true,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.SEPARATION_OF_DUTY_VIOLATION);
});

test('G2-06/P-14: OrgAdmin does not receive package.release by default', () => {
  const role = createUserRole({
    id: 'role-admin' as UserRoleId,
    organizationId: orgA,
    userId: actorUserId,
    roleType: RoleType.ORG_ADMIN,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
  });

  const actor = {
    userId: actorUserId,
    organizationId: orgA,
    roles: [role],
    permissions: [
      createPermission({
        id: 'perm-role-assign' as PermissionId,
        organizationId: orgA,
        userRoleId: role.id,
        capability: Capability.ROLE_ASSIGN,
        entityScope: PermissionEntityScope.ALL,
      }),
    ],
  };

  const decision = evaluateRelease({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    packageId: 'pkg-1',
    packageVersionId: 'pkg-ver-1',
    packageApprovalStatus: 'Approved',
    packageEntityType: EntityType.ContentPackage,
    approvedByUserIds: [approverUserId],
    composition: [],
    scopeReferences: [],
    hasConflictingActiveRelease: false,
    hasHardBlockingDependency: false,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.CAPABILITY_NOT_GRANTED);
});

test('G2-07/G2-08: evaluateRelease checks entry approval and stale versions individually', () => {
  const { actor } = createActorFixture({
    permissions: [Capability.PACKAGE_RELEASE],
  });

  const notApproved = evaluateRelease({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    packageId: 'pkg-1',
    packageVersionId: 'pkg-ver-1',
    packageApprovalStatus: 'Approved',
    packageEntityType: EntityType.ContentPackage,
    approvedByUserIds: [approverUserId],
    composition: [
      {
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        versionId: 'ver-1',
        currentVersionId: 'ver-1',
        organizationId: orgA,
        approvalStatus: 'InReview',
      },
    ],
    scopeReferences: [],
    hasConflictingActiveRelease: false,
    hasHardBlockingDependency: false,
  });

  assert.equal(notApproved.denyReason, DenyReason.COMPOSITION_ENTRY_NOT_APPROVED);

  const stale = evaluateRelease({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    packageId: 'pkg-1',
    packageVersionId: 'pkg-ver-1',
    packageApprovalStatus: 'Approved',
    packageEntityType: EntityType.ContentPackage,
    approvedByUserIds: [approverUserId],
    composition: [
      {
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        versionId: 'ver-1',
        currentVersionId: 'ver-2',
        organizationId: orgA,
        approvalStatus: 'Approved',
      },
    ],
    scopeReferences: [],
    hasConflictingActiveRelease: false,
    hasHardBlockingDependency: false,
  });

  assert.equal(stale.denyReason, DenyReason.COMPOSITION_VERSION_STALE);
});

test('G2-09/G2-10/G2-11/G2-12: evaluateQuorum ignores stale and request-change decisions, stays deterministic, and missing policy stays unresolved', () => {
  const policy = createApprovalPolicy({
    id: 'pol-1' as ApprovalPolicyId,
    organizationId: orgA,
    appliesTo: EntityType.Algorithm,
    eligibleRoles: [RoleType.APPROVER],
    minimumReviewers: 2,
    quorumType: QuorumType.MAJORITY,
    requireSeparationOfDuty: true,
  });

  const decisions = [
    createApprovalDecision({
      id: 'dec-1' as ApprovalDecisionId,
      organizationId: orgA,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
      versionId: 'ver-1' as VersionId,
      policyId: policy.id,
      outcome: ApprovalOutcome.APPROVED,
      reviewerId: 'role-1' as UserRoleId,
      reviewedAt: new Date('2026-03-25T10:00:00.000Z'),
      rationale: 'ok',
    }),
    createApprovalDecision({
      id: 'dec-2' as ApprovalDecisionId,
      organizationId: orgA,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
      versionId: 'ver-1' as VersionId,
      policyId: policy.id,
      outcome: ApprovalOutcome.REQUEST_CHANGES,
      reviewerId: 'role-2' as UserRoleId,
      reviewedAt: new Date('2026-03-25T10:05:00.000Z'),
      rationale: 'needs work',
      changeRequests: [{ path: 'title', detail: 'clarify' }],
    }),
    createApprovalDecision({
      id: 'dec-3' as ApprovalDecisionId,
      organizationId: orgA,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
      versionId: 'ver-2' as VersionId,
      policyId: policy.id,
      outcome: ApprovalOutcome.REJECTED,
      reviewerId: 'role-3' as UserRoleId,
      reviewedAt: new Date('2026-03-25T10:10:00.000Z'),
      rationale: 'stale',
    }),
  ];

  const first = evaluateQuorum({
    organizationId: orgA,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
    currentVersionId: 'ver-1',
    policy,
    decisions,
  });
  const second = evaluateQuorum({
    organizationId: orgA,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
    currentVersionId: 'ver-1',
    policy,
    decisions,
  });
  const unresolved = evaluateQuorum({
    organizationId: orgA,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
    currentVersionId: 'ver-1',
    policy: null,
    decisions,
  });

  assert.deepEqual(first, second);
  assert.equal(first.resolved, false);
  assert.equal(first.requestChangesCount, 1);
  assert.deepEqual(first.consideredDecisionIds, ['dec-1', 'dec-2']);
  assert.equal(unresolved.resolved, false);
  assert.equal(unresolved.outcome, null);
});
