type DomainId<TBrand extends string> = string & { readonly __brand: TBrand };

export type OrganizationId = DomainId<'OrganizationId'>;
export type RegionId = DomainId<'RegionId'>;
export type CountyId = DomainId<'CountyId'>;
export type StationId = DomainId<'StationId'>;
export type AlgorithmId = DomainId<'AlgorithmId'>;
export type MedicationId = DomainId<'MedicationId'>;
export type ProtocolId = DomainId<'ProtocolId'>;
export type GuidelineId = DomainId<'GuidelineId'>;
export type ContentPackageId = DomainId<'ContentPackageId'>;
export type VersionId = DomainId<'VersionId'>;
export type ReleaseId = DomainId<'ReleaseId'>;
export type UserRoleId = DomainId<'UserRoleId'>;
export type UserId = DomainId<'UserId'>;
export type PermissionId = DomainId<'PermissionId'>;
export type SurveyInsightId = DomainId<'SurveyInsightId'>;

/** Branded union of canonical content-entity identifiers (Algorithm, Medication, Protocol, Guideline). */
export type ContentEntityId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;
