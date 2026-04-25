import {
  ensureContentStoreReady,
  getSearchIndexItems,
  type SearchIndexItem,
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

type PreparedSearchEntry = {
  viewItem: LookupSearchViewItem;
  combinedSearchText: string;
};

const RESULT_CACHE_LIMIT = 24;

let preparedEntries: PreparedSearchEntry[] | null = null;
let preparedSource: SearchIndexItem[] | null = null;
let resultCache = new Map<string, LookupSearchViewItem[]>();

function normalizeSummary(summary?: string | null) {
  const trimmed = summary?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : "Keine Kurzbeschreibung verfuegbar.";
}

function normalizeQuery(searchTerm: string): string {
  return searchTerm.trim().toLowerCase();
}

function buildPreparedEntries(items: SearchIndexItem[]): PreparedSearchEntry[] {
  return items.map((item) => {
    const summary = normalizeSummary(item.subtitle);

    return {
      viewItem: {
        id: item.id,
        title: item.label,
        summary,
        kind: item.kind,
        category: null,
        versionLabel: null,
        tags: [],
      },
      combinedSearchText: `${item.label.toLowerCase()}\n${summary.toLowerCase()}`,
    };
  });
}

function ensurePreparedEntries(): PreparedSearchEntry[] {
  const items = getSearchIndexItems();

  if (preparedEntries && preparedSource === items) {
    return preparedEntries;
  }

  preparedEntries = buildPreparedEntries(items);
  preparedSource = items;
  resultCache = new Map<string, LookupSearchViewItem[]>();

  return preparedEntries;
}

function getCachedResults(queryLower: string): LookupSearchViewItem[] | undefined {
  const cached = resultCache.get(queryLower);
  if (!cached) {
    return undefined;
  }

  resultCache.delete(queryLower);
  resultCache.set(queryLower, cached);
  return cached;
}

function setCachedResults(queryLower: string, results: LookupSearchViewItem[]): void {
  if (resultCache.has(queryLower)) {
    resultCache.delete(queryLower);
  }

  resultCache.set(queryLower, results);

  if (resultCache.size <= RESULT_CACHE_LIMIT) {
    return;
  }

  const oldestKey = resultCache.keys().next().value;
  if (oldestKey) {
    resultCache.delete(oldestKey);
  }
}

export async function loadLookupSearchResults(searchTerm: string): Promise<LookupSearchViewItem[]> {
  const queryLower = normalizeQuery(searchTerm);

  if (queryLower.length === 0) {
    return [];
  }

  await ensureContentStoreReady();

  const cachedResults = getCachedResults(queryLower);
  if (cachedResults) {
    return cachedResults;
  }

  const results = ensurePreparedEntries()
    .filter((entry) => entry.combinedSearchText.includes(queryLower))
    .map((entry) => entry.viewItem);

  setCachedResults(queryLower, results);
  return results;
}
