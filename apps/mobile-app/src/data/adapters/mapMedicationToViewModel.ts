import type { Medication } from '@/types/content';
import type { MedicationViewModel } from './viewModels';

export function mapMedicationToViewModel(m: Medication): MedicationViewModel {
  return {
    id: m.id,
    kind: 'medication',
    label: m.label,
    indication: m.indication,
    listSubtitle: m.indication,
    tags: m.tags,
    searchTerms: m.searchTerms,
    notes: m.notes,
    dosage: m.dosage,
    relatedAlgorithmIds: m.relatedAlgorithmIds,
  };
}
