import test from 'node:test';
import assert from 'node:assert/strict';
import { DenyReason } from './types';
import { AuditWriteFailure, DataIntegrityViolation, DomainDenial, DomainError, TenantIsolationViolation, } from './errors';
test('DomainDenial is a value type and not an Error', () => {
    const denial = new DomainDenial(DenyReason.CROSS_TENANT_ACCESS_DENIED, { actorOrgId: 'org-2' }, 'org-1');
    assert.equal(denial.type, 'DOMAIN_DENIAL');
    assert.equal(denial.denyReason, DenyReason.CROSS_TENANT_ACCESS_DENIED);
    assert.equal(denial.organizationId, 'org-1');
    assert.deepEqual(denial.context, { actorOrgId: 'org-2' });
    assert.equal(denial instanceof Error, false);
});
test('DomainError is an Error with stable code and frozen context', () => {
    const error = new DomainError('TEST_CODE', 'test message', { entityId: 'alg-1' });
    assert.equal(error.type, 'DOMAIN_ERROR');
    assert.equal(error.code, 'TEST_CODE');
    assert.equal(error.message, 'test message');
    assert.equal(error instanceof Error, true);
    assert.deepEqual(error.context, { entityId: 'alg-1' });
    assert.throws(() => {
        error.context.extra = true;
    });
});
test('specialized domain errors keep the canonical technical error codes', () => {
    const tenantViolation = new TenantIsolationViolation('cross-tenant reference');
    const auditFailure = new AuditWriteFailure('alg-1', 'release');
    const integrityViolation = new DataIntegrityViolation('broken lineage');
    assert.equal(tenantViolation.code, 'TENANT_ISOLATION_VIOLATION');
    assert.equal(auditFailure.code, 'AUDIT_WRITE_FAILURE');
    assert.equal(integrityViolation.code, 'DATA_INTEGRITY_VIOLATION');
    assert.match(auditFailure.message, /release/);
    assert.match(auditFailure.message, /alg-1/);
});
