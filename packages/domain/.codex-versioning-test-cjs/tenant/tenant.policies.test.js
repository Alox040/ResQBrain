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
(0, node_test_1.default)('validateOrgIdPresent accepts only explicit organizationId values', () => {
    strict_1.default.equal((0, index_1.validateOrgIdPresent)(orgA), orgA);
    strict_1.default.throws(() => (0, index_1.validateOrgIdPresent)(undefined), (error) => error instanceof errors_1.DomainError &&
        error.code === 'MISSING_ORGANIZATION_CONTEXT');
});
(0, node_test_1.default)('assertOrgActive allows only active organizations for writes', () => {
    const active = (0, index_1.createOrganization)({
        id: orgA,
        name: 'Org A',
        slug: 'org-a',
        status: index_1.OrganizationStatus.ACTIVE,
        createdAt: new Date('2026-03-25T00:00:00.000Z'),
    });
    strict_1.default.equal((0, index_1.assertOrgActive)(active), active);
    const suspended = (0, index_1.createOrganization)({
        id: orgB,
        name: 'Org B',
        slug: 'org-b',
        status: index_1.OrganizationStatus.SUSPENDED,
        createdAt: new Date('2026-03-25T00:00:00.000Z'),
    });
    strict_1.default.throws(() => (0, index_1.assertOrgActive)(suspended), (error) => error instanceof errors_1.DomainError &&
        error.code === 'ORGANIZATION_NOT_ACTIVE');
    const decommissioned = (0, index_1.createOrganization)({
        id: 'org-C',
        name: 'Org C',
        slug: 'org-c',
        status: index_1.OrganizationStatus.DECOMMISSIONED,
        createdAt: new Date('2026-03-25T00:00:00.000Z'),
    });
    strict_1.default.throws(() => (0, index_1.assertOrgActive)(decommissioned), (error) => error instanceof errors_1.DomainError &&
        error.code === 'ORGANIZATION_NOT_ACTIVE');
});
(0, node_test_1.default)('assertSameOrg and validateIntraOrgRef deny cross-tenant references', () => {
    strict_1.default.deepEqual((0, index_1.assertSameOrg)({ organizationId: orgA }, { organizationId: orgA }), [{ organizationId: orgA }, { organizationId: orgA }]);
    strict_1.default.throws(() => (0, index_1.validateIntraOrgRef)({ organizationId: orgA }, { organizationId: orgB }), (error) => error instanceof errors_1.TenantIsolationViolation);
});
(0, node_test_1.default)('contentSharingPolicyExists remains disabled in phase 0', () => {
    strict_1.default.equal((0, index_1.contentSharingPolicyExists)(orgA, orgB, 'alg-1'), false);
});
(0, node_test_1.default)('implicit tenant derivation from fallback context is rejected', () => {
    strict_1.default.throws(() => (0, index_1.assertNoImplicitTenantDerivation)(undefined, {
        currentOrg: orgA,
    }), (error) => error instanceof errors_1.DataIntegrityViolation);
});
