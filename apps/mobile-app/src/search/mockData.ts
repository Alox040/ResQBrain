import type {
  AlgorithmListItem,
  MedicationListItem,
  SearchResultItem,
} from './types';

export const mockMedications: MedicationListItem[] = [
  {
    id: 'med-1',
    name: 'Adrenalin',
    subtitle: 'Reanimation / Anaphylaxie',
    kind: 'medication',
  },
  {
    id: 'med-2',
    name: 'Amiodaron',
    subtitle: 'Rhythmusstoerung',
    kind: 'medication',
  },
  {
    id: 'med-3',
    name: 'Midazolam',
    subtitle: 'Sedierung / Krampfanfall',
    kind: 'medication',
  },
  {
    id: 'med-4',
    name: 'Ketamin',
    subtitle: 'Analgesie / Sedierung',
    kind: 'medication',
  },
  {
    id: 'med-5',
    name: 'Noradrenalin',
    subtitle: 'Schock / Hypotonie',
    kind: 'medication',
  },
];

export const mockAlgorithms: AlgorithmListItem[] = [
  {
    id: 'alg-1',
    title: 'Reanimation',
    subtitle: 'ALS Basisablauf',
    kind: 'algorithm',
  },
  {
    id: 'alg-2',
    title: 'Anaphylaxie',
    subtitle: 'Akute allergische Reaktion',
    kind: 'algorithm',
  },
  {
    id: 'alg-3',
    title: 'Krampfanfall',
    subtitle: 'Neurologischer Notfall',
    kind: 'algorithm',
  },
  {
    id: 'alg-4',
    title: 'ACS',
    subtitle: 'Akutes Koronarsyndrom',
    kind: 'algorithm',
  },
  {
    id: 'alg-5',
    title: 'Atemwegsmanagement',
    subtitle: 'Basis bis erweitert',
    kind: 'algorithm',
  },
];

export const mockSearchResults: SearchResultItem[] = [
  ...mockMedications,
  ...mockAlgorithms,
];
