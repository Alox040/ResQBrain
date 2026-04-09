import {
  listAlgorithms,
  listMedications,
} from "@/lib/lookup-api/client";
import type {
  LookupAlgorithmListItem,
  LookupAlgorithmsResponse,
  LookupMedicationListItem,
  LookupMedicationsResponse,
} from "@/lib/lookup-api/types";
import type { ContentCategory, ContentTag } from "@/types/content";

export type LookupRequestContext = {
  organizationId: string;
  regionId?: string;
  stationId?: string;
};

export type LookupListRowItem = {
  id: string;
  label: string;
  listSubtitle: string;
  tags: ContentTag[];
  category?: ContentCategory;
};

const CONTENT_CATEGORIES: readonly ContentCategory[] = [
  "pediatrics",
  "trauma",
  "sepsis",
  "resuscitation",
];

const CONTENT_TAGS: readonly ContentTag[] = [
  "kreislauf",
  "atemwege",
  "neurologie",
  "analgesie",
  "intoxikation",
  "stoffwechsel",
];

function normalizeCategory(value?: string | null): ContentCategory | undefined {
  if (value == null) {
    return undefined;
  }

  return CONTENT_CATEGORIES.find((entry) => entry === value);
}

function normalizeTags(values?: readonly string[]): ContentTag[] {
  if (values == null) {
    return [];
  }

  return values.filter((value): value is ContentTag => CONTENT_TAGS.includes(value as ContentTag));
}

function buildListSubtitle(summary?: string | null) {
  const trimmed = summary?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : "Keine Kurzbeschreibung verfuegbar.";
}

function mapAlgorithmListItem(item: LookupAlgorithmListItem): LookupListRowItem {
  return {
    id: item.id,
    label: item.title,
    listSubtitle: buildListSubtitle(item.summary),
    tags: normalizeTags(item.tags),
    category: normalizeCategory(item.category),
  };
}

function mapMedicationListItem(item: LookupMedicationListItem): LookupListRowItem {
  return {
    id: item.id,
    label: item.name,
    listSubtitle: buildListSubtitle(item.summary),
    tags: normalizeTags(item.tags),
    category: normalizeCategory(item.category),
  };
}

export function resolveLookupRequestContext(): LookupRequestContext {
  const organizationId = process.env.EXPO_PUBLIC_ORGANIZATION_ID?.trim();
  const regionId = process.env.EXPO_PUBLIC_REGION_ID?.trim();
  const stationId = process.env.EXPO_PUBLIC_STATION_ID?.trim();

  if (!organizationId) {
    throw new Error("EXPO_PUBLIC_ORGANIZATION_ID ist nicht gesetzt.");
  }

  return {
    organizationId,
    regionId: regionId || undefined,
    stationId: stationId || undefined,
  };
}

export async function loadAlgorithmList() {
  const context = resolveLookupRequestContext();
  const response: LookupAlgorithmsResponse = await listAlgorithms(context);
  return response.items.map(mapAlgorithmListItem);
}

export async function loadMedicationList() {
  const context = resolveLookupRequestContext();
  const response: LookupMedicationsResponse = await listMedications(context);
  return response.items.map(mapMedicationListItem);
}
