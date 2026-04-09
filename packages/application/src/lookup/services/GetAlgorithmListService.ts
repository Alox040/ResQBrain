import type { AlgorithmListItemDto } from '../dto/AlgorithmListItemDto';
import type { AlgorithmReadRepository } from '../ports/AlgorithmReadRepository';
import type { GetAlgorithmListQuery } from '../queries/GetAlgorithmListQuery';

export class GetAlgorithmListService {
  public constructor(
    private readonly algorithmReadRepository: AlgorithmReadRepository,
  ) {}

  public execute(
    query: GetAlgorithmListQuery,
  ): Promise<ReadonlyArray<AlgorithmListItemDto>> {
    return this.algorithmReadRepository.listReleased({
      ...query,
      releasedOnly: true,
    });
  }
}
