"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = __importDefault(require("node:test"));
const entities_1 = require("../tenant/entities");
const entities_2 = require("./entities");
const orgA = 'org-A';
const orgB = 'org-B';
const authorRoleId = 'role-author';
const releaserRoleId = 'role-releaser';
const entityId = 'alg-1';
const packageId = 'pkg-1';
(0, node_test_1.default)('G1-07/T-VER-01: ContentEntityVersion is write-once and snapshot is a deep immutable copy', () => {
    const originalSnapshot = {
        title: 'Initial',
        nested: { dosage: '10mg' },
    };
    const version = (0, entities_2.createContentEntityVersion)({
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
    strict_1.default.equal(version.snapshot.title, 'Initial');
    strict_1.default.deepEqual(version.snapshot.nested, { dosage: '10mg' });
    strict_1.default.throws(() => {
        version.versionNumber = 2;
    });
    strict_1.default.throws(() => {
        version.snapshot.title = 'mutated';
    });
    strict_1.default.throws(() => {
        (version.snapshot.nested).dosage = 'mutated';
    });
});
(0, node_test_1.default)('G1-08/T-VER-08: lineageState can only be extended additively', () => {
    const version = (0, entities_2.createContentEntityVersion)({
        id: 'ver-1',
        organizationId: orgA,
        entityId,
        entityType: 'Algorithm',
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        snapshot: { title: 'Initial' },
    });
    const released = (0, entities_2.withAdditionalContentEntityLineageStates)(version, [
        entities_2.LineageState.RELEASED,
    ]);
    const superseded = (0, entities_2.withAdditionalContentEntityLineageStates)(released, [
        entities_2.LineageState.SUPERSEDED,
    ]);
    strict_1.default.equal(version.lineageState.has(entities_2.LineageState.RELEASED), false);
    strict_1.default.equal(released.lineageState.has(entities_2.LineageState.ACTIVE), true);
    strict_1.default.equal(released.lineageState.has(entities_2.LineageState.RELEASED), true);
    strict_1.default.equal(superseded.lineageState.has(entities_2.LineageState.RELEASED), true);
    strict_1.default.equal(superseded.lineageState.has(entities_2.LineageState.SUPERSEDED), true);
});
(0, node_test_1.default)('G1-10/T-VER-10: ContentPackageVersion freezes composition after write', () => {
    const compositionSource = [
        (0, entities_2.createCompositionEntry)({
            entityId,
            versionId: 'ver-1',
            entityType: 'Algorithm',
        }),
    ];
    const version = (0, entities_2.createContentPackageVersion)({
        id: 'pkg-ver-1',
        organizationId: orgA,
        packageId,
        createdAt: new Date('2026-03-25T08:00:00.000Z'),
        createdBy: authorRoleId,
        composition: compositionSource,
        targetScope: { scopeLevel: entities_1.ScopeLevel.ORGANIZATION },
    });
    compositionSource.push((0, entities_2.createCompositionEntry)({
        entityId: 'alg-2',
        versionId: 'ver-2',
        entityType: 'Algorithm',
    }));
    strict_1.default.equal(version.composition.length, 1);
    strict_1.default.throws(() => {
        version.composition.push((0, entities_2.createCompositionEntry)({
            entityId: 'alg-3',
            versionId: 'ver-3',
            entityType: 'Algorithm',
        }));
    });
});
(0, node_test_1.default)('T-VER-07: rollback is represented as a new ReleaseVersion record', () => {
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
                versionId: 'ver-2',
                entityType: 'Algorithm',
            }),
        ],
    });
    const supersededRelease = (0, entities_2.markReleaseVersionSuperseded)(activeRelease);
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
                versionId: 'ver-1',
                entityType: 'Algorithm',
            }),
        ],
    });
    strict_1.default.equal(activeRelease.status, entities_2.ReleaseStatus.ACTIVE);
    strict_1.default.equal(supersededRelease.status, entities_2.ReleaseStatus.SUPERSEDED);
    strict_1.default.notEqual(rollbackRelease.id, activeRelease.id);
    strict_1.default.equal(rollbackRelease.releaseType, entities_2.ReleaseType.ROLLBACK);
    strict_1.default.equal(rollbackRelease.supersededReleaseId, activeRelease.id);
});
(0, node_test_1.default)('implementation constraint: versioning foundation uses no common/* imports', () => {
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
        const source = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'src/versioning', fileName), 'utf8');
        strict_1.default.equal(/from ['"]\.\.\/\.\.\/common\//.test(source) ||
            /from ['"]\.\.\/common\//.test(source), false, `${fileName} must not import common/*`);
    }
});
function _compileTimeCompositionEntryRequiresVersionId() {
    // @ts-expect-error G1-09: versionId is mandatory
    (0, entities_2.createCompositionEntry)({ entityId, entityType: 'Algorithm' });
}
void _compileTimeCompositionEntryRequiresVersionId;
