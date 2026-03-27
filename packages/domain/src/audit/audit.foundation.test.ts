import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import type {
  AlgorithmId,
  ContentPackageId,
  OrgId,
  UserId,
  UserRoleId,
  VersionId,
} from '../shared/types';
import type { AuditRecordEvent } from '../shared/audit';
import {
  AuditOperation,
  AuditReleaseType,
} from '../shared/audit';
import { allow } from '../shared/types';
import { DomainError, TenantIsolationViolation } from '../shared/errors';
import {
  assertAuditEntryOrganization,
  createAuditLogEntry,
  createAuditQueryOptions,
  requireAuditOrganizationId,
  stampAuditEventForPersistence,
} from './index';

const organizationId = 'org-audit' as OrgId;
const actorUserId = 'user-1' as UserId;
const actorRoleId = 'role-1' as UserRoleId;
const entityId = 'alg-1' as AlgorithmId;
const packageId = 'pkg-1' as ContentPackageId;
const versionId = 'ver-1' as VersionId;

test('audit log entries are immutable projections with subtype-specific metadata', () => {
  const record: AuditRecordEvent = {
    id: 'evt-1',
    eventType: 'lifecycle',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.Submit,
    targetEntityType: 'Algorithm',
    targetEntityId: entityId,
    versionId,
    fromState: 'Draft',
    toState: 'InReview',
    capability: 'content.submit',
    rationale: 'Ready for review',
  };

  const event = stampAuditEventForPersistence(record, '2026-03-27T09:00:00.000Z');
  const entry = createAuditLogEntry(event);

  assert.equal(entry.organizationId, organizationId);
  assert.equal(entry.targetEntityType, 'Algorithm');
  assert.equal(entry.beforeState, 'Draft');
  assert.equal(entry.afterState, 'InReview');
  assert.equal(entry.rationale, 'Ready for review');
  assert.deepEqual(entry.metadata, {
    versionId,
    capability: 'content.submit',
  });
  assert.throws(() => {
    (entry.metadata as Record<string, unknown>).extra = true;
  });
});

test('audit log projections preserve release and policy payloads as frozen metadata snapshots', () => {
  const policyRecord: AuditRecordEvent = {
    id: 'evt-2',
    eventType: 'policy_decision',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.Approve,
    targetEntityType: 'ContentPackage',
    targetEntityId: packageId,
    policyType: 'ApprovalResolutionPolicy',
    capability: 'package.approve',
    decision: false,
    denyReason: 'NO_ACTIVE_ROLE',
    warnings: [],
    evaluationInputs: { packageVersionId: versionId },
  };

  const releaseRecord: AuditRecordEvent = {
    id: 'evt-3',
    eventType: 'release',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.Release,
    targetEntityType: 'ContentPackage',
    targetEntityId: packageId,
    releaseVersionId: 'rel-1' as VersionId,
    packageVersionId: versionId,
    packageId,
    releasedBy: actorRoleId,
    releasedAt: '2026-03-27T09:10:00.000Z',
    targetScope: { scopeLevel: 'Organization' },
    applicabilityScopes: [{ stationId: 'station-1' }],
    excludedScopes: [],
    releaseType: AuditReleaseType.INITIAL,
    compositionSnapshot: [{ entityId, versionId }],
    dependencyWarnings: allow({ warnings: [{ code: 'WARN', message: 'watch' }] }).warnings,
  };

  const policyEvent = stampAuditEventForPersistence(policyRecord, '2026-03-27T09:05:00.000Z');
  const releaseEvent = stampAuditEventForPersistence(releaseRecord, '2026-03-27T09:10:00.000Z');

  const policyEntry = createAuditLogEntry(policyEvent);
  const releaseEntry = createAuditLogEntry(releaseEvent);

  assert.deepEqual(policyEntry.metadata, {
    policyType: 'ApprovalResolutionPolicy',
    capability: 'package.approve',
    decision: false,
    denyReason: 'NO_ACTIVE_ROLE',
    warnings: [],
    evaluationInputs: { packageVersionId: versionId },
  });
  assert.deepEqual(releaseEntry.metadata, {
    releaseVersionId: 'rel-1',
    packageVersionId: versionId,
    packageId,
    releasedBy: actorRoleId,
    releasedAt: '2026-03-27T09:10:00.000Z',
    targetScope: { scopeLevel: 'Organization' },
    applicabilityScopes: [{ stationId: 'station-1' }],
    excludedScopes: [],
    releaseType: 'Initial',
    compositionSnapshot: [{ entityId, versionId }],
    dependencyWarnings: [{ code: 'WARN', message: 'watch' }],
    supersededReleaseId: null,
    rollbackSourceVersionId: null,
  });
  assert.throws(() => {
    ((releaseEntry.metadata.compositionSnapshot as unknown[]) ?? []).push('mutate');
  });
});

test('draft creation and version creation stay tenant-scoped and retain immutable snapshots', () => {
  const draftRecord: AuditRecordEvent = {
    id: 'evt-4',
    eventType: 'content_draft_created',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.CreateVersion,
    targetEntityType: 'Algorithm',
    targetEntityId: entityId,
    versionId,
    initialSnapshot: { title: 'Draft' },
    rationale: 'Initial authoring',
  };
  const versionRecord: AuditRecordEvent = {
    id: 'evt-5',
    eventType: 'version_creation',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.CreateVersion,
    targetEntityType: 'ContentPackage',
    targetEntityId: packageId,
    versionId: 'pkg-ver-2' as VersionId,
    versionNumber: 2,
    predecessorVersionId: 'pkg-ver-1' as VersionId,
    changeReason: 'Scope expansion',
    snapshot: { targetScope: { scopeLevel: 'Organization' } },
  };

  const draftEvent = stampAuditEventForPersistence(draftRecord, '2026-03-27T09:15:00.000Z');
  const versionEvent = stampAuditEventForPersistence(versionRecord, '2026-03-27T09:20:00.000Z');

  const draftEntry = createAuditLogEntry(draftEvent);
  const versionEntry = createAuditLogEntry(versionEvent);

  assert.equal(draftEntry.organizationId, organizationId);
  assert.equal(versionEntry.organizationId, organizationId);
  assert.deepEqual(draftEntry.metadata, {
    versionId,
    initialSnapshot: { title: 'Draft' },
  });
  assert.deepEqual(versionEntry.metadata, {
    versionId: 'pkg-ver-2',
    versionNumber: 2,
    predecessorVersionId: 'pkg-ver-1',
    changeReason: 'Scope expansion',
    snapshot: { targetScope: { scopeLevel: 'Organization' } },
  });
});

test('audit query options validate ranges and tenant context explicitly', () => {
  const options = createAuditQueryOptions({
    from: '2026-03-27T09:00:00.000Z',
    to: '2026-03-27T10:00:00.000Z',
    eventType: 'lifecycle',
    operation: AuditOperation.Submit,
    limit: 50,
    offset: 0,
  });

  assert.deepEqual(options, {
    from: '2026-03-27T09:00:00.000Z',
    to: '2026-03-27T10:00:00.000Z',
    eventType: 'lifecycle',
    operation: 'submit',
    limit: 50,
    offset: 0,
  });
  assert.equal(requireAuditOrganizationId(organizationId), organizationId);
  assert.throws(
    () => requireAuditOrganizationId(undefined),
    (error) => error instanceof TenantIsolationViolation,
  );
  assert.throws(
    () => createAuditQueryOptions({ from: '2026-03-28T00:00:00.000Z', to: '2026-03-27T00:00:00.000Z' }),
    (error) => error instanceof DomainError && error.code === 'DATA_INTEGRITY_VIOLATION',
  );
  assert.throws(
    () => createAuditQueryOptions({ eventType: '   ' }),
    (error) => error instanceof DomainError && error.code === 'DATA_INTEGRITY_VIOLATION',
  );
});

test('stampAuditEventForPersistence rejects invalid timestamps', () => {
  const record: AuditRecordEvent = {
    id: 'evt-x',
    eventType: 'lifecycle',
    organizationId,
    actorUserId,
    actorRoleId,
    operation: AuditOperation.Submit,
    targetEntityType: 'Algorithm',
    targetEntityId: entityId,
    fromState: 'Draft',
    toState: 'InReview',
    capability: 'content.submit',
    rationale: 'x',
  };

  assert.throws(
    () => stampAuditEventForPersistence(record, ''),
    (error) => error instanceof DomainError && error.code === 'DATA_INTEGRITY_VIOLATION',
  );
  assert.throws(
    () => stampAuditEventForPersistence(record, 'not-a-date'),
    (error) => error instanceof DomainError && error.code === 'DATA_INTEGRITY_VIOLATION',
  );
});

test('audit entry organization mismatches are rejected', () => {
  assert.throws(
    () => assertAuditEntryOrganization(organizationId, 'org-other' as OrgId),
    (error) => error instanceof TenantIsolationViolation,
  );
});

test('audit foundation uses only shared-layer imports and append-only port contracts', () => {
  const writerSource = readFileSync(
    join(process.cwd(), 'src/audit/ports/IAuditWriter.ts'),
    'utf8',
  );
  const readerSource = readFileSync(
    join(process.cwd(), 'src/audit/ports/IAuditReader.ts'),
    'utf8',
  );
  const modelSource = readFileSync(
    join(process.cwd(), 'src/audit/model/AuditLogEntry.ts'),
    'utf8',
  );
  const querySource = readFileSync(
    join(process.cwd(), 'src/audit/model/AuditQueryOptions.ts'),
    'utf8',
  );
  const stampSource = readFileSync(
    join(process.cwd(), 'src/audit/stampAuditEventForPersistence.ts'),
    'utf8',
  );
  const auditIndex = readFileSync(
    join(process.cwd(), 'src/audit/index.ts'),
    'utf8',
  );

  const combined = `${writerSource}\n${readerSource}\n${modelSource}\n${querySource}\n${stampSource}`;

  assert.doesNotMatch(
    combined,
    /from ['"]\.\.\/\.\.\/(lifecycle|governance|release|content|versioning|tenant|lookup)\//,
  );
  assert.doesNotMatch(combined, /common\/ids|common\\/);
  assert.match(auditIndex, /export \* from '\.\/ports';/);
  assert.match(auditIndex, /export \* from '\.\/model';/);
  assert.doesNotMatch(writerSource, /update\(|delete\(/);
  assert.match(writerSource, /AuditRecordEvent/);
});
