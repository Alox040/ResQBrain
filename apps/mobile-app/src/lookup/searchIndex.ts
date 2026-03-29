import type { ContentItem, ContentKind, ContentTag } from '../types/content';

/** Ein Eintrag des Suchindexes (vorab normalisierte Felder für schnelle Substring-Suche). */
export type SearchIndexEntry = {
  id: string;
  kind: ContentKind;
  labelNormalized: string;
  searchTermsNormalized: string;
  textBlobNormalized: string;
  tags: ContentTag[];
};

export type SearchKindFilter = 'all' | ContentKind;

const MATCH_LABEL = 0;
const MATCH_SEARCH_TERMS = 1;
const MATCH_TEXT_BLOB = 2;

/**
 * Kleinbuchstaben, Umlaute (ae/oe/ue/ss), Trim, Folge-Leerzeichen zu einem Space.
 */
export function normalizeForSearch(raw: string): string {
  let s = raw.toLowerCase();
  s = s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  return s.trim().replace(/\s+/g, ' ');
}

function collectTextBlobParts(item: ContentItem): string[] {
  const parts: string[] = [item.indication];
  if (item.notes) parts.push(item.notes);
  if (item.kind === 'medication') {
    parts.push(item.dosage);
  } else {
    if (item.warnings) parts.push(item.warnings);
    for (const step of item.steps) {
      parts.push(step.text);
    }
  }
  parts.push(...item.tags);
  return parts;
}

/** Baut den Suchindex aus Bundle-Items (Medikamente und Algorithmen). */
export function buildSearchIndex(items: readonly ContentItem[]): SearchIndexEntry[] {
  return items.map((item) => {
    const searchTermsNormalized = item.searchTerms
      .map((t) => normalizeForSearch(t))
      .filter((t) => t.length > 0)
      .join(' ');

    const textBlobRaw = collectTextBlobParts(item).join(' ');

    return {
      id: item.id,
      kind: item.kind,
      labelNormalized: normalizeForSearch(item.label),
      searchTermsNormalized,
      textBlobNormalized: normalizeForSearch(textBlobRaw),
      tags: item.tags,
    };
  });
}

function matchTier(entry: SearchIndexEntry, needle: string): typeof MATCH_LABEL | typeof MATCH_SEARCH_TERMS | typeof MATCH_TEXT_BLOB | null {
  if (needle.length === 0) return null;
  if (entry.labelNormalized.includes(needle)) return MATCH_LABEL;
  if (entry.searchTermsNormalized.includes(needle)) return MATCH_SEARCH_TERMS;
  if (entry.textBlobNormalized.includes(needle)) return MATCH_TEXT_BLOB;
  return null;
}

/**
 * Substring-Suche auf dem Index: Treffer in label vor searchTerms vor textBlob.
 * `kindFilter === 'all'` lässt beide Arten zu.
 */
export function searchIndex(
  entries: readonly SearchIndexEntry[],
  query: string,
  kindFilter: SearchKindFilter,
): SearchIndexEntry[] {
  const needle = normalizeForSearch(query);
  if (needle.length === 0) return [];

  const scored: { entry: SearchIndexEntry; tier: number; index: number }[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (kindFilter !== 'all' && entry.kind !== kindFilter) continue;

    const tier = matchTier(entry, needle);
    if (tier !== null) {
      scored.push({ entry, tier, index: i });
    }
  }

  scored.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.index - b.index;
  });

  return scored.map((s) => s.entry);
}
