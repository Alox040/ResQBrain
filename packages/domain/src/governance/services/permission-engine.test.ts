import assert from 'node:assert/strict';
import test from 'node:test';

import type { OrgId, PermissionId, UserId, UserRoleId } from '../../shared/types';
import { DenyReason } from '../../shared/types';
import { ScopeLevel } from '../../tenant/entities';
import { EntityType } from '../../versioning/entities';
import { Capability } from '../entities/Capability';
import { createPermission, PermissionEntityScope } from '../entities/Permission';
import { RoleType } from '../entities/RoleType';
import { createUserRole } from '../entities/UserRole';
import { evaluateCapability } from './PermissionEngine';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;

function createRole(input: {
  readonly id: UserRoleId;
  readonly userId: UserId;
  readonly organizationId?: OrgId;
  readonly roleType?: RoleType;
}) {
  return createUserRole({
    id: input.id,
    organizationId: input.organizationId ?? orgA,
    userId: input.userId,
    roleType: input.roleType ?? RoleType.APPROVER,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
  });
}

function createActor(input?: {
  readonly userId?: UserId;
  readonly organizationId?: OrgId;
  readonly roles?: ReturnType<typeof createRole>[];
  readonly permissions?: ReadonlyArray<{
    readonly id: PermissionId;
    readonly userRoleId: UserRoleId;
    readonly capability: Capability;
  }>;
}) {
  const userId = input?.userId ?? ('user-1' as UserId);
  const organizationId = input?.organizationId ?? orgA;
  const roles = input?.roles ?? [createRole({ id: 'role-1' as UserRoleId, userId, organizationId })];
  const permissions = (input?.permissions ?? []).map((permission) =>
    createPermission({
      id: permission.id,
      organizationId,
      userRoleId: permission.userRoleId,
      capability: permission.capability,
      entityScope: PermissionEntityScope.ALL,
    }),
  );

  return {
    userId,
    organizationId,
    roles,
    permissions,
  };
}

test('permission engine allows explicit capability grants', () => {
  const actor = createActor({
    permissions: [
      {
        id: 'perm-approve' as PermissionId,
        userRoleId: 'role-1' as UserRoleId,
        capability: Capability.CONTENT_APPROVE,
      },
    ],
  });

  const decision = evaluateCapability({
    actor,
    organizationId: orgA,
    capability: Capability.CONTENT_APPROVE,
    targetEntity: {
      organizationId: orgA,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    },
    context: {
      authorUserId: 'user-author' as UserId,
    },
  });

  assert.equal(decision.allowed, true);
});

test('permission engine denies missing capability without implicit allow', () => {
  const actor = createActor();

  const decision = evaluateCapability({
    actor,
    organizationId: orgA,
    capability: Capability.CONTENT_APPROVE,
    targetEntity: {
      organizationId: orgA,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    },
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.CAPABILITY_NOT_GRANTED);
});

test('permission engine denies cross-tenant access', () => {
  const actor = createActor({
    permissions: [
      {
        id: 'perm-approve' as PermissionId,
        userRoleId: 'role-1' as UserRoleId,
        capability: Capability.CONTENT_APPROVE,
      },
    ],
  });

  const decision = evaluateCapability({
    actor,
    organizationId: orgA,
    capability: Capability.CONTENT_APPROVE,
    targetEntity: {
      organizationId: orgB,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    },
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.CROSS_TENANT_ACCESS_DENIED);
});

test('permission engine denies separation of duties violations', () => {
  const actor = createActor({
    permissions: [
      {
        id: 'perm-release' as PermissionId,
        userRoleId: 'role-1' as UserRoleId,
        capability: Capability.PACKAGE_RELEASE,
      },
    ],
  });

  const decision = evaluateCapability({
    actor,
    organizationId: orgA,
    capability: Capability.PACKAGE_RELEASE,
    targetEntity: {
      organizationId: orgA,
      entityId: 'pkg-1',
      entityType: EntityType.ContentPackage,
    },
    context: {
      approverUserIds: [actor.userId],
    },
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.SEPARATION_OF_DUTY_VIOLATION);
});

test('permission engine denies missing organization context', () => {
  const actor = createActor({
    permissions: [
      {
        id: 'perm-approve' as PermissionId,
        userRoleId: 'role-1' as UserRoleId,
        capability: Capability.CONTENT_APPROVE,
      },
    ],
  });

  const decision = evaluateCapability({
    actor,
    organizationId: undefined,
    capability: Capability.CONTENT_APPROVE,
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.denyReason, DenyReason.MISSING_ORGANIZATION_CONTEXT);
});

test('permission engine unions grants across multiple roles', () => {
  const userId = 'user-multi' as UserId;
  const reviewerRole = createRole({
    id: 'role-reviewer' as UserRoleId,
    userId,
    roleType: RoleType.REVIEWER,
  });
  const releaserRole = createRole({
    id: 'role-releaser' as UserRoleId,
    userId,
    roleType: RoleType.RELEASER,
  });

  const actor = createActor({
    userId,
    roles: [reviewerRole, releaserRole],
    permissions: [
      {
        id: 'perm-review' as PermissionId,
        userRoleId: reviewerRole.id,
        capability: Capability.CONTENT_REVIEW,
      },
      {
        id: 'perm-release' as PermissionId,
        userRoleId: releaserRole.id,
        capability: Capability.PACKAGE_RELEASE,
      },
    ],
  });

  const decision = evaluateCapability({
    actor,
    organizationId: orgA,
    capability: Capability.PACKAGE_RELEASE,
    targetEntity: {
      organizationId: orgA,
      entityId: 'pkg-1',
      entityType: EntityType.ContentPackage,
    },
    context: {
      approverUserIds: ['another-user' as UserId],
    },
  });

  assert.equal(decision.allowed, true);
  assert.deepEqual(decision.context.grantingRoleIds, [releaserRole.id]);
});
