import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import type { OrgId, PermissionId, UserId, UserRoleId } from '../shared/types';
import { DenyReason } from '../shared/types';
import { OrganizationStatus, ScopeLevel } from '../tenant/entities';
import { EntityType } from '../versioning/entities';
import { Capability } from './entities/Capability';
import { createPermission, PermissionEntityScope } from './entities/Permission';
import { RoleType } from './entities/RoleType';
import { createUserRole } from './entities/UserRole';
import { evaluateAccess } from './policies/OrganizationScopedAccessPolicy';
import { evaluateTransition } from './policies/TransitionAuthorizationPolicy';

const orgA = 'org-A' as OrgId;

function createActor() {
  const role = createUserRole({
    id: 'role-1' as UserRoleId,
    organizationId: orgA,
    userId: 'user-1' as UserId,
    roleType: RoleType.APPROVER,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
  });

  return {
    userId: role.userId,
    organizationId: orgA,
    roles: [role],
    permissions: [
      createPermission({
        id: 'perm-1' as PermissionId,
        organizationId: orgA,
        userRoleId: role.id,
        capability: Capability.CONTENT_APPROVE,
        entityScope: PermissionEntityScope.ALL,
      }),
    ],
  };
}

test('INV-D-01/02/03/04/05: policies return PolicyDecision, deny normally, default unresolved context to deny, and are deterministic', () => {
  const actor = createActor();
  const first = evaluateAccess({
    actor,
    organizationId: undefined,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    capability: Capability.CONTENT_APPROVE,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
  });
  const second = evaluateAccess({
    actor,
    organizationId: undefined,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    capability: Capability.CONTENT_APPROVE,
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
  });

  assert.equal(typeof first.allowed, 'boolean');
  assert.equal(first.denyReason, DenyReason.MISSING_ORGANIZATION_CONTEXT);
  assert.deepEqual(first, second);
});

test('INV-D-07/08/09/10/11/12: org binding, no admin shortcut, no cross-org grants, no grants without role, released stays immutable', () => {
  const actor = createActor();
  const noRoleActor = { ...actor, roles: [], permissions: actor.permissions };

  assert.equal(
    evaluateAccess({
      actor: noRoleActor,
      organizationId: orgA,
      organization: { id: orgA, status: OrganizationStatus.ACTIVE },
      capability: Capability.CONTENT_APPROVE,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    }).denyReason,
    DenyReason.NO_ACTIVE_ROLE,
  );

  assert.equal(
    evaluateAccess({
      actor,
      organizationId: 'org-B' as OrgId,
      organization: { id: 'org-B' as OrgId, status: OrganizationStatus.ACTIVE },
      capability: Capability.CONTENT_APPROVE,
      entityId: 'alg-1',
      entityType: EntityType.Algorithm,
    }).denyReason,
    DenyReason.CROSS_TENANT_ACCESS_DENIED,
  );

  const released = evaluateTransition({
    actor,
    organizationId: orgA,
    organization: { id: orgA, status: OrganizationStatus.ACTIVE },
    entityId: 'alg-1',
    entityType: EntityType.Algorithm,
    currentState: 'Released',
    targetState: 'Rejected',
    submittedBy: 'user-2',
    requireSeparationOfDuty: true,
    quorumResolved: true,
  });

  assert.equal(released.denyReason, DenyReason.ENTITY_IMMUTABLE);
});

test('governance policies never import survey and entities never import policy/service layers', () => {
  const policyFiles = [
    'OrganizationScopedAccessPolicy.ts',
    'TransitionAuthorizationPolicy.ts',
    'ApprovalResolutionPolicy.ts',
    'ReleaseAuthorizationPolicy.ts',
    'DeprecationAuthorizationPolicy.ts',
  ];

  for (const fileName of policyFiles) {
    const source = readFileSync(
      join(process.cwd(), 'src/governance/policies', fileName),
      'utf8',
    );

    assert.equal(/from ['"].*survey/.test(source), false, `${fileName} must not import survey`);
  }

  const entityFiles = [
    'Permission.ts',
    'UserRole.ts',
    'ApprovalPolicy.ts',
    'ApprovalDecision.ts',
  ];

  for (const fileName of entityFiles) {
    const source = readFileSync(
      join(process.cwd(), 'src/governance/entities', fileName),
      'utf8',
    );

    assert.equal(
      /from ['"]\.\.\/policies\//.test(source) ||
        /lifecycle\/services/.test(source) ||
        /release\/services/.test(source),
      false,
      `${fileName} must remain passive foundation code`,
    );
  }
});
