import type { SearchLookupContentService } from '../../../../../packages/application/src/lookup/services/SearchLookupContentService';

import type { SearchLookupRequest } from '../contracts/SearchLookupRequest';
import type { SearchLookupResponse } from '../contracts/SearchLookupResponse';
import { mapSearchLookupRequestToQuery } from '../mappers/mapSearchLookupRequestToQuery';
import type { ApiErrorResponse } from '../../shared/contracts/ApiErrorResponse';

export interface SearchLookupHandlerResult {
  readonly status: number;
  readonly body: SearchLookupResponse | ApiErrorResponse;
}

export async function searchLookupHandler(
  request: SearchLookupRequest,
  service: Pick<SearchLookupContentService, 'execute'>,
): Promise<SearchLookupHandlerResult> {
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

  if (!request.searchTerm) {
    return {
      status: 400,
      body: {
        error: {
          code: 'BAD_REQUEST',
          message: 'searchTerm is required.',
        },
      },
    };
  }

  try {
    const query = mapSearchLookupRequestToQuery(request);
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
