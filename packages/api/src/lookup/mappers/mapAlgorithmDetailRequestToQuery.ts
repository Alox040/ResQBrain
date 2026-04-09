import type { GetAlgorithmDetailQuery } from '../../../../application/src/lookup/queries/GetAlgorithmDetailQuery';

import type { GetAlgorithmDetailRequest } from '../contracts/GetAlgorithmDetailRequest';

export function mapAlgorithmDetailRequestToQuery(
  request: GetAlgorithmDetailRequest,
): GetAlgorithmDetailQuery {
  return {
    organizationId: (request.organizationId ?? '') as GetAlgorithmDetailQuery['organizationId'],
    entityId: request.id as GetAlgorithmDetailQuery['entityId'],
    regionId: request.regionId as GetAlgorithmDetailQuery['regionId'],
    stationId: request.stationId as GetAlgorithmDetailQuery['stationId'],
    releasedOnly: true,
    versionId: request.versionId as GetAlgorithmDetailQuery['versionId'],
  };
}
