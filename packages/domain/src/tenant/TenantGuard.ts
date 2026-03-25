import type { OrganizationContext, OrganizationScoped } from '../common/scope';

export type TenantContext = OrganizationContext;

export interface TenantReference<
  TSource extends OrganizationScoped = OrganizationScoped,
  TTarget extends OrganizationScoped = OrganizationScoped,
> {
  readonly source: TSource;
  readonly target: TTarget;
}

export const TENANT_GUARD_ERROR_CODES = [
  'organization-scope-mismatch',
  'cross-tenant-reference-forbidden',
] as const;

export type TenantGuardErrorCode = (typeof TENANT_GUARD_ERROR_CODES)[number];

export class TenantGuardError extends Error {
  readonly code: TenantGuardErrorCode;

  constructor(code: TenantGuardErrorCode) {
    super(code);
    this.name = 'TenantGuardError';
    this.code = code;
  }
}

export function belongsToTenant(
  value: OrganizationScoped,
  context: TenantContext,
): boolean {
  return value.organizationId === context.organizationId;
}

export function isTenantScopeConsistent(
  values: ReadonlyArray<OrganizationScoped>,
  context: TenantContext,
): boolean {
  return values.every((value) => belongsToTenant(value, context));
}

export function canReferenceWithinTenant(
  reference: TenantReference,
  context: TenantContext,
): boolean {
  return (
    belongsToTenant(reference.source, context) &&
    belongsToTenant(reference.target, context)
  );
}

export function assertTenantScope<TValue extends OrganizationScoped>(
  value: TValue,
  context: TenantContext,
): TValue {
  if (!belongsToTenant(value, context)) {
    throw new TenantGuardError('organization-scope-mismatch');
  }

  return value;
}

export function assertTenantReference<
  TSource extends OrganizationScoped,
  TTarget extends OrganizationScoped,
>(
  reference: TenantReference<TSource, TTarget>,
  context: TenantContext,
): TenantReference<TSource, TTarget> {
  assertTenantScope(reference.source, context);
  assertTenantScope(reference.target, context);

  if (!canReferenceWithinTenant(reference, context)) {
    throw new TenantGuardError('cross-tenant-reference-forbidden');
  }

  return reference;
}
