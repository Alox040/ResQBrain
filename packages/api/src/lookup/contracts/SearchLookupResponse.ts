import type { SearchResultDto } from '../../../../application/src/lookup/dto/SearchResultDto';

export interface SearchLookupResponse {
  readonly items: ReadonlyArray<SearchResultDto>;
  readonly page: number;
  readonly limit: number;
}
