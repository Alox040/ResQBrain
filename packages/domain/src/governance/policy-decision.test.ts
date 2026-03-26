import assert from 'node:assert/strict';
import test from 'node:test';

import { allow, deny, DenyReason, type PolicyDecision } from '../shared/types';

/**
 * GATE 2 — P-02: PolicyDecision shape and helpers (no implicit allow; deny always typed).
 */
test('allow() returns allowed true without denyReason in discriminated union', () => {
  const d = allow();
  assert.equal(d.allowed, true);
  if (d.allowed) {
    assert.equal(d.denyReason, undefined);
  }
});

test('deny() returns allowed false with denyReason', () => {
  const d = deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, { step: 'test' });
  assert.equal(d.allowed, false);
  if (!d.allowed) {
    assert.equal(d.denyReason, DenyReason.MISSING_ORGANIZATION_CONTEXT);
    assert.deepEqual(d.context, { step: 'test' });
  }
});

test('PolicyDecision: denied branch always has denyReason', () => {
  const decisions: PolicyDecision[] = [
    deny(DenyReason.CAPABILITY_NOT_GRANTED),
    allow({ context: { ok: true } }),
  ];

  for (const dec of decisions) {
    if (!dec.allowed) {
      assert.ok(typeof dec.denyReason === 'string');
    }
  }
});
