import {
  ensureContentStoreReady,
  getAlgorithmItems,
  getMedicationItems,
} from '@/data/contentIndex';
import type { Algorithm, ContentCategory, ContentTag, Medication } from '@/types/content';

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

function buildListSubtitle(indication?: string | null): string {
  const trimmed = indication?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : 'Keine Kurzbeschreibung verfuegbar.';
}

function mapMedicationListItem(item: Medication): LookupListRowItem {
  return {
    id: item.id,
    label: item.label,
    listSubtitle: buildListSubtitle(item.indication),
    tags: item.tags,
    category: item.category,
  };
}

function mapAlgorithmListItem(item: Algorithm): LookupListRowItem {
  return {
    id: item.id,
    label: item.label,
    listSubtitle: buildListSubtitle(item.indication),
    tags: item.tags,
    category: item.category,
  };
}

export function resolveLookupRequestContext(): LookupRequestContext {
  const organizationId = process.env.EXPO_PUBLIC_ORGANIZATION_ID?.trim() || 'offline-bundle';
  const regionId = process.env.EXPO_PUBLIC_REGION_ID?.trim();
  const stationId = process.env.EXPO_PUBLIC_STATION_ID?.trim();

  return {
    organizationId,
    regionId: regionId || undefined,
    stationId: stationId || undefined,
  };
}

export async function loadMedicationList(): Promise<LookupListRowItem[]> {
  await ensureContentStoreReady();
  return getMedicationItems().map(mapMedicationListItem);
}

export async function loadAlgorithmList(): Promise<LookupListRowItem[]> {
  await ensureContentStoreReady();
  return getAlgorithmItems().map(mapAlgorithmListItem);
}
