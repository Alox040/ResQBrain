import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { ContentKind } from '@/types/content';
import { mapAlgorithmToViewModel } from './mapAlgorithmToViewModel';
import { mapMedicationToViewModel } from './mapMedicationToViewModel';
import type { ContentViewModel } from './viewModels';

/**
 * Resolve a valid bundle item to its view model, or `undefined` if missing.
 */
export function resolveContentViewModel(
  id: string,
  kind: ContentKind,
): ContentViewModel | undefined {
  if (kind === 'medication') {
    const m = getMedicationById(id);
    return m ? mapMedicationToViewModel(m) : undefined;
  }
  const a = getAlgorithmById(id);
  return a ? mapAlgorithmToViewModel(a) : undefined;
}
