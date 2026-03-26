import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { ScopeLevel } from '../tenant/entities';
import { ApprovalStatus, createAlgorithm, createContentPackage, createGuideline, createMedication, createProtocol, createScopeTarget, } from './index';
const orgA = 'org-A';
const orgB = 'org-B';
const versionId = 'ver-1';
const actorRoleId = 'role-1';
test('G1-01: ApprovalStatus remains a value type export, not an entity factory', () => {
    assert.equal(ApprovalStatus.Draft, 'Draft');
    assert.equal(typeof ApprovalStatus, 'object');
    assert.equal('createApprovalStatus' in ApprovalStatus, false);
});
test('G1-02: ContentPackage entity has no composition field', () => {
    const contentPackage = createContentPackage({
        id: 'pkg-1',
        organizationId: orgA,
        title: 'Package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Draft,
        currentVersionId: versionId,
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    assert.equal('composition' in contentPackage, false);
    assert.equal(contentPackage.currentVersionId, versionId);
});
test('G1-03/INV-A-01/INV-A-02: Algorithm identity is immutable and organization-scoped', () => {
    const algorithm = createAlgorithm({
        id: 'alg-1',
        organizationId: orgA,
        title: 'Algorithm',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
    });
    assert.equal(algorithm.organizationId, orgA);
    assert.throws(() => {
        algorithm.organizationId = orgB;
    });
    assert.throws(() => {
        algorithm.id = 'alg-2';
    });
});
test('TI-04/T-CON-05: Algorithm rejects cross-organization references', () => {
    assert.throws(() => createAlgorithm({
        id: 'alg-1',
        organizationId: orgA,
        title: 'Algorithm',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
        decisionLogic: [
            {
                id: 'node-1',
                label: 'Check',
                terminal: true,
                nextNodeIds: [],
                medicationReferences: [
                    {
                        entityId: 'med-1',
                        entityType: 'Medication',
                        organizationId: orgB,
                    },
                ],
            },
        ],
    }), (error) => error instanceof Error &&
        'code' in error &&
        error.code === 'CROSS_TENANT_ACCESS_DENIED');
});
test('TI-04: Protocol and Guideline reject cross-organization references', () => {
    assert.throws(() => createProtocol({
        id: 'proto-1',
        organizationId: orgA,
        title: 'Protocol',
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
        references: [
            {
                entityId: 'alg-1',
                entityType: 'Algorithm',
                organizationId: orgB,
            },
        ],
    }));
    assert.throws(() => createGuideline({
        id: 'guide-1',
        organizationId: orgA,
        title: 'Guideline',
        advisory: false,
        currentVersionId: versionId,
        approvalStatus: ApprovalStatus.Draft,
        references: [
            {
                entityId: 'proto-1',
                entityType: 'Protocol',
                organizationId: orgB,
            },
        ],
    }));
});
test('HC-V-05: content entities reject implicit latest version references', () => {
    assert.throws(() => createMedication({
        id: 'med-1',
        organizationId: orgA,
        title: 'Medication',
        genericName: 'Generic',
        currentVersionId: 'latest',
        approvalStatus: ApprovalStatus.Draft,
    }));
});
test('TI-05 foundation: ScopeTarget enforces explicit target structure', () => {
    const targetScope = createScopeTarget({
        scopeLevel: ScopeLevel.STATION,
        scopeTargetId: 'station-1',
    });
    assert.equal(targetScope.scopeLevel, ScopeLevel.STATION);
    assert.equal(targetScope.scopeTargetId, 'station-1');
    assert.throws(() => createScopeTarget({
        scopeLevel: ScopeLevel.ORGANIZATION,
        scopeTargetId: 'region-1',
    }));
});
test('implementation constraint: content foundation uses no common/*, governance, survey, release or service imports', () => {
    const contentFiles = [
        'entities/ApprovalStatus.ts',
        'entities/ScopeTarget.ts',
        'entities/Algorithm.ts',
        'entities/Medication.ts',
        'entities/Protocol.ts',
        'entities/Guideline.ts',
        'entities/ContentPackage.ts',
    ];
    for (const fileName of contentFiles) {
        const source = readFileSync(join(process.cwd(), 'src/content', fileName), 'utf8');
        assert.equal(/from ['"].*common\//.test(source), false, `${fileName} must not import common/*`);
        assert.equal(/from ['"].*governance\//.test(source), false, `${fileName} must not import governance/*`);
        assert.equal(/from ['"].*survey\//.test(source), false, `${fileName} must not import survey/*`);
        assert.equal(/from ['"].*release\//.test(source), false, `${fileName} must not import release/*`);
        assert.equal(/from ['"].*services\//.test(source), false, `${fileName} must not import service layers`);
    }
});
function _compileTimeContentPackageHasNoCompositionField() {
    const contentPackage = createContentPackage({
        id: 'pkg-2',
        organizationId: orgA,
        title: 'Package',
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        approvalStatus: ApprovalStatus.Draft,
        currentVersionId: versionId,
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: actorRoleId,
    });
    // @ts-expect-error G1-02: composition lives on the version record, not on the entity
    void contentPackage.composition;
}
void _compileTimeContentPackageHasNoCompositionField;
