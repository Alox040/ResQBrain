import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { ScopeLevel } from '../tenant/entities';
import { LineageState, ReleaseStatus, ReleaseType, createCompositionEntry, createContentEntityVersion, createContentPackageVersion, createReleaseVersion, markReleaseVersionSuperseded, withAdditionalContentEntityLineageStates, } from './entities';
const orgA = 'org-A';
const orgB = 'org-B';
const authorRoleId = 'role-author';
const releaserRoleId = 'role-releaser';
const entityId = 'alg-1';
const packageId = 'pkg-1';
test('G1-07/T-VER-01: ContentEntityVersion is write-once and snapshot is a deep immutable copy', () => {
    const originalSnapshot = {
        title: 'Initial',
        nested: { dosage: '10mg' },
    };
    const version = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: originalSnapshot,
    });
    originalSnapshot.title = 'Changed later';
    originalSnapshot.nested.dosage = '20mg';
    assert.equal(version.snapshot.title, 'Initial');
    assert.deepEqual(version.snapshot.nested, { dosage: '10mg' });
    assert.throws(() => {
        version.versionNumber = 2;
    });
    assert.throws(() => {
        version.snapshot.title = 'mutated';
    });
    assert.throws(() => {
        (version.snapshot.nested).dosage = 'mutated';
    });
});
test('G1-08/T-VER-08: lineageState can only be extended additively', () => {
    const version = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'Initial' },
    });
    const released = withAdditionalContentEntityLineageStates(version, [
        LineageState.RELEASED,
    ]);
    const superseded = withAdditionalContentEntityLineageStates(released, [
        LineageState.SUPERSEDED,
    ]);
    assert.equal(version.lineageState.has(LineageState.RELEASED), false);
    assert.equal(released.lineageState.has(LineageState.ACTIVE), true);
    assert.equal(released.lineageState.has(LineageState.RELEASED), true);
    assert.equal(superseded.lineageState.has(LineageState.RELEASED), true);
    assert.equal(superseded.lineageState.has(LineageState.SUPERSEDED), true);
});
test('G1-10/T-VER-10: ContentPackageVersion freezes composition after write', () => {
    const compositionSource = [
        createCompositionEntry({
            entityId,
            versionId: 'ver-1',
            entityType: 'Algorithm',
        }),
    ];
    const version = createContentPackageVersion({
        id: 'pkg-ver-1',
        organizationId: orgA,
        packageId,
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        composition: compositionSource,
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    });
    compositionSource.push(createCompositionEntry({
        entityId: 'alg-2',
        versionId: 'ver-2',
        entityType: 'Algorithm',
    }));
    assert.equal(version.composition.length, 1);
    assert.throws(() => {
        version.composition.push(createCompositionEntry({
            entityId: 'alg-3',
            versionId: 'ver-3',
            entityType: 'Algorithm',
        }));
    });
});
test('T-VER-07: rollback is represented as a new ReleaseVersion record', () => {
    const activeRelease = createReleaseVersion({
        id: 'rel-1',
        organizationId: orgA,
        packageVersionId: 'pkg-ver-2',
        packageId,
        releasedAt: new Date('2026-03-25T09:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        releaseType: ReleaseType.INITIAL,
        compositionSnapshot: [
            createCompositionEntry({
                entityId,
                versionId: 'ver-2',
                entityType: 'Algorithm',
            }),
        ],
    });
    const supersededRelease = markReleaseVersionSuperseded(activeRelease);
    const rollbackRelease = createReleaseVersion({
        id: 'rel-2',
        organizationId: orgA,
        packageVersionId: 'pkg-ver-1',
        packageId,
        releasedAt: new Date('2026-03-25T10:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
        releaseType: ReleaseType.ROLLBACK,
        supersededReleaseId: activeRelease.id,
        rollbackSourceVersionId: 'pkg-ver-1',
        compositionSnapshot: [
            createCompositionEntry({
                entityId,
                versionId: 'ver-1',
                entityType: 'Algorithm',
            }),
        ],
    });
    assert.equal(activeRelease.status, ReleaseStatus.ACTIVE);
    assert.equal(supersededRelease.status, ReleaseStatus.SUPERSEDED);
    assert.notEqual(rollbackRelease.id, activeRelease.id);
    assert.equal(rollbackRelease.releaseType, ReleaseType.ROLLBACK);
    assert.equal(rollbackRelease.supersededReleaseId, activeRelease.id);
});
test('implementation constraint: versioning foundation uses no common/* imports', () => {
    const versioningFiles = [
        'entities/EntityType.ts',
        'entities/LineageState.ts',
        'entities/ReleaseType.ts',
        'entities/ReleaseStatus.ts',
        'entities/CompositionEntry.ts',
        'entities/ContentEntityVersion.ts',
        'entities/ContentPackageVersion.ts',
        'entities/ReleaseVersion.ts',
    ];
    for (const fileName of versioningFiles) {
        const source = readFileSync(join(process.cwd(), 'packages/domain/src/versioning', fileName), 'utf8');
        assert.equal(/from ['"]\.\.\/\.\.\/common\//.test(source) ||
            /from ['"]\.\.\/common\//.test(source), false, `${fileName} must not import common/*`);
    }
});
function _compileTimeCompositionEntryRequiresVersionId() {
    // @ts-expect-error G1-09: versionId is mandatory
    createCompositionEntry({ entityId, entityType: 'Algorithm' });
}
void _compileTimeCompositionEntryRequiresVersionId;
