import test from 'node:test';
import assert from 'node:assert/strict';
import { DenyReason, allow, deny } from './types';
test('allow() returns an allowed PolicyDecision with immutable warnings and context', () => {
    const warnings = [{ code: 'WARN', message: 'non-blocking' }];
    const decision = allow({
        warnings,
        context: { organizationId: 'org-1' },
    });
    assert.equal(decision.allowed, true);
    assert.equal(decision.denyReason, undefined);
    assert.deepEqual(decision.warnings, warnings);
    assert.deepEqual(decision.context, { organizationId: 'org-1' });
    assert.throws(() => {
        decision.warnings.push({ code: 'MUTATE', message: 'fail' });
    });
    assert.throws(() => {
        decision.context.extra = true;
    });
});
test('deny(reason) returns a denied PolicyDecision with canonical reason and empty warnings', () => {
    const decision = deny(DenyReason.CAPABILITY_NOT_GRANTED, { capability: 'package.release' });
    assert.equal(decision.allowed, false);
    assert.equal(decision.denyReason, DenyReason.CAPABILITY_NOT_GRANTED);
    assert.deepEqual(decision.warnings, []);
    assert.deepEqual(decision.context, { capability: 'package.release' });
});
test('DenyReason exports the canonical governance reasons', () => {
    assert.equal(DenyReason.MISSING_ORGANIZATION_CONTEXT, 'MISSING_ORGANIZATION_CONTEXT');
    assert.equal(DenyReason.POLICY_UNRESOLVABLE, 'POLICY_UNRESOLVABLE');
    assert.equal(DenyReason.COMPOSITION_VERSION_STALE, 'COMPOSITION_VERSION_STALE');
    assert.equal(DenyReason.DATA_INTEGRITY_VIOLATION, 'DATA_INTEGRITY_VIOLATION');
});
test('PolicyDecision is discriminated by allowed', () => {
    const allowedDecision = allow();
    const deniedDecision = deny(DenyReason.NO_ACTIVE_ROLE);
    const decisions = [allowedDecision, deniedDecision];
    assert.equal(decisions[0].allowed, true);
    assert.equal(decisions[1].allowed, false);
});
function _compileTimeDenyRequiresReason() {
    // @ts-expect-error deny() requires a DenyReason (G0-03)
    deny();
}
void _compileTimeDenyRequiresReason;
