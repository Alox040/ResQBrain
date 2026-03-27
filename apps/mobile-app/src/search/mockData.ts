import { medications } from '@/data/medications';
import { algorithms } from '@/data/algorithms';
import type { ContentListItem } from '@/types/content';

export const searchItems: ContentListItem[] = [
  ...medications.map((m) => ({ id: m.id, kind: m.kind, label: m.label, subtitle: m.indication })),
  ...algorithms.map((a) => ({ id: a.id, kind: a.kind, label: a.label, subtitle: a.indication })),
];
