import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  AlgorithmId,
  ContentPackageId,
  GuidelineId,
  MedicationId,
  OrgId,
  ProtocolId,
  VersionId,
} from '../shared/types';
import {
  createReleaseBundle,
  isReleaseBundlePublished,
  publishReleaseBundle,
  ReleaseBundleStatus,
} from './index';

const organizationId = 'org-1' as OrgId;
const version = 'ver-1' as VersionId;

test('release ReleaseBundle keeps tenant scope and required version', () => {
  const bundle = createReleaseBundle({
    id: 'pkg-1' as ContentPackageId,
    organizationId,
    version,
    createdAt: new Date('2026-04-09T10:00:00.000Z'),
    algorithms: ['alg-1' as AlgorithmId],
    medications: ['med-1' as MedicationId],
    protocols: ['proto-1' as ProtocolId],
    guidelines: ['guide-1' as GuidelineId],
  });

  assert.equal(bundle.organizationId, organizationId);
  assert.equal(bundle.version, version);
  assert.equal(bundle.status, ReleaseBundleStatus.DRAFT);
  assert.equal(bundle.releasedAt, null);
});

test('release ReleaseBundle becomes immutable after release', () => {
  const released = publishReleaseBundle(
    createReleaseBundle({
      id: 'pkg-2' as ContentPackageId,
      organizationId,
      version,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      algorithms: ['alg-1' as AlgorithmId],
      medications: [],
      protocols: [],
      guidelines: [],
    }),
    { releasedAt: new Date('2026-04-09T11:00:00.000Z') },
  );

  assert.equal(isReleaseBundlePublished(released), true);
  assert.equal(released.status, ReleaseBundleStatus.RELEASED);
  assert.throws(() =>
    publishReleaseBundle(released, {
      releasedAt: new Date('2026-04-09T12:00:00.000Z'),
    }),
  );
});

test('release ReleaseBundle rejects duplicate members per content type', () => {
  assert.throws(() =>
    createReleaseBundle({
      id: 'pkg-3' as ContentPackageId,
      organizationId,
      version,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      algorithms: ['alg-1' as AlgorithmId, 'alg-1' as AlgorithmId],
      medications: [],
      protocols: [],
      guidelines: [],
    }),
  );
});
