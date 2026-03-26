import assert from 'node:assert/strict';
import test from 'node:test';

import type { OrgId, PermissionId, UserId, UserRoleId } from '../shared/types';
import { DenyReason } from '../shared/types';
import { OrganizationStatus, ScopeLevel } from '../tenant/entities';
import { EntityType } from '../versioning/entities';
import { Capability } from './entities/Capability';
import { createPermission, PermissionEntityScope } from './entities/Permission';
import { RoleType } from './entities/RoleType';
import { createUserRole } from './entities/UserRole';
import { evaluateRelease } from './policies/ReleaseAuthorizationPolicy';
import { evaluateTransition } from './policies/TransitionAuthorizationPolicy';

const orgA = 'org-A' as OrgId;

function createActor(userId: UserId, capability: Capability) {
  const role = createUserRole({
    id: `${userId}-role` as UserRoleId,
    organizationId: orgA,
    userId,
    roleType:
      capability === Capability.PACKAGE_RELEASE ? RoleType.RELEASER : RoleType.APPROVER,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
  });

  return {
    userId,
    organizationId: orgA,
    roles: [role],
    permissions: [
      createPermission({
        id: `${userId}-perm` as PermissionId,
        organizationId: orgA,
        userRoleId: role.id,
        capability,
        entityScope: PermissionEntityScope.ALL,
      }),
    ],
  };
}

test('P-03/T-GOV-10: submitter cannot approve own content', () => {
  const actor = createActor('user-author' as UserId, Capability.CONTENT_APPROVE);

  const approve = evaluateTransition({
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

  assert.equal(approve.allowed, false);
  assert.equal(approve.denyReason, DenyReason.SEPARATION_OF_DUTY_VIOLATION);
});

test('P-04/T-GOV-11: approver cannot release package they personally approved', () => {
  const actor = createActor('user-approver' as UserId, Capability.PACKAGE_RELEASE);

  const decision = evaluateRelease({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    packageId: 'pkg-1',
    packageVersionId: 'pkg-ver-1',
    packageApprovalStatus: 'Approved',
    packageEntityType: EntityType.ContentPackage,
    approvedByUserIds: [actor.userId],
    composition: [],
    scopeReferences: [],
    hasConflictingActiveRelease: false,
    hasHardBlockingDependency: false,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.SEPARATION_OF_DUTY_VIOLATION);
});
