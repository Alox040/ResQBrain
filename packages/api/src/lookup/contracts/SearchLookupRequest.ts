export interface SearchLookupRequest {
  readonly organizationId?: string;
  readonly regionId?: string;
  readonly stationId?: string;
  readonly searchTerm?: string;
  readonly versionId?: string;
  readonly page?: number;
  readonly limit?: number;
}
