import type { GetAlgorithmListQuery } from '../../../../../packages/application/src/lookup/queries/GetAlgorithmListQuery';

import type { GetAlgorithmListRequest } from '../contracts/GetAlgorithmListRequest';

export function mapAlgorithmListRequestToQuery(
  request: GetAlgorithmListRequest,
): GetAlgorithmListQuery {
  return {
    organizationId: request.organizationId ?? '',
    regionId: request.regionId,
    stationId: request.stationId,
    releasedOnly: true,
    searchTerm: request.searchTerm,
    versionId: request.versionId,
    page: request.page,
    limit: request.limit,
  };
}
