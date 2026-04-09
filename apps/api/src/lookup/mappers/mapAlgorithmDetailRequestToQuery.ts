import type { GetAlgorithmDetailQuery } from '../../../../../packages/application/src/lookup/queries/GetAlgorithmDetailQuery';

import type { GetAlgorithmDetailRequest } from '../contracts/GetAlgorithmDetailRequest';

export function mapAlgorithmDetailRequestToQuery(
  request: GetAlgorithmDetailRequest,
): GetAlgorithmDetailQuery {
  return {
    organizationId: request.organizationId ?? '',
    entityId: request.id,
    regionId: request.regionId,
    stationId: request.stationId,
    releasedOnly: true,
    versionId: request.versionId,
  };
}
