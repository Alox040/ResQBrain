import type { Algorithm } from '@/types/content';
import type { AlgorithmViewModel } from './viewModels';

export function mapAlgorithmToViewModel(a: Algorithm): AlgorithmViewModel {
  return {
    id: a.id,
    kind: 'algorithm',
    label: a.label,
    indication: a.indication,
    listSubtitle: a.indication,
    tags: a.tags,
    searchTerms: a.searchTerms,
    notes: a.notes,
    warnings: a.warnings,
    steps: a.steps,
    relatedMedicationIds: a.relatedMedicationIds,
  };
}
