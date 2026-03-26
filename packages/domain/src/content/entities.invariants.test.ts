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
  createContentPackageDependencyNote,
  createContentPackageVersion,
} from '../versioning';
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
  validateContentPackageAssembly,
  validateContentPackageRelease,
} from './index';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;
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

test('T-CON-12/INV-F-03: package assembly blocks cross-tenant composition entries', () => {
  const contentPackage = createContentPackage({
    id: 'pkg-cross-tenant' as ContentPackageId,
    organizationId: orgA,
    title: 'Cross tenant package',
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    approvalStatus: ApprovalStatus.Draft,
    currentVersionId: 'pkg-ver-cross-tenant' as VersionId,
    createdAt: new Date('2026-03-25T10:00:00.000Z'),
    createdBy: actorRoleId,
  });

  const packageVersion = createContentPackageVersion({
    id: 'pkg-ver-cross-tenant' as VersionId,
    organizationId: orgA,
    packageId: contentPackage.id,
    createdAt: new Date('2026-03-25T10:05:00.000Z'),
    createdBy: actorRoleId,
    composition: [
      {
        entityId: 'alg-cross-tenant' as AlgorithmId,
        versionId: 'alg-ver-1' as VersionId,
        entityType: 'Algorithm',
      },
    ],
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
  });

  const result = validateContentPackageAssembly({
    contentPackage,
    packageVersion,
    resolvedEntries: [
      {
        entry: packageVersion.composition[0],
        versionExists: true,
        entityOrganizationId: orgB,
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.equal(
    result.errors.some((issue) => issue.code === 'CROSS_TENANT_COMPOSITION_ENTRY'),
    true,
  );
});

test('INV-F-09: HardBlock dependencies block release, Warning dependencies do not', () => {
  const warningNote = createContentPackageDependencyNote({
    dependencyType: 'RecommendsAlongside',
    targetEntityType: 'Medication',
    targetEntityId: 'med-sidecar' as MedicationId,
    severity: 'Warning',
    rationale: 'Operationally recommended.',
  });
  const hardBlockNote = createContentPackageDependencyNote({
    dependencyType: 'Conflicts',
    targetEntityType: 'Medication',
    targetEntityId: 'med-conflict' as MedicationId,
    targetVersionId: 'med-ver-2' as VersionId,
    severity: 'HardBlock',
    rationale: 'Clinically incompatible.',
  });

  const contentPackage = createContentPackage({
    id: 'pkg-dependencies' as ContentPackageId,
    organizationId: orgA,
    title: 'Dependency package',
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    approvalStatus: ApprovalStatus.Approved,
    currentVersionId: 'pkg-ver-dependencies' as VersionId,
    createdAt: new Date('2026-03-25T10:00:00.000Z'),
    createdBy: actorRoleId,
  });

  const packageVersion = createContentPackageVersion({
    id: 'pkg-ver-dependencies' as VersionId,
    organizationId: orgA,
    packageId: contentPackage.id,
    createdAt: new Date('2026-03-25T10:05:00.000Z'),
    createdBy: actorRoleId,
    composition: [
      {
        entityId: 'alg-dependency' as AlgorithmId,
        versionId: 'alg-ver-1' as VersionId,
        entityType: 'Algorithm',
      },
    ],
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    dependencyNotes: [warningNote, hardBlockNote],
  });

  const blockedResult = validateContentPackageRelease({
    contentPackage,
    packageVersion,
    resolvedEntries: [
      {
        entry: packageVersion.composition[0],
        versionExists: true,
        entityOrganizationId: orgA,
        entityApprovalStatus: ApprovalStatus.Approved,
        entityCurrentVersionId: packageVersion.composition[0].versionId,
      },
    ],
    dependencyEvaluations: [
      {
        note: warningNote,
        satisfied: false,
        message: 'Recommended companion medication is not active.',
      },
      {
        note: hardBlockNote,
        satisfied: false,
        message: 'Conflicting medication is currently active.',
      },
    ],
  });

  assert.equal(blockedResult.ok, false);
  assert.equal(
    blockedResult.errors.some((issue) => issue.code === 'DEPENDENCY_HARD_BLOCK'),
    true,
  );
  assert.equal(
    blockedResult.warnings.some((issue) => issue.code === 'DEPENDENCY_WARNING'),
    true,
  );

  const warningOnlyVersion = createContentPackageVersion({
    id: 'pkg-ver-warning-only' as VersionId,
    organizationId: orgA,
    packageId: contentPackage.id,
    createdAt: new Date('2026-03-25T10:06:00.000Z'),
    createdBy: actorRoleId,
    composition: packageVersion.composition,
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    predecessor: {
      id: packageVersion.id,
      organizationId: packageVersion.organizationId,
      packageId: packageVersion.packageId,
      versionNumber: packageVersion.versionNumber,
    },
    changeReason: 'Warning-only dependency snapshot',
    dependencyNotes: [warningNote],
  });

  const warningOnlyResult = validateContentPackageRelease({
    contentPackage: createContentPackage({
      ...contentPackage,
      currentVersionId: warningOnlyVersion.id,
    }),
    packageVersion: warningOnlyVersion,
    resolvedEntries: [
      {
        entry: warningOnlyVersion.composition[0],
        versionExists: true,
        entityOrganizationId: orgA,
        entityApprovalStatus: ApprovalStatus.Approved,
        entityCurrentVersionId: warningOnlyVersion.composition[0].versionId,
      },
    ],
    dependencyEvaluations: [
      {
        note: warningNote,
        satisfied: false,
        message: 'Recommended companion medication is not active.',
      },
    ],
  });

  assert.equal(warningOnlyResult.ok, true);
  assert.equal(warningOnlyResult.errors.length, 0);
  assert.equal(warningOnlyResult.warnings.length, 1);
});

test('INV-F-10: Deprecated content is not releasable under the foundation Approved-only rule', () => {
  const contentPackage = createContentPackage({
    id: 'pkg-deprecated' as ContentPackageId,
    organizationId: orgA,
    title: 'Deprecated package',
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    approvalStatus: ApprovalStatus.Approved,
    currentVersionId: 'pkg-ver-deprecated' as VersionId,
    createdAt: new Date('2026-03-25T10:00:00.000Z'),
    createdBy: actorRoleId,
  });

  const packageVersion = createContentPackageVersion({
    id: 'pkg-ver-deprecated' as VersionId,
    organizationId: orgA,
    packageId: contentPackage.id,
    createdAt: new Date('2026-03-25T10:05:00.000Z'),
    createdBy: actorRoleId,
    composition: [
      {
        entityId: 'alg-deprecated' as AlgorithmId,
        versionId: 'alg-ver-1' as VersionId,
        entityType: 'Algorithm',
      },
    ],
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
  });

  const result = validateContentPackageRelease({
    contentPackage,
    packageVersion,
    resolvedEntries: [
      {
        entry: packageVersion.composition[0],
        versionExists: true,
        entityOrganizationId: orgA,
        entityApprovalStatus: ApprovalStatus.Deprecated,
        entityCurrentVersionId: packageVersion.composition[0].versionId,
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.equal(
    result.errors.some((issue) => issue.code === 'COMPOSITION_ENTRY_NOT_APPROVED'),
    true,
  );
});

test('INV-F-05: versionId mismatch is reported as stale at release time', () => {
  const contentPackage = createContentPackage({
    id: 'pkg-stale' as ContentPackageId,
    organizationId: orgA,
    title: 'Stale package',
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    approvalStatus: ApprovalStatus.Approved,
    currentVersionId: 'pkg-ver-stale' as VersionId,
    createdAt: new Date('2026-03-25T10:00:00.000Z'),
    createdBy: actorRoleId,
  });

  const packageVersion = createContentPackageVersion({
    id: 'pkg-ver-stale' as VersionId,
    organizationId: orgA,
    packageId: contentPackage.id,
    createdAt: new Date('2026-03-25T10:05:00.000Z'),
    createdBy: actorRoleId,
    composition: [
      {
        entityId: 'alg-stale' as AlgorithmId,
        versionId: 'alg-ver-2' as VersionId,
        entityType: 'Algorithm',
      },
    ],
    targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
  });

  const result = validateContentPackageRelease({
    contentPackage,
    packageVersion,
    resolvedEntries: [
      {
        entry: packageVersion.composition[0],
        versionExists: true,
        entityOrganizationId: orgA,
        entityApprovalStatus: ApprovalStatus.Approved,
        entityCurrentVersionId: 'alg-ver-3' as VersionId,
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.equal(
    result.errors.some((issue) => issue.code === 'COMPOSITION_VERSION_STALE'),
    true,
  );
});
