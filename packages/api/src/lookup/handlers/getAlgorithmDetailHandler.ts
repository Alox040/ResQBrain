import type { GetAlgorithmDetailService } from '../../../../application/src/lookup/services/GetAlgorithmDetailService';

import type { ApiErrorResponse } from '../../shared/contracts/ApiErrorResponse';
import type { AlgorithmDetailResponse } from '../contracts/AlgorithmDetailResponse';
import type { GetAlgorithmDetailRequest } from '../contracts/GetAlgorithmDetailRequest';
import { mapAlgorithmDetailRequestToQuery } from '../mappers/mapAlgorithmDetailRequestToQuery';
import { createLookupServices } from '../runtime/createLookupServices';

export interface GetAlgorithmDetailHandlerResult {
  readonly status: number;
  readonly body: AlgorithmDetailResponse | ApiErrorResponse;
}

export async function getAlgorithmDetailHandler(
  request: GetAlgorithmDetailRequest,
  service: Pick<GetAlgorithmDetailService, 'execute'> = createLookupServices().getAlgorithmDetailService,
): Promise<GetAlgorithmDetailHandlerResult> {
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
    const query = mapAlgorithmDetailRequestToQuery(request);
    const item = await service.execute(query);

    if (!item) {
      return {
        status: 404,
        body: {
          error: {
            code: 'NOT_FOUND',
            message: 'Algorithm not found.',
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
