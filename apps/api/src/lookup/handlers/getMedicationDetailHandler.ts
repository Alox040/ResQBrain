import type { GetMedicationDetailService } from '../../../../../packages/application/src/lookup/services/GetMedicationDetailService';

import type { GetMedicationDetailRequest } from '../contracts/GetMedicationDetailRequest';
import type { MedicationDetailResponse } from '../contracts/MedicationDetailResponse';
import { mapMedicationDetailRequestToQuery } from '../mappers/mapMedicationDetailRequestToQuery';
import type { ApiErrorResponse } from '../../shared/contracts/ApiErrorResponse';

export interface GetMedicationDetailHandlerResult {
  readonly status: number;
  readonly body: MedicationDetailResponse | ApiErrorResponse;
}

export async function getMedicationDetailHandler(
  request: GetMedicationDetailRequest,
  service: Pick<GetMedicationDetailService, 'execute'>,
): Promise<GetMedicationDetailHandlerResult> {
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

  if (!request.id) {
    return {
      status: 400,
      body: {
        error: {
          code: 'BAD_REQUEST',
          message: 'id is required.',
        },
      },
    };
  }

  try {
    const query = mapMedicationDetailRequestToQuery(request);
    const item = await service.execute(query);

    if (!item) {
      return {
        status: 404,
        body: {
          error: {
            code: 'NOT_FOUND',
            message: 'Medication not found.',
          },
        },
      };
    }

    return {
      status: 200,
      body: item,
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
