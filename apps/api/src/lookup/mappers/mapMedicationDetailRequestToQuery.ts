import type { GetMedicationDetailQuery } from '../../../../../packages/application/src/lookup/queries/GetMedicationDetailQuery';

import type { GetMedicationDetailRequest } from '../contracts/GetMedicationDetailRequest';

export function mapMedicationDetailRequestToQuery(
  request: GetMedicationDetailRequest,
): GetMedicationDetailQuery {
  return {
    organizationId: request.organizationId ?? '',
    entityId: request.id,
    regionId: request.regionId,
    stationId: request.stationId,
    releasedOnly: true,
    versionId: request.versionId,
  };
}
