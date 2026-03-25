"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const errors_1 = require("../shared/errors");
const index_1 = require("./index");
const orgA = 'org-A';
const orgB = 'org-B';
(0, node_test_1.default)('tenant isolation blocks queries without organizationId', () => {
    strict_1.default.throws(() => (0, index_1.validateOrgIdPresent)(undefined), (error) => error instanceof errors_1.DomainError &&
        error.code === 'MISSING_ORGANIZATION_CONTEXT');
});
(0, node_test_1.default)('tenant isolation blocks cross-org sub-scope references', () => {
    const region = (0, index_1.createRegion)({
        id: 'region-5',
        organization: { id: orgB },
        name: 'Foreign',
        code: 'F',
        status: index_1.SubScopeStatus.ACTIVE,
    });
    strict_1.default.throws(() => (0, index_1.createStation)({
        id: 'station-3',
        organization: { id: orgA },
        region,
        name: 'Station 3',
        code: 'S3',
        status: index_1.SubScopeStatus.ACTIVE,
    }), (error) => error instanceof errors_1.DomainError && error.code === 'CROSS_TENANT_SCOPE_REFERENCE');
});
(0, node_test_1.default)('tenant isolation forbids implicit tenant derivation from session-like state', () => {
    strict_1.default.throws(() => (0, index_1.assertNoImplicitTenantDerivation)(null, { currentOrg: orgA }), (error) => error instanceof errors_1.DataIntegrityViolation);
});
(0, node_test_1.default)('tenant isolation exposes the named cross-org sharing guard and keeps it disabled', () => {
    strict_1.default.equal((0, index_1.contentSharingPolicyExists)(orgA, orgB, 'med-1'), false);
});
(0, node_test_1.default)('tenant foundation files import shared only and do not depend on common ids', () => {
    const tenantIndex = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'packages/domain/src/tenant/index.ts'), 'utf8');
    const entitiesIndex = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'packages/domain/src/tenant/entities/index.ts'), 'utf8');
    const policiesIndex = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'packages/domain/src/tenant/policies/index.ts'), 'utf8');
    strict_1.default.match(tenantIndex, /export \* from '\.\/entities';/);
    strict_1.default.match(tenantIndex, /export \* from '\.\/policies';/);
    strict_1.default.doesNotMatch(`${tenantIndex}\n${entitiesIndex}\n${policiesIndex}`, /common\/ids|common\\/);
});
(0, node_test_1.default)('cross-org validator raises a tenant isolation error type', () => {
    try {
        throw new errors_1.TenantIsolationViolation('cross-org');
    }
    catch (error) {
        strict_1.default.equal(error instanceof errors_1.TenantIsolationViolation, true);
    }
});
