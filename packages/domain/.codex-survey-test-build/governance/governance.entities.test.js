import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { DomainError } from '../shared/errors';
import { ScopeLevel } from '../tenant/entities';
import { EntityType } from '../versioning/entities';
import { createApprovalDecision } from './entities/ApprovalDecision';
import { ApprovalOutcome } from './entities/ApprovalOutcome';
import { createApprovalPolicy } from './entities/ApprovalPolicy';
import { Capability } from './entities/Capability';
import { DecisionStatus } from './entities/DecisionStatus';
import { createPermission, PermissionEntityScope } from './entities/Permission';
import { QuorumType } from './entities/QuorumType';
import { RoleType } from './entities/RoleType';
import { createUserRole, isUserRoleActive } from './entities/UserRole';
const orgA = 'org-A';
const orgB = 'org-B';
const userId = 'user-1';
const roleId = 'role-1';
test('G1-04/G1-05: UserRole is organization-scoped, immutable, and requires organizationId', () => {
    const role = createUserRole({
        id: roleId,
        organizationId: orgA,
        userId,
        roleType: RoleType.REVIEWER,
        scopeLevel: ScopeLevel.ORGANIZATION,
        assignedAt: new Date('2026-03-25T08:00:00.000Z'),
        assignedBy: 'role-admin',
    });
    assert.equal(role.organizationId, orgA);
    assert.equal(isUserRoleActive(role, new Date('2026-03-25T09:00:00.000Z')), true);
    assert.throws(() => {
        role.organizationId = orgB;
    });
    assert.throws(() => createUserRole({
        id: 'role-2',
        organizationId: '',
        userId,
        roleType: RoleType.REVIEWER,
        scopeLevel: ScopeLevel.ORGANIZATION,
        assignedAt: new Date('2026-03-25T08:00:00.000Z'),
        assignedBy: 'role-admin',
    }), (error) => error instanceof DomainError &&
        error.code === 'MISSING_ORGANIZATION_CONTEXT');
});
test('TI-08: UserRole scopeTargetId must remain within the same organization', () => {
    assert.throws(() => createUserRole({
        id: 'role-3',
        organizationId: orgA,
        userId,
        roleType: RoleType.REVIEWER,
        scopeLevel: ScopeLevel.REGION,
        scopeTarget: {
            id: 'region-1',
            organizationId: orgB,
        },
        assignedAt: new Date('2026-03-25T08:00:00.000Z'),
        assignedBy: 'role-admin',
    }), (error) => error instanceof DomainError &&
        error.code === 'CROSS_TENANT_SCOPE_REFERENCE');
});
test('G1-06/AP-02: ApprovalDecision requires versionId and ApprovalPolicy enforces minimum reviewers >= 1', () => {
    assert.throws(() => createApprovalDecision({
        id: 'dec-1',
        organizationId: orgA,
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        versionId: '',
        policyId: 'pol-1',
        outcome: ApprovalOutcome.APPROVED,
        reviewerId: roleId,
        reviewedAt: new Date('2026-03-25T10:00:00.000Z'),
        rationale: 'Looks good.',
    }), (error) => error instanceof DomainError &&
        error.code === 'DATA_INTEGRITY_VIOLATION');
    assert.throws(() => createApprovalPolicy({
        id: 'pol-1',
        organizationId: orgA,
        appliesTo: EntityType.Algorithm,
        eligibleRoles: [RoleType.APPROVER],
        minimumReviewers: 0,
        quorumType: QuorumType.UNANIMOUS,
        requireSeparationOfDuty: true,
    }), (error) => error instanceof DomainError &&
        error.code === 'DATA_INTEGRITY_VIOLATION');
});
test('ApprovalDecision enforces request-change structure and superseded state invariants', () => {
    assert.throws(() => createApprovalDecision({
        id: 'dec-2',
        organizationId: orgA,
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        versionId: 'ver-1',
        policyId: 'pol-1',
        outcome: ApprovalOutcome.REQUEST_CHANGES,
        reviewerId: roleId,
        reviewedAt: new Date('2026-03-25T10:00:00.000Z'),
        rationale: 'Needs work.',
    }), (error) => error instanceof DomainError &&
        error.code === 'DATA_INTEGRITY_VIOLATION');
    const superseded = createApprovalDecision({
        id: 'dec-3',
        organizationId: orgA,
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        versionId: 'ver-1',
        policyId: 'pol-1',
        outcome: ApprovalOutcome.ABSTAINED,
        reviewerId: roleId,
        reviewedAt: new Date('2026-03-25T10:00:00.000Z'),
        rationale: 'No further comment.',
        status: DecisionStatus.SUPERSEDED,
        supersededBy: 'dec-4',
    });
    assert.equal(superseded.status, DecisionStatus.SUPERSEDED);
    assert.equal(superseded.supersededBy, 'dec-4');
});
test('Permission is atomic and never global', () => {
    const permission = createPermission({
        id: 'perm-1',
        organizationId: orgA,
        userRoleId: roleId,
        capability: Capability.PACKAGE_RELEASE,
        entityScope: PermissionEntityScope.ALL,
    });
    assert.equal(permission.capability, Capability.PACKAGE_RELEASE);
    assert.equal(permission.entityScope, PermissionEntityScope.ALL);
});
test('implementation constraint: governance foundation uses no common/ids imports', () => {
    const governanceFiles = [
        'entities/Capability.ts',
        'entities/RoleType.ts',
        'entities/QuorumType.ts',
        'entities/ApprovalOutcome.ts',
        'entities/DecisionStatus.ts',
        'entities/Permission.ts',
        'entities/UserRole.ts',
        'entities/ApprovalPolicy.ts',
        'entities/ApprovalDecision.ts',
        'policies/PolicyContext.ts',
        'policies/hasCapability.ts',
        'policies/OrganizationScopedAccessPolicy.ts',
        'policies/TransitionAuthorizationPolicy.ts',
        'policies/ApprovalResolutionPolicy.ts',
        'policies/ReleaseAuthorizationPolicy.ts',
        'policies/DeprecationAuthorizationPolicy.ts',
    ];
    for (const fileName of governanceFiles) {
        const source = readFileSync(join(process.cwd(), 'src/governance', fileName), 'utf8');
        assert.equal(/from ['"]\.\.\/\.\.\/common\/ids['"]/.test(source) ||
            /from ['"]\.\.\/common\/ids['"]/.test(source), false, `${fileName} must not import common/ids`);
    }
});
function _compileTimeApprovalDecisionRequiresVersionId() {
    // @ts-expect-error G1-06: versionId is mandatory
    createApprovalDecision({
        id: 'dec-x',
        organizationId: orgA,
        entityId: 'alg-1',
        entityType: EntityType.Algorithm,
        policyId: 'pol-1',
        outcome: ApprovalOutcome.APPROVED,
        reviewerId: roleId,
        reviewedAt: new Date(),
        rationale: 'ok',
    });
}
void _compileTimeApprovalDecisionRequiresVersionId;
