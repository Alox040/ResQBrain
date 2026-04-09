import {
  GetAlgorithmDetailService,
  GetAlgorithmListService,
  GetMedicationDetailService,
  GetMedicationListService,
  SearchLookupContentService,
} from '../../../../application/src/lookup';
import { InMemoryAlgorithmReadRepository } from '../adapters/InMemoryAlgorithmReadRepository';
import { InMemoryLookupSearchRepository } from '../adapters/InMemoryLookupSearchRepository';
import { InMemoryMedicationReadRepository } from '../adapters/InMemoryMedicationReadRepository';

export interface LookupServices {
  readonly getAlgorithmListService: GetAlgorithmListService;
  readonly getAlgorithmDetailService: GetAlgorithmDetailService;
  readonly getMedicationListService: GetMedicationListService;
  readonly getMedicationDetailService: GetMedicationDetailService;
  readonly searchLookupContentService: SearchLookupContentService;
}

export function createLookupServices(): LookupServices {
  const algorithmReadRepository = new InMemoryAlgorithmReadRepository();
  const medicationReadRepository = new InMemoryMedicationReadRepository();
  const lookupSearchRepository = new InMemoryLookupSearchRepository();

  return {
    getAlgorithmListService: new GetAlgorithmListService(algorithmReadRepository),
    getAlgorithmDetailService: new GetAlgorithmDetailService(algorithmReadRepository),
    getMedicationListService: new GetMedicationListService(medicationReadRepository),
    getMedicationDetailService: new GetMedicationDetailService(medicationReadRepository),
    searchLookupContentService: new SearchLookupContentService(lookupSearchRepository),
  };
}
