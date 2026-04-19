import {
  assertContentInitialized,
  getAlgorithmById,
  getContentVersionInfo,
  initializeContent,
  getMedicationById,
} from "@/data/contentIndex";
import { loadLookupBundle } from "@/lookup/loadLookupBundle";
import type { Algorithm, Medication } from "@/types/content";

export type LookupDetailStep = Readonly<{
  position: number;
  text: string;
}>;

export type LookupDetailViewData = {
  id: string;
  title: string;
  summary: string;
  /** Lead text under the title (bundle `indication`). */
  heroIndication: string;
  categoryLabel: string | null;
  versionLabel: string | null;
  releasedAtLabel: string | null;
  currentReleasedVersionId: string;
  scope: string | null;
  visibility: string | null;
  tags: string[];
  /** Medication: dosing text from bundle when present. */
  dosage: string | null;
  /** Medication: structured contraindications when present in data (Phase 0: often empty). */
  contraindications: readonly string[];
  /** Medication: free-text clinical notes from bundle when present. */
  clinicalNotes: string | null;
  /** Algorithm: ordered steps from bundle when present. */
  steps: readonly LookupDetailStep[];
  /** Algorithm: safety warnings from bundle when present. */
  warnings: string | null;
};

const CONTENT_STORE_READY_PROMISE_KEY = '__lookupContentStoreReadyPromise__';

type ContentStoreGlobal = typeof globalThis & {
  [CONTENT_STORE_READY_PROMISE_KEY]?: Promise<void>;
};

function normalizeSummary(text?: string | null) {
  const trimmed = text?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : "Keine Kurzbeschreibung verfuegbar.";
}

function normalizeLabel(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function formatReleasedAt(value?: string | null) {
  const normalized = normalizeLabel(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return parsed.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function medicationToDetailViewData(
  m: Medication,
  bundleVersionLabel: string | null,
  bundleReleasedAtLabel: string | null,
): LookupDetailViewData {
  const summary = normalizeSummary(m.indication);
  const hero = m.indication.trim().length > 0 ? m.indication.trim() : summary;

  return {
    id: m.id,
    title: m.label,
    summary,
    heroIndication: hero,
    categoryLabel: m.category ?? null,
    versionLabel: bundleVersionLabel,
    releasedAtLabel: bundleReleasedAtLabel,
    currentReleasedVersionId: bundleVersionLabel ?? "embedded-bundle",
    scope: null,
    visibility: null,
    tags: m.tags.map((t) => String(t)),
    dosage: null,
    contraindications: [],
    clinicalNotes: null,
    steps: [],
    warnings: null,
  };
}

function algorithmToDetailViewData(
  a: Algorithm,
  bundleVersionLabel: string | null,
  bundleReleasedAtLabel: string | null,
): LookupDetailViewData {
  const summary = normalizeSummary(a.indication);
  const hero = a.indication.trim().length > 0 ? a.indication.trim() : summary;

  return {
    id: a.id,
    title: a.label,
    summary,
    heroIndication: hero,
    categoryLabel: a.category ?? null,
    versionLabel: bundleVersionLabel,
    releasedAtLabel: bundleReleasedAtLabel,
    currentReleasedVersionId: bundleVersionLabel ?? "embedded-bundle",
    scope: null,
    visibility: null,
    tags: a.tags.map((t) => String(t)),
    dosage: null,
    contraindications: [],
    clinicalNotes: null,
    steps: Object.freeze([]),
    warnings: null,
  };
}

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

export async function loadAlgorithmDetailViewData(id: string): Promise<LookupDetailViewData> {
  await ensureContentStoreReady();

  const algorithm = getAlgorithmById(id);
  if (!algorithm) {
    throw new Error('Eintrag nicht gefunden');
  }

  const versionInfo = getContentVersionInfo();
  const versionLabel = versionInfo.version?.trim()
    ? versionInfo.version.trim()
    : null;
  const releasedAtLabel = formatReleasedAt(versionInfo.createdAt ?? null);

  return algorithmToDetailViewData(algorithm, versionLabel, releasedAtLabel);
}

export async function loadMedicationDetailViewData(id: string): Promise<LookupDetailViewData> {
  await ensureContentStoreReady();

  const medication = getMedicationById(id);
  if (!medication) {
    throw new Error('Eintrag nicht gefunden');
  }

  const versionInfo = getContentVersionInfo();
  const versionLabel = versionInfo.version?.trim()
    ? versionInfo.version.trim()
    : null;
  const releasedAtLabel = formatReleasedAt(versionInfo.createdAt ?? null);

  return medicationToDetailViewData(medication, versionLabel, releasedAtLabel);
}
