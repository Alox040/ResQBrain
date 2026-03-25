"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const errors_1 = require("../shared/errors");
const index_1 = require("./index");
const orgA = 'org-A';
const orgB = 'org-B';
(0, node_test_1.default)('tenant entities keep immutable organization-scoped identity', () => {
    const organization = (0, index_1.createOrganization)({
        id: orgA,
        name: 'Org A',
        slug: 'org-a',
        status: index_1.OrganizationStatus.ACTIVE,
        createdAt: new Date('2026-03-25T00:00:00.000Z'),
        auditTrail: [
            {
                changedAt: new Date('2026-03-25T00:00:00.000Z'),
                changeType: 'created',
                rationale: 'initial import',
            },
        ],
    });
    strict_1.default.equal(organization.id, orgA);
    strict_1.default.throws(() => {
        organization.id = orgB;
    });
    strict_1.default.throws(() => {
        organization.auditTrail[0].rationale = 'mutated';
    });
});
(0, node_test_1.default)('sub-scope entities require an organization parent', () => {
    strict_1.default.throws(() => (0, index_1.createRegion)({
        id: 'region-1',
        organization: { id: '' },
        name: 'North',
        code: 'N',
        status: index_1.SubScopeStatus.ACTIVE,
    }), (error) => error instanceof errors_1.DomainError &&
        error.code === 'MISSING_ORGANIZATION_CONTEXT');
});
(0, node_test_1.default)('county rejects a cross-organization region parent', () => {
    const region = (0, index_1.createRegion)({
        id: 'region-2',
        organization: { id: orgB },
        name: 'West',
        code: 'W',
        status: index_1.SubScopeStatus.ACTIVE,
    });
    strict_1.default.throws(() => (0, index_1.createCounty)({
        id: 'county-1',
        organization: { id: orgA },
        region,
        name: 'County A',
        code: 'CA',
        status: index_1.SubScopeStatus.ACTIVE,
    }), (error) => error instanceof errors_1.DomainError &&
        error.code === 'CROSS_TENANT_SCOPE_REFERENCE');
});
(0, node_test_1.default)('station rejects cross-organization region references', () => {
    const region = (0, index_1.createRegion)({
        id: 'region-3',
        organization: { id: orgB },
        name: 'South',
        code: 'S',
        status: index_1.SubScopeStatus.ACTIVE,
    });
    strict_1.default.throws(() => (0, index_1.createStation)({
        id: 'station-1',
        organization: { id: orgA },
        region,
        name: 'Station 1',
        code: 'S1',
        status: index_1.SubScopeStatus.ACTIVE,
    }), (error) => error instanceof errors_1.DomainError &&
        error.code === 'CROSS_TENANT_SCOPE_REFERENCE');
});
(0, node_test_1.default)('inactive same-org region remains a valid structural parent', () => {
    const region = (0, index_1.createRegion)({
        id: 'region-4',
        organization: { id: orgA },
        name: 'Legacy Region',
        code: 'LR',
        status: index_1.SubScopeStatus.INACTIVE,
    });
    const station = (0, index_1.createStation)({
        id: 'station-2',
        organization: { id: orgA },
        region,
        name: 'Station 2',
        code: 'S2',
        status: index_1.SubScopeStatus.ACTIVE,
    });
    strict_1.default.equal(station.regionId, region.id);
    strict_1.default.equal(station.organizationId, orgA);
});
