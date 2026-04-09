import type { GetMedicationListService } from '../../../../application/src/lookup/services/GetMedicationListService';

import type { ApiErrorResponse } from '../../shared/contracts/ApiErrorResponse';
import type { GetMedicationListRequest } from '../contracts/GetMedicationListRequest';
import type { MedicationListResponse } from '../contracts/MedicationListResponse';
import { mapMedicationListRequestToQuery } from '../mappers/mapMedicationListRequestToQuery';
import { createLookupServices } from '../runtime/createLookupServices';

export interface GetMedicationListHandlerResult {
  readonly status: number;
  readonly body: MedicationListResponse | ApiErrorResponse;
}

export async function getMedicationListHandler(
  request: GetMedicationListRequest,
  service: Pick<GetMedicationListService, 'execute'> = createLookupServices().getMedicationListService,
): Promise<GetMedicationListHandlerResult> {
  if (!request.organizationId) {
    return {
      status: 400,
      body: {
        error: {
          code: 'MISSING_TENANT',
          message: 'organizationId is required.',
        },
      },
    };
  }

  try {
    const query = mapMedicationListRequestToQuery(request);
    const items = await service.execute(query);

    return {
      status: 200,
      body: {
        items,
        page: request.page ?? 1,
        limit: request.limit ?? 20,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: {
          code: 'INTERNAL_ERROR',
          message:
            error instanceof Error ? error.message : 'Internal server error.',
        },
      },
    };
  }
}
