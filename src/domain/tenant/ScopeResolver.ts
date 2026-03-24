import type {
  CountyId,
  OrganizationId,
  RegionId,
  StationId,
} from '../common/ids';

export const SCOPE_KINDS = [
  'Organization',
  'Region',
  'County',
  'Station',
] as const;

export type ScopeKind = (typeof SCOPE_KINDS)[number];

export interface OrganizationScope {
  readonly kind: 'Organization';
  readonly organizationId: OrganizationId;
}

export interface RegionScope {
  readonly kind: 'Region';
  readonly organizationId: OrganizationId;
  readonly regionId: RegionId;
}

export interface CountyScope {
  readonly kind: 'County';
  readonly organizationId: OrganizationId;
  readonly countyId: CountyId;
}

export interface StationScope {
  readonly kind: 'Station';
  readonly organizationId: OrganizationId;
  readonly stationId: StationId;
  readonly regionId: RegionId | null;
  readonly countyId: CountyId | null;
}

export type TenantScope =
  | OrganizationScope
  | RegionScope
  | CountyScope
  | StationScope;

export interface ResolvedScope {
  readonly organizationId: OrganizationId;
  readonly regionId: RegionId | null;
  readonly countyId: CountyId | null;
  readonly stationId: StationId | null;
}

export interface ScopeContext {
  readonly organizationId: OrganizationId;
}

export const SCOPE_RESOLVER_ERROR_CODES = [
  'cross-tenant-scope-forbidden',
  'scope-kind-mismatch',
  'scope-not-comparable',
] as const;

export type ScopeResolverErrorCode =
  (typeof SCOPE_RESOLVER_ERROR_CODES)[number];

export class ScopeResolverError extends Error {
  readonly code: ScopeResolverErrorCode;

  constructor(code: ScopeResolverErrorCode) {
    super(code);
    this.name = 'ScopeResolverError';
    this.code = code;
  }
}

export function resolveScope(scope: TenantScope): ResolvedScope {
  switch (scope.kind) {
    case 'Organization':
      return {
        organizationId: scope.organizationId,
        regionId: null,
        countyId: null,
        stationId: null,
      };
    case 'Region':
      return {
        organizationId: scope.organizationId,
        regionId: scope.regionId,
        countyId: null,
        stationId: null,
      };
    case 'County':
      return {
        organizationId: scope.organizationId,
        regionId: null,
        countyId: scope.countyId,
        stationId: null,
      };
    case 'Station':
      return {
        organizationId: scope.organizationId,
        regionId: scope.regionId,
        countyId: scope.countyId,
        stationId: scope.stationId,
      };
  }
}

export function isScopeWithinOrganization(
  scope: TenantScope,
  context: ScopeContext,
): boolean {
  return scope.organizationId === context.organizationId;
}

export function isSameScope(left: TenantScope, right: TenantScope): boolean {
  const resolvedLeft = resolveScope(left);
  const resolvedRight = resolveScope(right);

  return (
    resolvedLeft.organizationId === resolvedRight.organizationId &&
    resolvedLeft.regionId === resolvedRight.regionId &&
    resolvedLeft.countyId === resolvedRight.countyId &&
    resolvedLeft.stationId === resolvedRight.stationId
  );
}

export function isComparableScope(
  left: TenantScope,
  right: TenantScope,
  context: ScopeContext,
): boolean {
  return (
    isScopeWithinOrganization(left, context) &&
    isScopeWithinOrganization(right, context)
  );
}

export function scopeContains(
  ancestor: TenantScope,
  descendant: TenantScope,
  context: ScopeContext,
): boolean {
  if (!isComparableScope(ancestor, descendant, context)) {
    return false;
  }

  const resolvedAncestor = resolveScope(ancestor);
  const resolvedDescendant = resolveScope(descendant);

  return (
    resolvedAncestor.organizationId === resolvedDescendant.organizationId &&
    (resolvedAncestor.regionId === null ||
      resolvedAncestor.regionId === resolvedDescendant.regionId) &&
    (resolvedAncestor.countyId === null ||
      resolvedAncestor.countyId === resolvedDescendant.countyId) &&
    (resolvedAncestor.stationId === null ||
      resolvedAncestor.stationId === resolvedDescendant.stationId)
  );
}

export function scopeInheritsFrom(
  scope: TenantScope,
  ancestor: TenantScope,
  context: ScopeContext,
): boolean {
  return scopeContains(ancestor, scope, context);
}

export function assertScopeWithinOrganization(
  scope: TenantScope,
  context: ScopeContext,
): TenantScope {
  if (!isScopeWithinOrganization(scope, context)) {
    throw new ScopeResolverError('cross-tenant-scope-forbidden');
  }

  return scope;
}

export function assertComparableScopes(
  left: TenantScope,
  right: TenantScope,
  context: ScopeContext,
): readonly [TenantScope, TenantScope] {
  assertScopeWithinOrganization(left, context);
  assertScopeWithinOrganization(right, context);

  if (!isComparableScope(left, right, context)) {
    throw new ScopeResolverError('scope-not-comparable');
  }

  return [left, right] as const;
}

export function assertScopeContains(
  ancestor: TenantScope,
  descendant: TenantScope,
  context: ScopeContext,
): readonly [TenantScope, TenantScope] {
  assertComparableScopes(ancestor, descendant, context);

  if (!scopeContains(ancestor, descendant, context)) {
    throw new ScopeResolverError('scope-kind-mismatch');
  }

  return [ancestor, descendant] as const;
}
