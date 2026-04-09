import type { GetAlgorithmListService } from '../../../../application/src/lookup/services/GetAlgorithmListService';

import type { ApiErrorResponse } from '../../shared/contracts/ApiErrorResponse';
import type { AlgorithmListResponse } from '../contracts/AlgorithmListResponse';
import type { GetAlgorithmListRequest } from '../contracts/GetAlgorithmListRequest';
import { mapAlgorithmListRequestToQuery } from '../mappers/mapAlgorithmListRequestToQuery';
import { createLookupServices } from '../runtime/createLookupServices';

export interface GetAlgorithmListHandlerResult {
  readonly status: number;
  readonly body: AlgorithmListResponse | ApiErrorResponse;
}

export async function getAlgorithmListHandler(
  request: GetAlgorithmListRequest,
  service: Pick<GetAlgorithmListService, 'execute'> = createLookupServices().getAlgorithmListService,
): Promise<GetAlgorithmListHandlerResult> {
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
    const query = mapAlgorithmListRequestToQuery(request);
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
