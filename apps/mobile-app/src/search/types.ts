export type SearchItemKind = 'medication' | 'algorithm';

export type MedicationListItem = {
  id: string;
  name: string;
  subtitle?: string;
  kind: 'medication';
};

export type AlgorithmListItem = {
  id: string;
  title: string;
  subtitle?: string;
  kind: 'algorithm';
};

export type SearchResultItem = MedicationListItem | AlgorithmListItem;
