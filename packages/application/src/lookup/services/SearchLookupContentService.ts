import type { LookupSearchRepository } from '../ports/LookupSearchRepository';
import type { SearchLookupContentQuery } from '../queries/SearchLookupContentQuery';
import type { SearchResultDto } from '../dto/SearchResultDto';

export class SearchLookupContentService {
  public constructor(
    private readonly lookupSearchRepository: LookupSearchRepository,
  ) {}

  public execute(
    query: SearchLookupContentQuery,
  ): Promise<ReadonlyArray<SearchResultDto>> {
    return this.lookupSearchRepository.searchReleased({
      ...query,
      releasedOnly: true,
    });
  }
}
