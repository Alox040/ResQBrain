import type { SearchResultDto } from '../dto/SearchResultDto';
import type { SearchLookupContentQuery } from '../queries/SearchLookupContentQuery';

export interface LookupSearchRepository {
  searchReleased(
    query: SearchLookupContentQuery,
  ): Promise<ReadonlyArray<SearchResultDto>>;
}
