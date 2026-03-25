import { DataIntegrityViolation } from '../../shared/errors';

import {
  assertSameOrg,
  type TenantScopedRecord,
} from './TenantScopeValidator';

export function validateIntraOrgRef<
  TSource extends TenantScopedRecord,
  TTarget extends TenantScopedRecord,
>(source: TSource, target: TTarget): readonly [TSource, TTarget] {
  return assertSameOrg(source, target);
}

export function validateOptionalIntraOrgRef<
  TSource extends TenantScopedRecord,
  TTarget extends TenantScopedRecord,
>(source: TSource, target?: TTarget | null): readonly [TSource, TTarget] | null {
  if (!target) {
    return null;
  }

  return validateIntraOrgRef(source, target);
}

export function validateHierarchyEdge<
  TParent extends TenantScopedRecord,
  TChild extends TenantScopedRecord,
>(parent: TParent, child: TChild): readonly [TParent, TChild] {
  return assertSameOrg(parent, child);
}

export function assertNoImplicitTenantDerivation(
  organizationId: string | null | undefined,
  fallbackContext?: Readonly<Record<string, unknown>>,
): asserts organizationId is string {
  if (typeof organizationId === 'string' && organizationId.trim().length > 0) {
    return;
  }

  throw new DataIntegrityViolation(
    'organizationId must be supplied explicitly and cannot be derived from fallback context.',
    {
      fallbackContext: fallbackContext ?? null,
    },
  );
}
