import assert from 'node:assert/strict';
import test from 'node:test';
import { ScopeLevel } from '../tenant/entities';
import { createContentPackageDependencyNote, createContentPackageVersion, } from '../versioning';
import { ApprovalStatus, createAlgorithm, createContentPackage, createGuideline, createMedication, createProtocol, isAlgorithmEditable, isAlgorithmImmutable, isAlgorithmLocked, isAlgorithmStructurallyComplete, isContentPackageImmutable, isGuidelineStructurallyComplete, isMedicationStructurallyComplete, isProtocolStructurallyComplete, validateContentPackageAssembly, validateContentPackageRelease, } from './index';
const orgA = 'org-A';
const orgB = 'org-B';
const versionId = 'ver-1';
const actorRoleId = 'role-1';
test('LC-01/T-CON-01: Algorithm structural completeness detects dangling branches', () => {
    const incomplete = createAlgorithm({
        id: 'alg-1',
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
        id: 'alg-2',
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
        id: 'med-1',
        organizationId: orgA,
        title: 'Medication',
        genericName: 'Generic',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
    });
    const complete = createMedication({
        id: 'med-2',
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
        id: 'proto-1',
        organizationId: orgA,
        title: 'Protocol',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
    });
    const complete = createProtocol({
        id: 'proto-2',
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
        id: 'guide-1',
        organizationId: orgA,
        title: 'Guideline',
        advisory: true,
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
    });
    const complete = createGuideline({
        id: 'guide-2',
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
        id: 'alg-draft',
        organizationId: orgA,
        title: 'Draft algorithm',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
    });
    const reviewAlgorithm = createAlgorithm({
        id: 'alg-review',
        organizationId: orgA,
        title: 'Review algorithm',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.InReview,
    });
    const releasedAlgorithm = createAlgorithm({
        id: 'alg-released',
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
        id: 'pkg-1',
        organizationId: orgA,
        title: 'Package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        applicabilityScopes: [
            {
                scopeLevel: ScopeLevel.STATION,
                scopeTargetId: 'station-1',
            },
        ],
        excludedScopes: [
            {
                scopeLevel: ScopeLevel.COUNTY,
                scopeTargetId: 'county-1',
            },
        ],
        approvalStatus: ApprovalStatus.Released,
        currentVersionId: 'pkg-ver-1',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    assert.equal(isContentPackageImmutable(contentPackage), true);
    assert.throws(() => {
        contentPackage.approvalStatus =
            ApprovalStatus.Draft;
    });
    assert.throws(() => {
        contentPackage.applicabilityScopes.push({
            scopeLevel: ScopeLevel.REGION,
            scopeTargetId: 'region-1',
        });
    });
});
test('INV-A-06: audit trail is append-only on content entities', () => {
    const algorithm = createAlgorithm({
        id: 'alg-audit',
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
        algorithm.auditTrail[0].operation = 'mutated';
    });
});
test('T-CON-12/INV-F-03: package assembly blocks cross-tenant composition entries', () => {
    const contentPackage = createContentPackage({
        id: 'pkg-cross-tenant',
        organizationId: orgA,
        title: 'Cross tenant package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Draft,
        currentVersionId: 'pkg-ver-cross-tenant',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    const packageVersion = createContentPackageVersion({
        id: 'pkg-ver-cross-tenant',
        organizationId: orgA,
        packageId: contentPackage.id,
        createdAt: new Date('2026-03-25T10:05:00.000Z'),
        createdBy: actorRoleId,
        composition: [
            {
                entityId: 'alg-cross-tenant',
                versionId: 'alg-ver-1',
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
    assert.equal(result.errors.some((issue) => issue.code === 'CROSS_TENANT_COMPOSITION_ENTRY'), true);
});
test('INV-F-09: HardBlock dependencies block release, Warning dependencies do not', () => {
    const warningNote = createContentPackageDependencyNote({
        dependencyType: 'RecommendsAlongside',
        targetEntityType: 'Medication',
        targetEntityId: 'med-sidecar',
        severity: 'Warning',
        rationale: 'Operationally recommended.',
    });
    const hardBlockNote = createContentPackageDependencyNote({
        dependencyType: 'Conflicts',
        targetEntityType: 'Medication',
        targetEntityId: 'med-conflict',
        targetVersionId: 'med-ver-2',
        severity: 'HardBlock',
        rationale: 'Clinically incompatible.',
    });
    const contentPackage = createContentPackage({
        id: 'pkg-dependencies',
        organizationId: orgA,
        title: 'Dependency package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Approved,
        currentVersionId: 'pkg-ver-dependencies',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    const packageVersion = createContentPackageVersion({
        id: 'pkg-ver-dependencies',
        organizationId: orgA,
        packageId: contentPackage.id,
        createdAt: new Date('2026-03-25T10:05:00.000Z'),
        createdBy: actorRoleId,
        composition: [
            {
                entityId: 'alg-dependency',
                versionId: 'alg-ver-1',
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
    assert.equal(blockedResult.errors.some((issue) => issue.code === 'DEPENDENCY_HARD_BLOCK'), true);
    assert.equal(blockedResult.warnings.some((issue) => issue.code === 'DEPENDENCY_WARNING'), true);
    const warningOnlyVersion = createContentPackageVersion({
        id: 'pkg-ver-warning-only',
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
        id: 'pkg-deprecated',
        organizationId: orgA,
        title: 'Deprecated package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Approved,
        currentVersionId: 'pkg-ver-deprecated',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    const packageVersion = createContentPackageVersion({
        id: 'pkg-ver-deprecated',
        organizationId: orgA,
        packageId: contentPackage.id,
        createdAt: new Date('2026-03-25T10:05:00.000Z'),
        createdBy: actorRoleId,
        composition: [
            {
                entityId: 'alg-deprecated',
                versionId: 'alg-ver-1',
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
    assert.equal(result.errors.some((issue) => issue.code === 'COMPOSITION_ENTRY_NOT_APPROVED'), true);
});
test('INV-F-05: versionId mismatch is reported as stale at release time', () => {
    const contentPackage = createContentPackage({
        id: 'pkg-stale',
        organizationId: orgA,
        title: 'Stale package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Approved,
        currentVersionId: 'pkg-ver-stale',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    const packageVersion = createContentPackageVersion({
        id: 'pkg-ver-stale',
        organizationId: orgA,
        packageId: contentPackage.id,
        createdAt: new Date('2026-03-25T10:05:00.000Z'),
        createdBy: actorRoleId,
        composition: [
            {
                entityId: 'alg-stale',
                versionId: 'alg-ver-2',
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
                entityCurrentVersionId: 'alg-ver-3',
            },
        ],
    });
    assert.equal(result.ok, false);
    assert.equal(result.errors.some((issue) => issue.code === 'COMPOSITION_VERSION_STALE'), true);
});
