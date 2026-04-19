import {
  initializeContent,
  assertContentInitialized,
  searchIndexItems,
} from "@/data/contentIndex";
import { loadLookupBundle } from "@/lookup/loadLookupBundle";

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

const CONTENT_STORE_READY_PROMISE_KEY = '__lookupContentStoreReadyPromise__';

type ContentStoreGlobal = typeof globalThis & {
  [CONTENT_STORE_READY_PROMISE_KEY]?: Promise<void>;
};

async function ensureContentStoreReady(): Promise<void> {
  try {
    assertContentInitialized();
    return;
  } catch {
    // Fall through to lazy initialization.
  }

  const state = globalThis as ContentStoreGlobal;
  if (!state[CONTENT_STORE_READY_PROMISE_KEY]) {
    state[CONTENT_STORE_READY_PROMISE_KEY] = (async () => {
      try {
        const bundle = await loadLookupBundle();
        initializeContent(bundle);
        assertContentInitialized();
      } catch {
        throw new Error('Inhalte konnten nicht geladen werden');
      }
    })().catch((error) => {
      delete state[CONTENT_STORE_READY_PROMISE_KEY];
      throw error;
    });
  }

  await state[CONTENT_STORE_READY_PROMISE_KEY];
}

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

  return searchIndexItems
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
