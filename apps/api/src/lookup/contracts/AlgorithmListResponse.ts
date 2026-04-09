import type { AlgorithmListItemDto } from '../../../../../packages/application/src/lookup/dto/AlgorithmListItemDto';

export interface AlgorithmListResponse {
  readonly items: ReadonlyArray<AlgorithmListItemDto>;
  readonly page: number;
  readonly limit: number;
}
