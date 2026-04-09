import type { MedicationListItemDto } from '../../../../application/src/lookup/dto/MedicationListItemDto';

export interface MedicationListResponse {
  readonly items: ReadonlyArray<MedicationListItemDto>;
  readonly page: number;
  readonly limit: number;
}
