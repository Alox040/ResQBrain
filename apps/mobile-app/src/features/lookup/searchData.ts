import {
  getLookupApiErrorMessage,
  searchLookup,
} from "@/lib/lookup-api/client";
import type { LookupSearchResultItem } from "@/lib/lookup-api/types";
import { resolveLookupRequestContext } from "@/features/lookup/listData";

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

function resolveLookupKind(item: LookupSearchResultItem): LookupSearchKind | undefined {
  const record = item as LookupSearchResultItem & {
    kind?: unknown;
    contentType?: unknown;
    type?: unknown;
  };

  const value = record.kind ?? record.contentType ?? record.type;

  if (value === "algorithm" || value === "medication") {
    return value;
  }

  return undefined;
}

function mapSearchResult(item: LookupSearchResultItem): LookupSearchViewItem {
  return {
    id: item.id,
    title: item.title,
    summary: normalizeSummary(item.summary),
    kind: resolveLookupKind(item),
    category: item.category ?? null,
    versionLabel: item.versionLabel ?? null,
    tags: item.tags?.filter((tag): tag is string => tag.trim().length > 0) ?? [],
  };
}

export async function loadLookupSearchResults(searchTerm: string) {
  try {
    const results = await searchLookup({
      ...resolveLookupRequestContext(),
      searchTerm,
    });

    return results.map(mapSearchResult);
  } catch (error) {
    throw new Error(getLookupApiErrorMessage(error));
  }
}
