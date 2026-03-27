import { medications } from '@/data/medications';
import { algorithms } from '@/data/algorithms';
import type { ContentKind } from '@/types/content';

/**
 * Richer projection used exclusively for search matching.
 * Extends the list-item shape with searchTerms so synonyms and abbreviations
 * (e.g. "ASS", "CPR", "EPI") are matched without changing ContentListItem.
 */
export type SearchableItem = {
  id: string;
  kind: ContentKind;
  label: string;
  subtitle: string;
  searchTerms: string[];
};

export const searchItems: SearchableItem[] = [
  ...medications.map((m) => ({
    id: m.id,
    kind: m.kind,
    label: m.label,
    subtitle: m.indication,
    searchTerms: m.searchTerms,
  })),
  ...algorithms.map((a) => ({
    id: a.id,
    kind: a.kind,
    label: a.label,
    subtitle: a.indication,
    searchTerms: a.searchTerms,
  })),
];
