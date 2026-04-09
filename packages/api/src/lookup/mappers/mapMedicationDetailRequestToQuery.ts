import type { GetMedicationDetailQuery } from '../../../../application/src/lookup/queries/GetMedicationDetailQuery';

import type { GetMedicationDetailRequest } from '../contracts/GetMedicationDetailRequest';

export function mapMedicationDetailRequestToQuery(
  request: GetMedicationDetailRequest,
): GetMedicationDetailQuery {
  return {
    organizationId: (request.organizationId ?? '') as GetMedicationDetailQuery['organizationId'],
    entityId: request.id as GetMedicationDetailQuery['entityId'],
    regionId: request.regionId as GetMedicationDetailQuery['regionId'],
    stationId: request.stationId as GetMedicationDetailQuery['stationId'],
    releasedOnly: true,
    versionId: request.versionId as GetMedicationDetailQuery['versionId'],
  };
}
