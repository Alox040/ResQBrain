import type { OrganizationId } from '../common/ids';

export interface TenantContext {
  readonly organizationId: OrganizationId;
}

export interface OrganizationScoped {
  readonly organizationId: OrganizationId | null;
}

export interface TenantReference<
  TSource extends OrganizationScoped = OrganizationScoped,
  TTarget extends OrganizationScoped = OrganizationScoped,
> {
  readonly source: TSource;
  readonly target: TTarget;
}

export const TENANT_GUARD_ERROR_CODES = [
  'organization-id-required',
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

export function hasOrganizationScope(
  value: OrganizationScoped,
): value is OrganizationScoped & { readonly organizationId: OrganizationId } {
  return value.organizationId !== null;
}

export function belongsToTenant(
  value: OrganizationScoped,
  context: TenantContext,
): value is OrganizationScoped & { readonly organizationId: OrganizationId } {
  return (
    value.organizationId !== null && value.organizationId === context.organizationId
  );
}

export function isTenantScopeConsistent(
  values: ReadonlyArray<OrganizationScoped>,
  context: TenantContext,
): boolean {
  return values.every((value) => belongsToTenant(value, context));
}

export function isAuthorizedCrossTenantReference(): boolean {
  return false;
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

export function assertOrganizationScope(
  value: OrganizationScoped,
): OrganizationScoped & { readonly organizationId: OrganizationId } {
  if (!hasOrganizationScope(value)) {
    throw new TenantGuardError('organization-id-required');
  }

  return value;
}

export function assertTenantScope(
  value: OrganizationScoped,
  context: TenantContext,
): OrganizationScoped & { readonly organizationId: OrganizationId } {
  if (!hasOrganizationScope(value)) {
    throw new TenantGuardError('organization-id-required');
  }

  if (!belongsToTenant(value, context)) {
    throw new TenantGuardError('organization-scope-mismatch');
  }

  return value;
}

export function assertTenantReference(
  reference: TenantReference,
  context: TenantContext,
): TenantReference<
  OrganizationScoped & { readonly organizationId: OrganizationId },
  OrganizationScoped & { readonly organizationId: OrganizationId }
> {
  assertTenantScope(reference.source, context);
  assertTenantScope(reference.target, context);

  if (!canReferenceWithinTenant(reference, context)) {
    throw new TenantGuardError('cross-tenant-reference-forbidden');
  }

  return reference;
}

export function assertTenantScopeConsistency(
  values: ReadonlyArray<OrganizationScoped>,
  context: TenantContext,
): ReadonlyArray<OrganizationScoped & { readonly organizationId: OrganizationId }> {
  values.forEach((value) => {
    assertTenantScope(value, context);
  });

  return values;
}
