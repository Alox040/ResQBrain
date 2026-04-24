import {
  ensureContentStoreReady,
  getSearchIndexItems,
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
  title: string,
  summary?: string | null,
): boolean {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes(queryLower)) {
    return true;
  }

  const normalizedSummary = summary?.trim().toLowerCase();
  return Boolean(normalizedSummary && normalizedSummary.includes(queryLower));
}

export async function loadLookupSearchResults(searchTerm: string): Promise<LookupSearchViewItem[]> {
  const normalizedSearchTerm = searchTerm.trim();

  if (normalizedSearchTerm.length === 0) {
    return [];
  }

  await ensureContentStoreReady();

  const queryLower = normalizedSearchTerm.toLowerCase();

  return getSearchIndexItems()
    .filter((item) => matchesQuery(queryLower, item.label, item.subtitle))
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
