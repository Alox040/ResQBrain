import assert from 'node:assert/strict';
import test from 'node:test';

import { ApprovalStatus, createContentPackage, createScopeTarget } from '../content/entities';
import {
  Capability,
  RoleType,
  createPermission,
  createUserRole,
} from '../governance';
import type {
  ContentPackageId,
  OrgId,
  PermissionId,
  ReleaseVersionRecordId,
  UserId,
  UserRoleId,
  VersionId,
} from '../shared/types';
import { DenyReason } from '../shared/types';
import { ScopeLevel } from '../tenant/entities';
import {
  ReleaseType,
  createCompositionEntry,
  createContentPackageVersion,
  createReleaseVersion,
} from '../versioning/entities';
import { releaseContentPackage } from './ReleaseEngine';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;
const packageId = 'pkg-1' as ContentPackageId;
const releaserRoleId = 'role-releaser' as UserRoleId;

function createActor(withPermission = true, organizationId: OrgId = orgA) {
  const role = createUserRole({
    id: releaserRoleId,
    organizationId,
    userId: 'user-1' as UserId,
    roleType: RoleType.RELEASER,
    scopeLevel: ScopeLevel.ORGANIZATION,
    assignedAt: new Date('2026-03-25T08:00:00.000Z'),
    assignedBy: 'role-admin' as UserRoleId,
  });

  return {
    userId: role.userId,
    organizationId,
    roles: [role],
    permissions: withPermission
      ? [
          createPermission({
            id: 'perm-release' as PermissionId,
            organizationId,
            userRoleId: role.id,
            capability: Capability.PACKAGE_RELEASE,
            entityScope: 'All',
          }),
        ]
      : [],
  };
}

function createPackage(
  approvalStatus: ApprovalStatus = ApprovalStatus.Approved,
  currentVersionId: VersionId = 'pkg-ver-2' as VersionId,
  organizationId: OrgId = orgA,
) {
  return createContentPackage({
    id: packageId,
    organizationId,
    title: 'Package',
    targetScope: createScopeTarget({ scopeLevel: ScopeLevel.ORGANIZATION }),
    approvalStatus,
    currentVersionId,
    createdAt: new Date('2026-03-25T08:00:00.000Z'),
    createdBy: releaserRoleId,
  });
}

function createPackageVersion(
  versionId: VersionId = 'pkg-ver-2' as VersionId,
  organizationId: OrgId = orgA,
) {
  return createContentPackageVersion({
    id: versionId,
    organizationId,
    packageId,
    createdAt: new Date('2026-03-25T08:15:00.000Z'),
    createdBy: releaserRoleId,
    composition: [
      createCompositionEntry({
        entityId: 'alg-1' as never,
        versionId: 'ver-1' as VersionId,
        entityType: 'Algorithm',
      }),
    ],
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
  });
}

function createEntries(
  organizationId: OrgId = orgA,
  approvalStatus: ApprovalStatus = ApprovalStatus.Approved,
  versionId: VersionId = 'ver-1' as VersionId,
  currentVersionId: VersionId = versionId,
) {
  return [
    {
      entityId: 'alg-1',
      entityType: 'Algorithm' as const,
      organizationId,
      versionId,
      currentVersionId,
      approvalStatus,
    },
  ] as const;
}

test('release engine creates a release record on success', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-1',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, true);
  if (result.allowed) {
    assert.equal(result.releaseVersion.packageVersionId, 'pkg-ver-2');
    assert.equal(result.releaseVersion.releaseType, ReleaseType.INITIAL);
  }
});

test('release engine denies missing permission', () => {
  const result = releaseContentPackage({
    actor: createActor(false),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-1',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, DenyReason.CAPABILITY_NOT_GRANTED);
});

test('release engine denies packages that are not approved', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-1',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(ApprovalStatus.InReview),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, DenyReason.PACKAGE_NOT_APPROVED);
});

test('release engine denies stale versions for non-rollback releases', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-1',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-1' as VersionId,
    contentPackage: createPackage(ApprovalStatus.Approved, 'pkg-ver-2' as VersionId),
    packageVersion: createPackageVersion('pkg-ver-1' as VersionId),
    entries: createEntries(),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, DenyReason.COMPOSITION_VERSION_STALE);
});

test('release engine denies cross-tenant release attempts', () => {
  const result = releaseContentPackage({
    actor: createActor(true, orgA),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-1',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(ApprovalStatus.Approved, 'pkg-ver-2' as VersionId, orgB),
    packageVersion: createPackageVersion('pkg-ver-2' as VersionId, orgB),
    entries: createEntries(orgB),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, DenyReason.CROSS_TENANT_ACCESS_DENIED);
});

test('release engine creates an audit record on success', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-1' as ReleaseVersionRecordId,
    auditEventId: 'evt-audit',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, true);
  if (result.allowed) {
    assert.equal(result.auditRecord.id, 'evt-audit');
    assert.equal(result.auditRecord.eventType, 'release');
    assert.equal(result.auditRecord.packageVersionId, 'pkg-ver-2');
  }
});

test('release engine returns immutable result object on success', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-immutable' as ReleaseVersionRecordId,
    auditEventId: 'evt-immutable',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, true);
  assert.equal(Object.isFrozen(result), true);
  if (result.allowed) {
    assert.equal(Object.isFrozen(result.auditRecord), true);
    assert.equal(Object.isFrozen(result.auditRecord.applicabilityScopes), true);
    assert.equal(Object.isFrozen(result.auditRecord.excludedScopes), true);
  }
});

test('release engine does not include audit record on denied result', () => {
  const result = releaseContentPackage({
    actor: createActor(false),
    organizationId: orgA,
    releaseVersionId: 'rel-denied' as ReleaseVersionRecordId,
    auditEventId: 'evt-denied',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-2' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.auditRecord, undefined);
});

test('release engine blocks implicit release version aliases', () => {
  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-latest' as ReleaseVersionRecordId,
    auditEventId: 'evt-latest',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'latest' as VersionId,
    contentPackage: createPackage(),
    packageVersion: createPackageVersion(),
    entries: createEntries(),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.decision.denyReason, DenyReason.DATA_INTEGRITY_VIOLATION);
});

test('release engine creates rollback as a new release record', () => {
  const activeRelease = createReleaseVersion({
    id: 'rel-active' as ReleaseVersionRecordId,
    organizationId: orgA,
    packageVersionId: 'pkg-ver-2' as VersionId,
    packageId,
    releasedAt: new Date('2026-03-27T08:00:00.000Z'),
    releasedBy: releaserRoleId,
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    releaseType: ReleaseType.INITIAL,
    compositionSnapshot: createPackageVersion().composition,
  });

  const result = releaseContentPackage({
    actor: createActor(true),
    organizationId: orgA,
    releaseVersionId: 'rel-rollback' as ReleaseVersionRecordId,
    auditEventId: 'evt-rollback',
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    versionId: 'pkg-ver-1' as VersionId,
    contentPackage: createPackage(ApprovalStatus.Approved, 'pkg-ver-2' as VersionId),
    packageVersion: createPackageVersion('pkg-ver-1' as VersionId),
    entries: createEntries(),
    activeRelease,
    rollbackSourceVersionId: 'pkg-ver-1' as VersionId,
  });

  assert.equal(result.allowed, true);
  if (result.allowed) {
    assert.equal(result.releaseVersion.id, 'rel-rollback');
    assert.equal(result.releaseVersion.releaseType, ReleaseType.ROLLBACK);
    assert.equal(result.releaseVersion.supersededReleaseId, activeRelease.id);
    assert.equal(result.releaseVersion.rollbackSourceVersionId, 'pkg-ver-1');
    assert.equal(result.supersededRelease?.status, 'Superseded');
    assert.equal(result.auditRecord.operation, 'rollback');
  }
});
