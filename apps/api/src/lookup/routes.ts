import type { GetAlgorithmDetailService } from '../../../../packages/application/src/lookup/services/GetAlgorithmDetailService';
import type { GetAlgorithmListService } from '../../../../packages/application/src/lookup/services/GetAlgorithmListService';
import type { GetMedicationDetailService } from '../../../../packages/application/src/lookup/services/GetMedicationDetailService';
import type { GetMedicationListService } from '../../../../packages/application/src/lookup/services/GetMedicationListService';
import type { SearchLookupContentService } from '../../../../packages/application/src/lookup/services/SearchLookupContentService';

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

export type AlgorithmListRouteDefinition = LookupRouteDefinition<
  GetAlgorithmListRequest,
  GetAlgorithmListHandlerResult
>;

export type AlgorithmDetailRouteDefinition = LookupRouteDefinition<
  GetAlgorithmDetailRequest,
  GetAlgorithmDetailHandlerResult
>;

export type MedicationListRouteDefinition = LookupRouteDefinition<
  GetMedicationListRequest,
  GetMedicationListHandlerResult
>;

export type MedicationDetailRouteDefinition = LookupRouteDefinition<
  GetMedicationDetailRequest,
  GetMedicationDetailHandlerResult
>;

export type SearchLookupRouteDefinition = LookupRouteDefinition<
  SearchLookupRequest,
  SearchLookupHandlerResult
>;

export type LookupRoute =
  | AlgorithmListRouteDefinition
  | AlgorithmDetailRouteDefinition
  | MedicationListRouteDefinition
  | MedicationDetailRouteDefinition
  | SearchLookupRouteDefinition;

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
