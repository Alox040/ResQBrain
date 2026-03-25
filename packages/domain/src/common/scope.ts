import type {
  CountyId,
  OrganizationId,
  RegionId,
  StationId,
} from './ids';

export interface OrganizationContext {
  readonly organizationId: OrganizationId;
}

export interface OrganizationScoped {
  readonly organizationId: OrganizationId;
}

export interface OrganizationScope extends OrganizationScoped {
  readonly kind: 'Organization';
}

export interface RegionScope extends OrganizationScoped {
  readonly kind: 'Region';
  readonly regionId: RegionId;
}

export interface CountyScope extends OrganizationScoped {
  readonly kind: 'County';
  readonly countyId: CountyId;
  readonly regionId?: RegionId | null;
}

export interface StationScope extends OrganizationScoped {
  readonly kind: 'Station';
  readonly stationId: StationId;
  readonly regionId?: RegionId | null;
  readonly countyId?: CountyId | null;
}

export type ApplicabilityScope =
  | OrganizationScope
  | RegionScope
  | CountyScope
  | StationScope;

export interface ScopedApplicability {
  readonly scopes: ReadonlyArray<ApplicabilityScope>;
}

export function resolveOrganizationScope(
  scope: ApplicabilityScope,
): OrganizationId {
  return scope.organizationId;
}

export function isScopeInOrganization(
  scope: ApplicabilityScope,
  context: OrganizationContext,
): boolean {
  return resolveOrganizationScope(scope) === context.organizationId;
}
