import {
  assertContentInitialized,
  searchIndexItems,
} from "@/data/contentIndex";

export type LookupSearchKind = "algorithm" | "medication";

export type LookupSearchViewItem = {
  id: string;
  title: string;
  summary: string;
  kind?: LookupSearchKind;
  category?: string | null;
  versionLabel?: string | null;
  tags: string[];
};

function normalizeSummary(summary?: string | null) {
  const trimmed = summary?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : "Keine Kurzbeschreibung verfuegbar.";
}

function matchesQuery(
  queryLower: string,
  label: string,
  subtitle: string,
  searchTerms: readonly string[],
): boolean {
  if (label.toLowerCase().includes(queryLower)) {
    return true;
  }
  if (subtitle.toLowerCase().includes(queryLower)) {
    return true;
  }
  return searchTerms.some((term) => term.toLowerCase().includes(queryLower));
}

export async function loadLookupSearchResults(searchTerm: string): Promise<LookupSearchViewItem[]> {
  const normalizedSearchTerm = searchTerm.trim();

  if (normalizedSearchTerm.length === 0) {
    return [];
  }

  assertContentInitialized();

  const queryLower = normalizedSearchTerm.toLowerCase();

  return searchIndexItems
    .filter((item) => matchesQuery(queryLower, item.label, item.subtitle, item.searchTerms))
    .map((item) => ({
      id: item.id,
      title: item.label,
      summary: normalizeSummary(item.subtitle),
      kind: item.kind,
      category: null,
      versionLabel: null,
      tags: [],
    }));
}
