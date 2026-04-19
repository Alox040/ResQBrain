import {
  initializeContent,
  algorithms,
  assertContentInitialized,
  medications,
} from '@/data/contentIndex';
import { loadLookupBundle } from '@/lookup/loadLookupBundle';
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
  return medications.map(mapMedicationListItem);
}

export async function loadAlgorithmList(): Promise<LookupListRowItem[]> {
  await ensureContentStoreReady();
  return algorithms.map(mapAlgorithmListItem);
}
