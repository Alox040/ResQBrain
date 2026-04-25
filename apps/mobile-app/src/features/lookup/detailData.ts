import {
  ensureContentStoreReady,
  getAlgorithmById,
  getContentVersionInfo,
  getMedicationById,
} from "@/data/contentIndex";
import { LookupContentError } from "@/lookup/lookupErrors";
import type { Algorithm, Medication } from "@/types/content";

export type LookupDetailStep = Readonly<{
  position: number;
  text: string;
}>;

export type LookupDetailSectionView = Readonly<{
  title: string;
  content: string;
  defaultExpanded?: boolean;
  muted?: boolean;
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
  /** Preprocessed UI sections for detail rendering. */
  sections: readonly LookupDetailSectionView[];
};

const NO_TAGS_CONTENT = "Keine Tags hinterlegt.";
const SOURCE_SECTION_CONTENT =
  "Freigegebener Referenzeintrag ohne operative Anleitung.";
const EMPTY_CONTRAINDICATIONS: readonly string[] = Object.freeze([]);
const EMPTY_STEPS: readonly LookupDetailStep[] = Object.freeze([]);

function buildMedicationSections(
  medication: Medication,
  summary: string,
): readonly LookupDetailSectionView[] {
  const tagsContent =
    medication.tags.length > 0
      ? medication.tags.join(", ")
      : NO_TAGS_CONTENT;

  return Object.freeze([
    {
      title: "Zusammenfassung",
      content: summary,
      defaultExpanded: true,
    },
    {
      title: "Quelle",
      content: SOURCE_SECTION_CONTENT,
      defaultExpanded: true,
    },
    {
      title: "Tags",
      content: tagsContent,
      defaultExpanded: false,
      muted: medication.tags.length === 0,
    },
  ]);
}

function buildAlgorithmSections(
  algorithm: Algorithm,
  summary: string,
): readonly LookupDetailSectionView[] {
  const tagsContent =
    algorithm.tags.length > 0
      ? algorithm.tags.join(", ")
      : NO_TAGS_CONTENT;

  return Object.freeze([
    {
      title: "Zusammenfassung",
      content: summary,
      defaultExpanded: true,
    },
    {
      title: "Tags",
      content: tagsContent,
      defaultExpanded: false,
      muted: algorithm.tags.length === 0,
    },
  ]);
}

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
  const sections = buildMedicationSections(m, summary);

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
    contraindications: EMPTY_CONTRAINDICATIONS,
    clinicalNotes: null,
    steps: EMPTY_STEPS,
    warnings: null,
    sections,
  };
}

function algorithmToDetailViewData(
  a: Algorithm,
  bundleVersionLabel: string | null,
  bundleReleasedAtLabel: string | null,
): LookupDetailViewData {
  const summary = normalizeSummary(a.indication);
  const hero = a.indication.trim().length > 0 ? a.indication.trim() : summary;
  const sections = buildAlgorithmSections(a, summary);

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
    contraindications: EMPTY_CONTRAINDICATIONS,
    clinicalNotes: null,
    steps: EMPTY_STEPS,
    warnings: null,
    sections,
  };
}

export async function loadAlgorithmDetailViewData(id: string): Promise<LookupDetailViewData> {
  await ensureContentStoreReady();

  const algorithm = getAlgorithmById(id);
  if (!algorithm) {
    throw new LookupContentError({
      code: 'LOOKUP_CONTENT_ITEM_NOT_FOUND',
      message: `Lookup algorithm id "${id}" was not found in the embedded bundle.`,
    });
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
    throw new LookupContentError({
      code: 'LOOKUP_CONTENT_ITEM_NOT_FOUND',
      message: `Lookup medication id "${id}" was not found in the embedded bundle.`,
    });
  }

  const versionInfo = getContentVersionInfo();
  const versionLabel = versionInfo.version?.trim()
    ? versionInfo.version.trim()
    : null;
  const releasedAtLabel = formatReleasedAt(versionInfo.createdAt ?? null);

  return medicationToDetailViewData(medication, versionLabel, releasedAtLabel);
}
