"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const types_1 = require("./types");
const errors_1 = require("./errors");
(0, node_test_1.default)('DomainDenial is a value type and not an Error', () => {
    const denial = new errors_1.DomainDenial(types_1.DenyReason.CROSS_TENANT_ACCESS_DENIED, { actorOrgId: 'org-2' }, 'org-1');
    strict_1.default.equal(denial.type, 'DOMAIN_DENIAL');
    strict_1.default.equal(denial.denyReason, types_1.DenyReason.CROSS_TENANT_ACCESS_DENIED);
    strict_1.default.equal(denial.organizationId, 'org-1');
    strict_1.default.deepEqual(denial.context, { actorOrgId: 'org-2' });
    strict_1.default.equal(denial instanceof Error, false);
});
(0, node_test_1.default)('DomainError is an Error with stable code and frozen context', () => {
    const error = new errors_1.DomainError('TEST_CODE', 'test message', { entityId: 'alg-1' });
    strict_1.default.equal(error.type, 'DOMAIN_ERROR');
    strict_1.default.equal(error.code, 'TEST_CODE');
    strict_1.default.equal(error.message, 'test message');
    strict_1.default.equal(error instanceof Error, true);
    strict_1.default.deepEqual(error.context, { entityId: 'alg-1' });
    strict_1.default.throws(() => {
        error.context.extra = true;
    });
});
(0, node_test_1.default)('specialized domain errors keep the canonical technical error codes', () => {
    const tenantViolation = new errors_1.TenantIsolationViolation('cross-tenant reference');
    const auditFailure = new errors_1.AuditWriteFailure('alg-1', 'release');
    const integrityViolation = new errors_1.DataIntegrityViolation('broken lineage');
    strict_1.default.equal(tenantViolation.code, 'TENANT_ISOLATION_VIOLATION');
    strict_1.default.equal(auditFailure.code, 'AUDIT_WRITE_FAILURE');
    strict_1.default.equal(integrityViolation.code, 'DATA_INTEGRITY_VIOLATION');
    strict_1.default.match(auditFailure.message, /release/);
    strict_1.default.match(auditFailure.message, /alg-1/);
});
