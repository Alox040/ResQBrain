import type { AlgorithmDetailDto } from '../dto/AlgorithmDetailDto';
import type { AlgorithmListItemDto } from '../dto/AlgorithmListItemDto';
import type { GetAlgorithmDetailQuery } from '../queries/GetAlgorithmDetailQuery';
import type { GetAlgorithmListQuery } from '../queries/GetAlgorithmListQuery';

export interface AlgorithmReadRepository {
  listReleased(
    query: GetAlgorithmListQuery,
  ): Promise<ReadonlyArray<AlgorithmListItemDto>>;

  getReleasedById(
    query: GetAlgorithmDetailQuery,
  ): Promise<AlgorithmDetailDto | null>;
}
