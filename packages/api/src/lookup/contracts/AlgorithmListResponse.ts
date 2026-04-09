import type { AlgorithmListItemDto } from '../../../../application/src/lookup/dto/AlgorithmListItemDto';

export interface AlgorithmListResponse {
  readonly items: ReadonlyArray<AlgorithmListItemDto>;
  readonly page: number;
  readonly limit: number;
}
