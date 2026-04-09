import type { MedicationListItemDto } from '../../../../../packages/application/src/lookup/dto/MedicationListItemDto';

export interface MedicationListResponse {
  readonly items: ReadonlyArray<MedicationListItemDto>;
  readonly page: number;
  readonly limit: number;
}
