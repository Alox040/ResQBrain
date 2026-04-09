import type { SearchLookupContentQuery } from '../../../../application/src/lookup/queries/SearchLookupContentQuery';

import type { SearchLookupRequest } from '../contracts/SearchLookupRequest';

export function mapSearchLookupRequestToQuery(
  request: SearchLookupRequest,
): SearchLookupContentQuery {
  return {
    organizationId: (request.organizationId ?? '') as SearchLookupContentQuery['organizationId'],
    regionId: request.regionId as SearchLookupContentQuery['regionId'],
    stationId: request.stationId as SearchLookupContentQuery['stationId'],
    releasedOnly: true,
    searchTerm: request.searchTerm ?? '',
    versionId: request.versionId as SearchLookupContentQuery['versionId'],
    page: request.page,
    limit: request.limit,
  };
}
