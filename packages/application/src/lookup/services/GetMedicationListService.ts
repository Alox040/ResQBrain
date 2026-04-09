import type { MedicationListItemDto } from '../dto/MedicationListItemDto';
import type { MedicationReadRepository } from '../ports/MedicationReadRepository';
import type { GetMedicationListQuery } from '../queries/GetMedicationListQuery';

export class GetMedicationListService {
  public constructor(
    private readonly medicationReadRepository: MedicationReadRepository,
  ) {}

  public execute(
    query: GetMedicationListQuery,
  ): Promise<ReadonlyArray<MedicationListItemDto>> {
    return this.medicationReadRepository.listReleased({
      ...query,
      releasedOnly: true,
    });
  }
}
