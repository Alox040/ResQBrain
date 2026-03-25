"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const entities_1 = require("../tenant/entities");
const entities_2 = require("./entities");
const orgA = 'org-A';
const orgB = 'org-B';
const authorRoleId = 'role-author';
const releaserRoleId = 'role-releaser';
const entityId = 'alg-1';
const secondEntityId = 'alg-2';
const packageId = 'pkg-1';
(0, node_test_1.default)('INV-C-03/04/05/12: lineage is contiguous, same-org, same-entity, and monotonically increasing', () => {
    const v1 = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    const v2 = (0, entities_2.createContentEntityVersion)({
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
    const v3 = (0, entities_2.createContentEntityVersion)({
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
    strict_1.default.equal(v1.versionNumber, 1);
    strict_1.default.equal(v2.versionNumber, 2);
    strict_1.default.equal(v3.versionNumber, 3);
    strict_1.default.equal(v1.predecessorVersionId, null);
    strict_1.default.equal(v2.predecessorVersionId, v1.id);
    strict_1.default.equal(v3.predecessorVersionId, v2.id);
    strict_1.default.deepEqual(traversed, [v3.id, v2.id, v1.id]);
});
(0, node_test_1.default)('T-VER-03/T-VER-11: predecessorVersionId rejects cross-org and cross-entity lineage', () => {
    const predecessor = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    strict_1.default.throws(() => {
        (0, entities_2.createContentEntityVersion)({
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
    strict_1.default.throws(() => {
        (0, entities_2.createContentEntityVersion)({
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
(0, node_test_1.default)('T-VER-04: changeReason is mandatory from version 2 onward', () => {
    const v1 = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    strict_1.default.equal(v1.changeReason, null);
    strict_1.default.throws(() => {
        (0, entities_2.createContentEntityVersion)({
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
(0, node_test_1.default)('VR-04 foundation guard: branching predecessors are rejected in Phase 0', () => {
    const predecessor = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    strict_1.default.throws(() => {
        (0, entities_2.createContentEntityVersion)({
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
(0, node_test_1.default)('VR-06: implicit latest references are rejected', () => {
    strict_1.default.throws(() => {
        (0, entities_2.createCompositionEntry)({
            entityId,
            versionId: 'latest',
            entityType: 'Algorithm',
        });
    });
});
(0, node_test_1.default)('INV-C-06/11: package and release snapshots are copied, frozen, and detached from source arrays', () => {
    const compositionSource = [
        (0, entities_2.createCompositionEntry)({
            entityId,
            versionId: 'ver-1',
            entityType: 'Algorithm',
        }),
    ];
    const packageVersion = (0, entities_2.createContentPackageVersion)({
        id: 'pkg-ver-1',
        organizationId: orgA,
        packageId,
        createdAt: new Date('2026-03-25T09:00:00.000Z'),
        createdBy: authorRoleId,
        composition: compositionSource,
        targetScope: { scopeLevel: entities_1.ScopeLevel.ORGANIZATION },
    });
    const release = (0, entities_2.createReleaseVersion)({
        id: 'rel-1',
        organizationId: orgA,
        packageVersionId: packageVersion.id,
        packageId,
        releasedAt: new Date('2026-03-25T10:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: packageVersion.targetScope,
        releaseType: entities_2.ReleaseType.INITIAL,
        compositionSnapshot: packageVersion.composition,
    });
    compositionSource.push((0, entities_2.createCompositionEntry)({
        entityId: secondEntityId,
        versionId: 'ver-2',
        entityType: 'Algorithm',
    }));
    strict_1.default.equal(packageVersion.composition.length, 1);
    strict_1.default.equal(release.compositionSnapshot.length, 1);
    strict_1.default.notEqual(release.compositionSnapshot, packageVersion.composition);
    strict_1.default.throws(() => {
        release.compositionSnapshot.push((0, entities_2.createCompositionEntry)({
            entityId: secondEntityId,
            versionId: 'ver-3',
            entityType: 'Algorithm',
        }));
    });
});
(0, node_test_1.default)('INV-C-02/09/10: lineage states remain additive and rollback uses a fresh record', () => {
    const entityVersion = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'v1' },
    });
    const releasedEntityVersion = (0, entities_2.withAdditionalContentEntityLineageStates)(entityVersion, [entities_2.LineageState.RELEASED, entities_2.LineageState.DEPRECATED]);
    const activeRelease = (0, entities_2.createReleaseVersion)({
        id: 'rel-1',
        organizationId: orgA,
        packageVersionId: 'pkg-ver-2',
        packageId,
        releasedAt: new Date('2026-03-25T09:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: { scopeLevel: entities_1.ScopeLevel.ORGANIZATION },
        releaseType: entities_2.ReleaseType.INITIAL,
        compositionSnapshot: [
            (0, entities_2.createCompositionEntry)({
                entityId,
                versionId: entityVersion.id,
                entityType: 'Algorithm',
            }),
        ],
    });
    const rollbackRelease = (0, entities_2.createReleaseVersion)({
        id: 'rel-2',
        organizationId: orgA,
        packageVersionId: 'pkg-ver-1',
        packageId,
        releasedAt: new Date('2026-03-25T10:00:00.000Z'),
        releasedBy: releaserRoleId,
        targetScope: { scopeLevel: entities_1.ScopeLevel.ORGANIZATION },
        releaseType: entities_2.ReleaseType.ROLLBACK,
        supersededReleaseId: activeRelease.id,
        rollbackSourceVersionId: 'pkg-ver-1',
        compositionSnapshot: [
            (0, entities_2.createCompositionEntry)({
                entityId,
                versionId: entityVersion.id,
                entityType: 'Algorithm',
            }),
        ],
    });
    strict_1.default.equal(releasedEntityVersion.lineageState.has(entities_2.LineageState.ACTIVE), true);
    strict_1.default.equal(releasedEntityVersion.lineageState.has(entities_2.LineageState.RELEASED), true);
    strict_1.default.equal(releasedEntityVersion.lineageState.has(entities_2.LineageState.DEPRECATED), true);
    strict_1.default.equal(activeRelease.id, 'rel-1');
    strict_1.default.equal(rollbackRelease.id, 'rel-2');
    strict_1.default.equal(rollbackRelease.rollbackSourceVersionId, 'pkg-ver-1');
});
