import assert from 'node:assert/strict';
import test from 'node:test';
import { DomainError } from '../shared/errors';
import { DenyReason } from '../shared/types';
import { OrganizationStatus, ScopeLevel } from '../tenant/entities';
import { EntityType } from '../versioning/entities';
import { Capability } from './entities/Capability';
import { createPermission, PermissionEntityScope } from './entities/Permission';
import { RoleType } from './entities/RoleType';
import { createUserRole } from './entities/UserRole';
import { hasCapability } from './policies/hasCapability';
import { evaluateTransition } from './policies/TransitionAuthorizationPolicy';
const orgA = 'org-A';
function createActorWithRoles(userId) {
    const reviewerRole = createUserRole({
        id: 'role-reviewer',
        organizationId: orgA,
        userId,
        roleType: RoleType.REVIEWER,
        scopeLevel: ScopeLevel.ORGANIZATION,
        assignedAt: new Date('2026-03-25T08:00:00.000Z'),
        assignedBy: 'role-admin',
    });
    const releaserRole = createUserRole({
        id: 'role-releaser',
        organizationId: orgA,
        userId,
        roleType: RoleType.RELEASER,
        scopeLevel: ScopeLevel.ORGANIZATION,
        assignedAt: new Date('2026-03-25T08:00:00.000Z'),
        assignedBy: 'role-admin',
    });
    return {
        userId,
        organizationId: orgA,
        roles: [reviewerRole, releaserRole],
        permissions: [
            createPermission({
                id: 'perm-review',
                organizationId: orgA,
                userRoleId: reviewerRole.id,
                capability: Capability.CONTENT_REVIEW,
                entityScope: PermissionEntityScope.ALL,
            }),
            createPermission({
                id: 'perm-release',
                organizationId: orgA,
                userRoleId: releaserRole.id,
                capability: Capability.PACKAGE_RELEASE,
                entityScope: PermissionEntityScope.ALL,
            }),
        ],
    };
}
test('T-GOV-20/T-GOV-22: capability evaluation requires explicit organizationId and unions active role grants', () => {
    const actor = createActorWithRoles('user-multi');
    assert.equal(hasCapability(actor, Capability.CONTENT_REVIEW, orgA), true);
    assert.equal(hasCapability(actor, Capability.PACKAGE_RELEASE, orgA), true);
    assert.throws(() => hasCapability(actor, Capability.CONTENT_REVIEW, undefined), (error) => error instanceof DomainError &&
        error.code === 'MISSING_ORGANIZATION_CONTEXT');
});
test('T-GOV-23/INV-D-12: released artifacts remain immutable regardless of capability', () => {
    const actor = createActorWithRoles('user-editor');
    const decision = evaluateTransition({
        actor,
        organizationId: orgA,
        organization: { id: orgA, status: OrganizationStatus.ACTIVE },
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        currentState: 'Released',
        targetState: 'Approved',
        submittedBy: 'someone-else',
        requireSeparationOfDuty: true,
        quorumResolved: true,
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, DenyReason.ENTITY_IMMUTABLE);
});
