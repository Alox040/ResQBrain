import { algorithms, medications } from '@/features/lookup';
import type {
  AlgorithmListItem,
  MedicationListItem,
  SearchResultItem,
} from './types';

export const mockMedications: MedicationListItem[] = medications.map(
  (medication) => ({
    id: medication.id,
    name: medication.name,
    subtitle: medication.indication,
    kind: 'medication',
  }),
);

export const mockAlgorithms: AlgorithmListItem[] = algorithms.map((algorithm) => ({
  id: algorithm.id,
  title: algorithm.title,
  subtitle: algorithm.indication,
  kind: 'algorithm',
}));

export const mockSearchResults: SearchResultItem[] = [...mockMedications, ...mockAlgorithms];
