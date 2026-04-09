import type { AlgorithmDetailDto } from '../dto/AlgorithmDetailDto';
import type { AlgorithmReadRepository } from '../ports/AlgorithmReadRepository';
import type { GetAlgorithmDetailQuery } from '../queries/GetAlgorithmDetailQuery';

export class GetAlgorithmDetailService {
  public constructor(
    private readonly algorithmReadRepository: AlgorithmReadRepository,
  ) {}

  public execute(
    query: GetAlgorithmDetailQuery,
  ): Promise<AlgorithmDetailDto | null> {
    return this.algorithmReadRepository.getReleasedById({
      ...query,
      releasedOnly: true,
    });
  }
}
