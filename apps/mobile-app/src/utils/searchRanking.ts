import type { ContentItem, ContentListItem } from '@/types/content';

/** Larger = better match. Gaps between bands leave room for tie-breakers. */
const SCORE_EXACT_LABEL = 1_000_000;
const SCORE_LABEL_STARTS_WITH = 800_000;
const SCORE_TERM_EXACT = 720_000;
const SCORE_TERM_STARTS_WITH = 680_000;
const SCORE_TERM_INCLUDES = 640_000;
const SCORE_INDICATION = 400_000;
const SCORE_SECONDARY = 200_000;

function normalizeQ(q: string): string {
  return q.trim().toLowerCase();
}

function collectSecondaryFields(item: ContentItem): string[] {
  const out: string[] = [];
  if (item.kind === 'medication') {
    out.push(item.dosage);
    if (item.notes) out.push(item.notes);
  } else {
    if (item.notes) out.push(item.notes);
    if (item.warnings) out.push(item.warnings);
    for (const step of item.steps) {
      out.push(step.text);
    }
  }
  return out;
}

/**
 * Single score for an item vs query, or `null` if nothing matches.
 * Bands: exact label → label startsWith → searchTerms (exact/start/includes)
 * → indication includes → secondary text includes (notes, warnings, steps, dosage).
 */
export function searchScoreForItem(
  item: ContentItem,
  queryRaw: string,
): number | null {
  const q = normalizeQ(queryRaw);
  if (!q) return null;

  const label = item.label.toLowerCase();

  if (label === q) {
    return SCORE_EXACT_LABEL + Math.min(label.length, 500);
  }

  if (label.startsWith(q)) {
    return (
      SCORE_LABEL_STARTS_WITH +
      Math.min(q.length, 200) * 10 +
      Math.min(100 - label.length, 99)
    );
  }

  for (let i = 0; i < item.searchTerms.length; i++) {
    const t = item.searchTerms[i].toLowerCase();
    if (t === q) {
      return SCORE_TERM_EXACT - i;
    }
    if (t.startsWith(q)) {
      return SCORE_TERM_STARTS_WITH - i * 10 - Math.min(t.length, 100);
    }
    if (t.includes(q)) {
      const pos = t.indexOf(q);
      return SCORE_TERM_INCLUDES - i * 10 - Math.min(pos, 200);
    }
  }

  const ind = item.indication.toLowerCase();
  if (ind.includes(q)) {
    const pos = ind.indexOf(q);
    return SCORE_INDICATION - Math.min(pos, 10_000);
  }

  let best: number | null = null;
  for (const text of collectSecondaryFields(item)) {
    const low = text.toLowerCase();
    if (!low.includes(q)) continue;
    const pos = low.indexOf(q);
    const s = SCORE_SECONDARY - Math.min(pos, 10_000);
    if (best == null || s > best) best = s;
  }

  return best;
}

export type ScoredContentListItem = ContentListItem & { _score: number };

export function rankContentItemsForSearch(
  items: readonly ContentItem[],
  queryRaw: string,
  kindFilter: 'all' | 'medication' | 'algorithm',
): ScoredContentListItem[] {
  const q = normalizeQ(queryRaw);
  if (!q) return [];

  const scored: ScoredContentListItem[] = [];

  for (const item of items) {
    if (kindFilter !== 'all' && item.kind !== kindFilter) continue;
    const score = searchScoreForItem(item, q);
    if (score == null) continue;
    scored.push({
      id: item.id,
      kind: item.kind,
      label: item.label,
      subtitle: item.indication,
      _score: score,
    });
  }

  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return a.label.localeCompare(b.label, 'de');
  });

  return scored;
}
