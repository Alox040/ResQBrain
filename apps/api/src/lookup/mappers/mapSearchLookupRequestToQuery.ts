import type { SearchLookupContentQuery } from '../../../../../packages/application/src/lookup/queries/SearchLookupContentQuery';

import type { SearchLookupRequest } from '../contracts/SearchLookupRequest';

export function mapSearchLookupRequestToQuery(
  request: SearchLookupRequest,
): SearchLookupContentQuery {
  return {
    organizationId: request.organizationId ?? '',
    regionId: request.regionId,
    stationId: request.stationId,
    releasedOnly: true,
    searchTerm: request.searchTerm ?? '',
    versionId: request.versionId,
    page: request.page,
    limit: request.limit,
  };
}
