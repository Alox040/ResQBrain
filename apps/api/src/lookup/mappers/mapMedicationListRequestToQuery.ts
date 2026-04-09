import type { GetMedicationListQuery } from '../../../../../packages/application/src/lookup/queries/GetMedicationListQuery';

import type { GetMedicationListRequest } from '../contracts/GetMedicationListRequest';

export function mapMedicationListRequestToQuery(
  request: GetMedicationListRequest,
): GetMedicationListQuery {
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
