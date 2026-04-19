import type { ContentItem, ContentListItem } from '@/types/content';

function normalizeQ(q: string): string {
  return q.trim().toLowerCase();
}

export type ScoredContentListItem = ContentListItem & { _score: number };

/**
 * MDR-safe search projection: label substring match only, alphabetical order, no relevance scoring.
 */
export function rankContentItemsForSearch(
  items: readonly ContentItem[],
  queryRaw: string,
  kindFilter: 'all' | 'medication' | 'algorithm',
): ScoredContentListItem[] {
  const q = normalizeQ(queryRaw);
  if (!q) return [];

  return items
    .filter((item) => kindFilter === 'all' || item.kind === kindFilter)
    .filter((item) => item.label.toLowerCase().includes(q))
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
      subtitle: item.indication,
      _score: 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
}
