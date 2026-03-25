import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  AlgorithmId,
  ContentPackageId,
  GuidelineId,
  MedicationId,
  OrgId,
  ProtocolId,
  UserRoleId,
  VersionId,
} from '../shared/types';
import { ScopeLevel } from '../tenant/entities';
import {
  ApprovalStatus,
  createAlgorithm,
  createContentPackage,
  createGuideline,
  createMedication,
  createProtocol,
  isAlgorithmEditable,
  isAlgorithmImmutable,
  isAlgorithmLocked,
  isAlgorithmStructurallyComplete,
  isContentPackageImmutable,
  isGuidelineStructurallyComplete,
  isMedicationStructurallyComplete,
  isProtocolStructurallyComplete,
} from './index';

const orgA = 'org-A' as OrgId;
const versionId = 'ver-1' as VersionId;
const actorRoleId = 'role-1' as UserRoleId;

test('LC-01/T-CON-01: Algorithm structural completeness detects dangling branches', () => {
  const incomplete = createAlgorithm({
    id: 'alg-1' as AlgorithmId,
    organizationId: orgA,
    title: 'Algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    decisionLogic: [
      {
        id: 'start',
        label: 'Start',
        terminal: false,
        nextNodeIds: ['missing-node'],
        medicationReferences: [],
      },
    ],
  });

  const complete = createAlgorithm({
    id: 'alg-2' as AlgorithmId,
    organizationId: orgA,
    title: 'Algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    decisionLogic: [
      {
        id: 'start',
        label: 'Start',
        terminal: false,
        nextNodeIds: ['finish'],
        medicationReferences: [],
      },
      {
        id: 'finish',
        label: 'Finish',
        terminal: true,
        nextNodeIds: [],
        medicationReferences: [],
      },
    ],
  });

  assert.equal(isAlgorithmStructurallyComplete(incomplete), false);
  assert.equal(isAlgorithmStructurallyComplete(complete), true);
});

test('LC-01/T-CON-02: Medication structural completeness requires route and dose range', () => {
  const incomplete = createMedication({
    id: 'med-1' as MedicationId,
    organizationId: orgA,
    title: 'Medication',
    genericName: 'Generic',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
  });

  const complete = createMedication({
    id: 'med-2' as MedicationId,
    organizationId: orgA,
    title: 'Medication',
    genericName: 'Generic',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    dosageGuidelines: [
      {
        route: 'IV',
        doseRange: '1-2 units',
        weightBased: false,
      },
    ],
  });

  assert.equal(isMedicationStructurallyComplete(incomplete), false);
  assert.equal(isMedicationStructurallyComplete(complete), true);
});

test('LC-01/T-CON-03: Protocol structural completeness requires regulatoryBasis', () => {
  const incomplete = createProtocol({
    id: 'proto-1' as ProtocolId,
    organizationId: orgA,
    title: 'Protocol',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
  });

  const complete = createProtocol({
    id: 'proto-2' as ProtocolId,
    organizationId: orgA,
    title: 'Protocol',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    regulatoryBasis: 'Regulatory source',
  });

  assert.equal(isProtocolStructurallyComplete(incomplete), false);
  assert.equal(isProtocolStructurallyComplete(complete), true);
});

test('LC-01/T-CON-04: Guideline structural completeness requires evidenceBasis', () => {
  const incomplete = createGuideline({
    id: 'guide-1' as GuidelineId,
    organizationId: orgA,
    title: 'Guideline',
    advisory: true,
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
  });

  const complete = createGuideline({
    id: 'guide-2' as GuidelineId,
    organizationId: orgA,
    title: 'Guideline',
    advisory: false,
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    evidenceBasis: 'Evidence declaration',
  });

  assert.equal(isGuidelineStructurallyComplete(incomplete), false);
  assert.equal(isGuidelineStructurallyComplete(complete), true);
});

test('INV-B-01/02/04: content editability and immutability are bound to ApprovalStatus', () => {
  const draftAlgorithm = createAlgorithm({
    id: 'alg-draft' as AlgorithmId,
    organizationId: orgA,
    title: 'Draft algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
  });

  const reviewAlgorithm = createAlgorithm({
    id: 'alg-review' as AlgorithmId,
    organizationId: orgA,
    title: 'Review algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.InReview,
  });

  const releasedAlgorithm = createAlgorithm({
    id: 'alg-released' as AlgorithmId,
    organizationId: orgA,
    title: 'Released algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Released,
  });

  assert.equal(isAlgorithmEditable(draftAlgorithm), true);
  assert.equal(isAlgorithmLocked(draftAlgorithm), false);
  assert.equal(isAlgorithmLocked(reviewAlgorithm), true);
  assert.equal(isAlgorithmImmutable(releasedAlgorithm), true);
});

test('INV-A-06/INV-A-08/HC-V-05: package lifecycle/version binding is immutable and explicit', () => {
  const contentPackage = createContentPackage({
    id: 'pkg-1' as ContentPackageId,
    organizationId: orgA,
    title: 'Package',
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    applicabilityScopes: [
      {
        scopeLevel: ScopeLevel.STATION,
        scopeTargetId: 'station-1' as never,
      } as const,
    ],
    excludedScopes: [
      {
        scopeLevel: ScopeLevel.COUNTY,
        scopeTargetId: 'county-1' as never,
      } as const,
    ],
    approvalStatus: ApprovalStatus.Released,
    currentVersionId: 'pkg-ver-1' as VersionId,
    createdAt: new Date('2026-03-25T10:00:00.000Z'),
    createdBy: actorRoleId,
  });

  assert.equal(isContentPackageImmutable(contentPackage), true);
  assert.throws(() => {
    (contentPackage as { approvalStatus: ApprovalStatus }).approvalStatus =
      ApprovalStatus.Draft;
  });
  assert.throws(() => {
    (
      contentPackage.applicabilityScopes as Array<{
        scopeLevel: ScopeLevel;
        scopeTargetId?: string;
      }>
    ).push({
      scopeLevel: ScopeLevel.REGION,
      scopeTargetId: 'region-1',
    });
  });
});

test('INV-A-06: audit trail is append-only on content entities', () => {
  const algorithm = createAlgorithm({
    id: 'alg-audit' as AlgorithmId,
    organizationId: orgA,
    title: 'Algorithm',
    currentVersionId: versionId,
    approvalStatus: ApprovalStatus.Draft,
    auditTrail: [
      {
        recordedAt: new Date('2026-03-25T11:00:00.000Z'),
        actorRoleId,
        operation: 'create',
        rationale: 'initial draft',
      },
    ],
  });

  assert.throws(() => {
    (
      algorithm.auditTrail as unknown as Array<{
        operation: string;
      }>
    )[0].operation = 'mutated';
  });
});
