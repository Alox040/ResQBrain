import type { GetMedicationListQuery } from '../../../../application/src/lookup/queries/GetMedicationListQuery';

import type { GetMedicationListRequest } from '../contracts/GetMedicationListRequest';

export function mapMedicationListRequestToQuery(
  request: GetMedicationListRequest,
): GetMedicationListQuery {
  return {
    organizationId: (request.organizationId ?? '') as GetMedicationListQuery['organizationId'],
    regionId: request.regionId as GetMedicationListQuery['regionId'],
    stationId: request.stationId as GetMedicationListQuery['stationId'],
    releasedOnly: true,
    searchTerm: request.searchTerm,
    versionId: request.versionId as GetMedicationListQuery['versionId'],
    page: request.page,
    limit: request.limit,
  };
}
