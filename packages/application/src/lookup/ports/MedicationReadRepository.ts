import type { MedicationDetailDto } from '../dto/MedicationDetailDto';
import type { MedicationListItemDto } from '../dto/MedicationListItemDto';
import type { GetMedicationDetailQuery } from '../queries/GetMedicationDetailQuery';
import type { GetMedicationListQuery } from '../queries/GetMedicationListQuery';

export interface MedicationReadRepository {
  listReleased(
    query: GetMedicationListQuery,
  ): Promise<ReadonlyArray<MedicationListItemDto>>;

  getReleasedById(
    query: GetMedicationDetailQuery,
  ): Promise<MedicationDetailDto | null>;
}
