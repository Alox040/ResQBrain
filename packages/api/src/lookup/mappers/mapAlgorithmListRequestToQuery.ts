import type { GetAlgorithmListQuery } from '../../../../application/src/lookup/queries/GetAlgorithmListQuery';

import type { GetAlgorithmListRequest } from '../contracts/GetAlgorithmListRequest';

export function mapAlgorithmListRequestToQuery(
  request: GetAlgorithmListRequest,
): GetAlgorithmListQuery {
  return {
    organizationId: (request.organizationId ?? '') as GetAlgorithmListQuery['organizationId'],
    regionId: request.regionId as GetAlgorithmListQuery['regionId'],
    stationId: request.stationId as GetAlgorithmListQuery['stationId'],
    releasedOnly: true,
    searchTerm: request.searchTerm,
    versionId: request.versionId as GetAlgorithmListQuery['versionId'],
    page: request.page,
    limit: request.limit,
  };
}
