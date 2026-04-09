export interface GetMedicationDetailRequest {
  readonly id: string;
  readonly organizationId?: string;
  readonly regionId?: string;
  readonly stationId?: string;
  readonly versionId?: string;
}
