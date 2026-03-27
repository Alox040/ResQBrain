import assert from 'node:assert/strict';
import test from 'node:test';

import { assertExplicitVersionId } from './assertExplicitVersionId';

test('assertExplicitVersionId denies latest', () => {
  assert.deepEqual(assertExplicitVersionId('latest'), {
    allowed: false,
    denyReason: 'EXPLICIT_VERSION_REQUIRED',
  });
});

test('assertExplicitVersionId allows normal version ids', () => {
  assert.deepEqual(assertExplicitVersionId('ver-1'), {
    allowed: true,
  });
});
