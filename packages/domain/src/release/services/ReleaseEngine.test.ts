import assert from 'node:assert/strict';
import test from 'node:test';

import { ApprovalStatus, createContentPackage, createScopeTarget } from '../../content/entities';
import { DomainError } from '../../shared/errors';
import type {
  ContentPackageId,
  OrgId,
  ReleaseVersionRecordId,
  UserRoleId,
  VersionId,
} from '../../shared/types';
import { ScopeLevel } from '../../tenant/entities';
import {
  createCompositionEntry,
  createContentPackageVersion,
  ReleaseType,
} from '../../versioning/entities';
import { ReleaseEngine } from './ReleaseEngine';

const organizationId = 'org-A' as OrgId;
const otherOrganizationId = 'org-B' as OrgId;
const packageId = 'pkg-1' as ContentPackageId;
const releasedBy = 'role-releaser' as UserRoleId;

function createPackage(
  approvalStatus: ApprovalStatus = ApprovalStatus.Approved,
  currentVersionId: VersionId = 'pkg-ver-2' as VersionId,
  orgId: OrgId = organizationId,
) {
  return createContentPackage({
    id: packageId,
    organizationId: orgId,
    title: 'Package',
    targetScope: createScopeTarget({ scopeLevel: ScopeLevel.ORGANIZATION }),
    approvalStatus,
    currentVersionId,
    createdAt: new Date('2026-03-25T08:00:00.000Z'),
    createdBy: releasedBy,
  });
}

function createPackageVersion(
  versionId: VersionId = 'pkg-ver-2' as VersionId,
  orgId: OrgId = organizationId,
) {
  const contentPackage = createPackage(ApprovalStatus.Approved, versionId, orgId);

  return createContentPackageVersion({
    id: versionId,
    contentPackage,
    createdAt: new Date('2026-03-25T08:15:00.000Z'),
    createdBy: releasedBy,
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

function createCompositionEntries(
  orgId: OrgId = organizationId,
  approvalStatus: ApprovalStatus = ApprovalStatus.Approved,
  versionId: VersionId = 'ver-1' as VersionId,
  currentVersionId: VersionId = versionId,
) {
  return [
    {
      entityId: 'alg-1',
      organizationId: orgId,
      approvalStatus,
      versionId,
      currentVersionId,
    },
  ] as const;
}

function createReleaseInput() {
  const contentPackage = createPackage();
  const packageVersion = createPackageVersion();

  return {
    id: 'rel-1' as ReleaseVersionRecordId,
    contentPackage,
    packageVersion,
    compositionEntries: createCompositionEntries(),
    releasedAt: new Date('2026-03-27T09:00:00.000Z'),
    releasedBy,
  };
}

function assertDomainError(
  callback: () => unknown,
  expectedCode: string,
): DomainError {
  let captured: unknown;

  assert.throws(() => {
    try {
      callback();
    } catch (error) {
      captured = error;
      throw error;
    }
  });

  assert.ok(captured instanceof DomainError);
  assert.equal(captured.code, expectedCode);

  return captured;
}

test('createRelease fails when compositionEntries are missing instead of being derived implicitly', () => {
  const engine = new ReleaseEngine();

  assertDomainError(
    () =>
      engine.createRelease({
        ...createReleaseInput(),
        compositionEntries: undefined as unknown as ReturnType<typeof createCompositionEntries>,
      }),
    'DATA_INTEGRITY_VIOLATION',
  );
});

test('createRelease fails when an entry approvalStatus is not approved', () => {
  const engine = new ReleaseEngine();

  assertDomainError(
    () =>
      engine.createRelease({
        ...createReleaseInput(),
        compositionEntries: createCompositionEntries(
          organizationId,
          ApprovalStatus.InReview,
        ),
      }),
    'COMPOSITION_ENTRY_NOT_APPROVED',
  );
});

test('createRelease fails when an entry version is stale', () => {
  const engine = new ReleaseEngine();

  assertDomainError(
    () =>
      engine.createRelease({
        ...createReleaseInput(),
        compositionEntries: createCompositionEntries(
          organizationId,
          ApprovalStatus.Approved,
          'ver-1' as VersionId,
          'ver-2' as VersionId,
        ),
      }),
    'COMPOSITION_VERSION_STALE',
  );
});

test('createRelease fails on tenant mismatch in compositionEntries', () => {
  const engine = new ReleaseEngine();

  assertDomainError(
    () =>
      engine.createRelease({
        ...createReleaseInput(),
        compositionEntries: createCompositionEntries(otherOrganizationId),
      }),
    'CROSS_TENANT_COMPOSITION_ENTRY',
  );
});

test('createRelease passes with real resolved compositionEntries', () => {
  const engine = new ReleaseEngine();

  const release = engine.createRelease({
    ...createReleaseInput(),
    compositionEntries: createCompositionEntries(
      organizationId,
      ApprovalStatus.Approved,
      'ver-1' as VersionId,
      'ver-1' as VersionId,
    ),
  });

  assert.equal(release.packageVersionId, 'pkg-ver-2');
  assert.equal(release.releaseType, ReleaseType.INITIAL);
  assert.deepEqual(release.compositionSnapshot, createPackageVersion().composition);
});
