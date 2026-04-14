import { initializeContentFromLookupBundle } from "@/data/contentIndex";
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
    dosage: m.dosage.trim().length > 0 ? m.dosage.trim() : null,
    contraindications: [],
    clinicalNotes: m.notes?.trim() ? m.notes.trim() : null,
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

  const steps: LookupDetailStep[] = a.steps.map((step, index) =>
    Object.freeze({
      position: index + 1,
      text: step.text.trim(),
    }),
  );

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
    clinicalNotes: a.notes?.trim() ? a.notes.trim() : null,
    steps: Object.freeze(steps),
    warnings: a.warnings?.trim() ? a.warnings.trim() : null,
  };
}

export async function loadAlgorithmDetailViewData(id: string): Promise<LookupDetailViewData> {
  const bundle = await initializeContentFromLookupBundle();
  const algorithm = bundle.getAlgorithmById(id);
  if (!algorithm) {
    throw new Error(`Algorithmus wurde im Bundle nicht gefunden (ID: ${id}).`);
  }

  const versionLabel = bundle.versionInfo.version?.trim()
    ? bundle.versionInfo.version.trim()
    : null;
  const releasedAtLabel = formatReleasedAt(bundle.versionInfo.createdAt ?? null);

  return algorithmToDetailViewData(algorithm, versionLabel, releasedAtLabel);
}

export async function loadMedicationDetailViewData(id: string): Promise<LookupDetailViewData> {
  const bundle = await initializeContentFromLookupBundle();
  const medication = bundle.getMedicationById(id);
  if (!medication) {
    throw new Error(`Medikament wurde im Bundle nicht gefunden (ID: ${id}).`);
  }

  const versionLabel = bundle.versionInfo.version?.trim()
    ? bundle.versionInfo.version.trim()
    : null;
  const releasedAtLabel = formatReleasedAt(bundle.versionInfo.createdAt ?? null);

  return medicationToDetailViewData(medication, versionLabel, releasedAtLabel);
}
