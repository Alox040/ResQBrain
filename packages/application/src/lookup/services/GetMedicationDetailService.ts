import type { MedicationDetailDto } from '../dto/MedicationDetailDto';
import type { MedicationReadRepository } from '../ports/MedicationReadRepository';
import type { GetMedicationDetailQuery } from '../queries/GetMedicationDetailQuery';

export class GetMedicationDetailService {
  public constructor(
    private readonly medicationReadRepository: MedicationReadRepository,
  ) {}

  public execute(
    query: GetMedicationDetailQuery,
  ): Promise<MedicationDetailDto | null> {
    return this.medicationReadRepository.getReleasedById({
      ...query,
      releasedOnly: true,
    });
  }
}
