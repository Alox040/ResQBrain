import assert from 'node:assert/strict';
import test from 'node:test';
import { ScopeLevel } from '../tenant/entities';
import { LineageState, ReleaseType, createCompositionEntry, createContentEntityVersion, createContentPackageVersion, createReleaseVersion, withAdditionalContentEntityLineageStates, } from './entities';
const orgA = 'org-A';
const orgB = 'org-B';
const authorRoleId = 'role-author';
const releaserRoleId = 'role-releaser';
const entityId = 'alg-1';
const secondEntityId = 'alg-2';
const packageId = 'pkg-1';
test('INV-C-03/04/05/12: lineage is contiguous, same-org, same-entity, and monotonically increasing', () => {
    const v1 = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    const v2 = createContentEntityVersion({
        id: 'ver-2',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T09:00:00.000Z'),
        createdBy: authorRoleId,
        changeReason: 'Adjusted dosage guidance',
        predecessor: {
            id: v1.id,
            organizationId: v1.organizationId,
            entityId: v1.entityId,
            entityType: v1.entityType,
            versionNumber: v1.versionNumber,
        },
        snapshot: { title: 'v2' },
    });
    const v3 = createContentEntityVersion({
        id: 'ver-3',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T10:00:00.000Z'),
        createdBy: authorRoleId,
        changeReason: 'Clarified protocol step',
        predecessor: {
            id: v2.id,
            organizationId: v2.organizationId,
            entityId: v2.entityId,
            entityType: v2.entityType,
            versionNumber: v2.versionNumber,
        },
        snapshot: { title: 'v3' },
    });
    const versions = new Map([
        [v1.id, { predecessorVersionId: v1.predecessorVersionId }],
        [v2.id, { predecessorVersionId: v2.predecessorVersionId }],
        [v3.id, { predecessorVersionId: v3.predecessorVersionId }],
    ]);
    const traversed = [];
    let cursor = v3.id;
    while (cursor != null) {
        traversed.push(cursor);
        cursor = versions.get(cursor)?.predecessorVersionId ?? null;
    }
    assert.equal(v1.versionNumber, 1);
    assert.equal(v2.versionNumber, 2);
    assert.equal(v3.versionNumber, 3);
    assert.equal(v1.predecessorVersionId, null);
    assert.equal(v2.predecessorVersionId, v1.id);
    assert.equal(v3.predecessorVersionId, v2.id);
    assert.deepEqual(traversed, [v3.id, v2.id, v1.id]);
});
test('T-VER-03/T-VER-11: predecessorVersionId rejects cross-org and cross-entity lineage', () => {
    const predecessor = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    assert.throws(() => {
        createContentEntityVersion({
            id: 'ver-2',
            organizationId: orgB,
            entityId,
            entityType: 'Algorithm',
            createdAt: new Date('2026-03-25T09:00:00.000Z'),
            createdBy: authorRoleId,
            changeReason: 'Cross-org attempt',
            predecessor: {
                id: predecessor.id,
                organizationId: predecessor.organizationId,
                entityId: predecessor.entityId,
                entityType: predecessor.entityType,
                versionNumber: predecessor.versionNumber,
            },
            snapshot: { title: 'invalid' },
        });
    });
    assert.throws(() => {
        createContentEntityVersion({
            id: 'ver-3',
            organizationId: orgA,
            entityId: secondEntityId,
            entityType: 'Algorithm',
            createdAt: new Date('2026-03-25T09:00:00.000Z'),
            createdBy: authorRoleId,
            changeReason: 'Cross-entity attempt',
            predecessor: {
                id: predecessor.id,
                organizationId: predecessor.organizationId,
                entityId: predecessor.entityId,
                entityType: predecessor.entityType,
                versionNumber: predecessor.versionNumber,
            },
            snapshot: { title: 'invalid' },
        });
    });
});
test('T-VER-04: changeReason is mandatory from version 2 onward', () => {
    const v1 = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    assert.equal(v1.changeReason, null);
    assert.throws(() => {
        createContentEntityVersion({
            id: 'ver-2',
            organizationId: orgA,
            entityId,
            entityType: 'Algorithm',
            createdAt: new Date('2026-03-25T09:00:00.000Z'),
            createdBy: authorRoleId,
            predecessor: {
                id: v1.id,
                organizationId: v1.organizationId,
                entityId: v1.entityId,
                entityType: v1.entityType,
                versionNumber: v1.versionNumber,
            },
            snapshot: { title: 'v2' },
        });
    });
});
test('VR-04 foundation guard: branching predecessors are rejected in Phase 0', () => {
    const predecessor = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    assert.throws(() => {
        createContentEntityVersion({
            id: 'ver-2',
            organizationId: orgA,
            entityId,
            entityType: 'Algorithm',
            createdAt: new Date('2026-03-25T09:00:00.000Z'),
            createdBy: authorRoleId,
            changeReason: 'Fork attempt',
            predecessor: {
                id: predecessor.id,
                organizationId: predecessor.organizationId,
                entityId: predecessor.entityId,
                entityType: predecessor.entityType,
                versionNumber: predecessor.versionNumber,
                hasSuccessor: true,
            },
            snapshot: { title: 'invalid' },
        });
    });
});
test('VR-06: implicit latest references are rejected', () => {
    assert.throws(() => {
        createCompositionEntry({
            entityId,
            versionId: 'latest',
            entityType: 'Algorithm',
        });
    });
});
test('INV-C-06/11: package and release snapshots are copied, frozen, and detached from source arrays', () => {
    const compositionSource = [
        createCompositionEntry({
            entityId,
            versionId: 'ver-1',
            entityType: 'Algorithm',
        }),
    ];
    const packageVersion = createContentPackageVersion({
        id: 'pkg-ver-1',
        organizationId: orgA,
        packageId,
        createdAt: new Date('2026-03-25T09:00:00.000Z'),
        createdBy: authorRoleId,
        composition: compositionSource,
        targetScope: { scopeLevel: ScopeLevel.ORGANIZATION },
    });
    const release = createReleaseVersion({
        id: 'rel-1',
        organizationId: orgA,
        packageVersionId: packageVersion.id,
        packageId,
        releasedAt: new Date('2026-03-25T10:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: packageVersion.targetScope,
        releaseType: ReleaseType.INITIAL,
        compositionSnapshot: packageVersion.composition,
    });
    compositionSource.push(createCompositionEntry({
        entityId: secondEntityId,
        versionId: 'ver-2',
        entityType: 'Algorithm',
    }));
    assert.equal(packageVersion.composition.length, 1);
    assert.equal(release.compositionSnapshot.length, 1);
    assert.notEqual(release.compositionSnapshot, packageVersion.composition);
    assert.throws(() => {
        release.compositionSnapshot.push(createCompositionEntry({
            entityId: secondEntityId,
            versionId: 'ver-3',
            entityType: 'Algorithm',
        }));
    });
});
test('INV-C-02/09/10: lineage states remain additive and rollback uses a fresh record', () => {
    const entityVersion = createContentEntityVersion({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    const releasedEntityVersion = withAdditionalContentEntityLineageStates(entityVersion, [LineageState.RELEASED, LineageState.DEPRECATED]);
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
                versionId: entityVersion.id,
                entityType: 'Algorithm',
            }),
        ],
    });
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
                versionId: entityVersion.id,
                entityType: 'Algorithm',
            }),
        ],
    });
    assert.equal(releasedEntityVersion.lineageState.has(LineageState.ACTIVE), true);
    assert.equal(releasedEntityVersion.lineageState.has(LineageState.RELEASED), true);
    assert.equal(releasedEntityVersion.lineageState.has(LineageState.DEPRECATED), true);
    assert.equal(activeRelease.id, 'rel-1');
    assert.equal(rollbackRelease.id, 'rel-2');
    assert.equal(rollbackRelease.rollbackSourceVersionId, 'pkg-ver-1');
});
