import type {
  GetAlgorithmDetailService,
  GetAlgorithmListService,
  GetMedicationDetailService,
  GetMedicationListService,
  SearchLookupContentService,
} from '../../../application/src/lookup';

import type { GetAlgorithmDetailRequest } from './contracts/GetAlgorithmDetailRequest';
import type { GetAlgorithmListRequest } from './contracts/GetAlgorithmListRequest';
import type { GetMedicationDetailRequest } from './contracts/GetMedicationDetailRequest';
import type { GetMedicationListRequest } from './contracts/GetMedicationListRequest';
import type { SearchLookupRequest } from './contracts/SearchLookupRequest';
import {
  getAlgorithmDetailHandler,
  type GetAlgorithmDetailHandlerResult,
} from './handlers/getAlgorithmDetailHandler';
import {
  getAlgorithmListHandler,
  type GetAlgorithmListHandlerResult,
} from './handlers/getAlgorithmListHandler';
import {
  getMedicationDetailHandler,
  type GetMedicationDetailHandlerResult,
} from './handlers/getMedicationDetailHandler';
import {
  getMedicationListHandler,
  type GetMedicationListHandlerResult,
} from './handlers/getMedicationListHandler';
import {
  searchLookupHandler,
  type SearchLookupHandlerResult,
} from './handlers/searchLookupHandler';

export interface LookupRouteDependencies {
  readonly getAlgorithmListService: Pick<GetAlgorithmListService, 'execute'>;
  readonly getAlgorithmDetailService: Pick<GetAlgorithmDetailService, 'execute'>;
  readonly getMedicationListService: Pick<GetMedicationListService, 'execute'>;
  readonly getMedicationDetailService: Pick<GetMedicationDetailService, 'execute'>;
  readonly searchLookupContentService: Pick<SearchLookupContentService, 'execute'>;
}

export interface LookupRouteDefinition<TRequest, TResult> {
  readonly method: 'GET';
  readonly path: string;
  readonly handle: (request: TRequest) => Promise<TResult>;
}

export type LookupRoute =
  | LookupRouteDefinition<GetAlgorithmListRequest, GetAlgorithmListHandlerResult>
  | LookupRouteDefinition<GetAlgorithmDetailRequest, GetAlgorithmDetailHandlerResult>
  | LookupRouteDefinition<GetMedicationListRequest, GetMedicationListHandlerResult>
  | LookupRouteDefinition<GetMedicationDetailRequest, GetMedicationDetailHandlerResult>
  | LookupRouteDefinition<SearchLookupRequest, SearchLookupHandlerResult>;

export function createLookupRoutes(
  dependencies: LookupRouteDependencies,
): ReadonlyArray<LookupRoute> {
  return [
    {
      method: 'GET',
      path: '/api/algorithms',
      handle: (request: GetAlgorithmListRequest) =>
        getAlgorithmListHandler(request, dependencies.getAlgorithmListService),
    },
    {
      method: 'GET',
      path: '/api/algorithms/:id',
      handle: (request: GetAlgorithmDetailRequest) =>
        getAlgorithmDetailHandler(request, dependencies.getAlgorithmDetailService),
    },
    {
      method: 'GET',
      path: '/api/medications',
      handle: (request: GetMedicationListRequest) =>
        getMedicationListHandler(request, dependencies.getMedicationListService),
    },
    {
      method: 'GET',
      path: '/api/medications/:id',
      handle: (request: GetMedicationDetailRequest) =>
        getMedicationDetailHandler(
          request,
          dependencies.getMedicationDetailService,
        ),
    },
    {
      method: 'GET',
      path: '/api/search',
      handle: (request: SearchLookupRequest) =>
        searchLookupHandler(request, dependencies.searchLookupContentService),
    },
  ];
}
