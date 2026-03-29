/**
 * Rohdaten → Review-Zwischenformat unter data/dbrd-source/normalized/
 * (kompatibel mit scripts/dbrd/build-lookup-seed.ts / intermediateSchemaId).
 *
 * Hinweis: `pnpm dbrd:validate-normalized` prüft das ältere Entity-Bundle
 * (bundleSchemaId + NormalizedAlgorithm/NormalizedMedication). Dieses Skript
 * schreibt bewusst das Zwischenformat für den Phase-0-Seed-Build — nicht beides
 * gemischt validieren.
 *
 * Eingaben (Pfade aus ./common):
 *   data/dbrd-source/raw/algorithms/algorithms.raw.v1.json
 *   data/dbrd-source/raw/medications/medications.raw.v1.json
 *
 * Aufruf:
 *   pnpm exec tsx scripts/dbrd/normalize-dbrd.ts
 */

import {
  isRecord,
  normalizedAlgorithmsPath,
  normalizedMedicationsPath,
  rawAlgorithmsPath,
  rawMedicationsPath,
  readJsonFile,
  repoRoot,
  writeJsonFile,
} from "./common";

const INTERMEDIATE_SCHEMA_ID = "dbrd-source/normalized/review-intermediate/v1";

const RAW_ALGORITHMS_SCHEMA_ID = "dbrd-raw-algorithms/v1";
const RAW_MEDICATIONS_SCHEMA_ID = "dbrd-raw-medications/v1";

type ReviewAlgorithmRow = Record<string, unknown>;
type ReviewMedicationRow = Record<string, unknown>;

type NormalizeStats = {
  algorithmsRecognized: number;
  medicationsRecognized: number;
  missingIndicationAlgorithms: number;
  missingIndicationMedications: number;
  missingStepsAlgorithms: number;
  missingDosageMedications: number;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function asTrimmedString(v: unknown): string {
  if (typeof v !== "string") {
    return "";
  }
  return v.trim();
}

/** Kleinschreibung für Lookup-Kompatibilität; leere Einträge entfernen. */
function normalizeSearchTerms(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (typeof x !== "string") {
      continue;
    }
    const t = x.trim().toLowerCase();
    if (t === "" || seen.has(t)) {
      continue;
    }
    seen.add(t);
    out.push(t);
  }
  return out;
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (typeof x !== "string") {
      continue;
    }
    const t = x.trim().toLowerCase();
    if (t === "" || seen.has(t)) {
      continue;
    }
    seen.add(t);
    out.push(t);
  }
  return out;
}

const SLUG_ID_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function slugifyFallback(text: string): string {
  const base = text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return base === "" ? "eintrag" : base;
}

function draftIdForAlgorithm(rawId: unknown, label: string): string {
  const id = asTrimmedString(rawId);
  if (id !== "" && SLUG_ID_RE.test(id)) {
    return id;
  }
  return `alg-${slugifyFallback(label || "algorithmus")}`;
}

function draftIdForMedication(rawId: unknown, label: string): string {
  const id = asTrimmedString(rawId);
  if (id !== "" && SLUG_ID_RE.test(id)) {
    return id;
  }
  return `med-${slugifyFallback(label || "medikament")}`;
}

function mapApprovalToReviewStatus(v: unknown): string {
  const s = asTrimmedString(v);
  switch (s) {
    case "Released":
      return "released";
    case "InReview":
      return "in_review";
    case "Approved":
      return "approved";
    case "Draft":
      return "draft";
    case "Rejected":
      return "rejected";
    case "Deprecated":
      return "deprecated";
    default:
      return "draft";
  }
}

function readProvenance(o: Record<string, unknown>): {
  source: string;
  sourceSection: string;
  reviewStatus: string;
} {
  const p = o.provenance;
  if (!isRecord(p)) {
    return { source: "", sourceSection: "", reviewStatus: "draft" };
  }
  return {
    source: asTrimmedString(p.source),
    sourceSection: asTrimmedString(p.sourceReference),
    reviewStatus: mapApprovalToReviewStatus(p.approvalStatus),
  };
}

function mergeWarningsAndNotes(warnings: string, clinicalNotes: string): string {
  const w = warnings.trim();
  const c = clinicalNotes.trim();
  if (w && c) {
    return `${w}\n\n${c}`;
  }
  return w || c;
}

type ParsedStep = { order: number; text: string };

function parseAlgorithmSteps(raw: unknown): ParsedStep[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const rows: ParsedStep[] = [];
  for (let i = 0; i < raw.length; i++) {
    const s = raw[i];
    if (!isRecord(s)) {
      continue;
    }
    const textBody = asTrimmedString(s.text);
    const title = asTrimmedString(s.title);
    const textCombined =
      title === "" ? textBody : textBody === "" ? title : `${title}: ${textBody}`;
    if (textCombined === "") {
      continue;
    }
    let order = typeof s.order === "number" && Number.isFinite(s.order) ? Math.trunc(s.order) : NaN;
    if (!Number.isFinite(order) || order < 1) {
      order = rows.length + 1;
    }
    rows.push({ order, text: textCombined });
  }
  rows.sort((a, b) => a.order - b.order);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = { order: i + 1, text: rows[i].text };
  }
  return rows;
}

function parseRelatedMedicationIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (typeof x !== "string") {
      continue;
    }
    const t = x.trim();
    if (t === "" || seen.has(t)) {
      continue;
    }
    if (!SLUG_ID_RE.test(t)) {
      continue;
    }
    seen.add(t);
    out.push(t);
  }
  return out;
}

function parseMedicationDosage(o: Record<string, unknown>): {
  summary: string;
  detail: string;
} {
  const d = o.dosage;
  if (!isRecord(d)) {
    return { summary: "", detail: "" };
  }
  return {
    summary: asTrimmedString(d.summary),
    detail: asTrimmedString(d.detail),
  };
}

function parseMedicationNotes(o: Record<string, unknown>): string {
  const parts: string[] = [];
  const c = asTrimmedString(o.contraindicationsNote);
  const n = asTrimmedString(o.clinicalNotes);
  if (c) {
    parts.push(c);
  }
  if (n) {
    parts.push(n);
  }
  return parts.join("\n\n");
}

function transformAlgorithms(
  data: unknown,
  stats: NormalizeStats,
): ReviewAlgorithmRow[] {
  if (!isRecord(data)) {
    console.warn("[normalize-dbrd] Algorithmen: Wurzel ist kein Objekt — leeres Array.");
    return [];
  }
  const schemaId = asTrimmedString(data.schemaId);
  if (schemaId !== RAW_ALGORITHMS_SCHEMA_ID) {
    console.warn(
      `[normalize-dbrd] Algorithmen: Unerwartetes schemaId "${schemaId}" (erwartet ${RAW_ALGORITHMS_SCHEMA_ID}).`,
    );
  }
  const items = data.items;
  if (!Array.isArray(items)) {
    console.warn('[normalize-dbrd] Algorithmen: "items" fehlt oder ist kein Array.');
    return [];
  }

  const out: ReviewAlgorithmRow[] = [];

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (!isRecord(raw)) {
      console.warn(`[normalize-dbrd] Algorithmen: items[${i}] übersprungen (kein Objekt).`);
      continue;
    }

    stats.algorithmsRecognized += 1;

    const label = asTrimmedString(raw.label);
    const indication = asTrimmedString(raw.indication);
    if (!isNonEmptyString(indication)) {
      stats.missingIndicationAlgorithms += 1;
    }

    const stepsParsed = parseAlgorithmSteps(raw.steps);
    if (stepsParsed.length === 0) {
      stats.missingStepsAlgorithms += 1;
    }

    const prov = readProvenance(raw);
    const warningsCombined = mergeWarningsAndNotes(
      asTrimmedString(raw.warnings),
      asTrimmedString(raw.clinicalNotes),
    );

    const row: ReviewAlgorithmRow = {
      source: prov.source || "unbekannte-quelle",
      sourceSection: prov.sourceSection,
      draftId: draftIdForAlgorithm(raw.id, label),
      label: label || "Ohne Titel",
      indication,
      steps: stepsParsed.map((s) => ({ order: s.order, text: s.text })),
      relatedMedicationDraftIds: parseRelatedMedicationIds(raw.relatedMedicationIds),
      tags: normalizeTags(raw.tags),
      searchTerms: normalizeSearchTerms(raw.searchTerms),
      reviewStatus: prov.reviewStatus,
      openQuestions: [],
    };
    if (warningsCombined !== "") {
      row.warnings = warningsCombined;
    }

    out.push(row);
  }

  return out;
}

function transformMedications(
  data: unknown,
  stats: NormalizeStats,
): ReviewMedicationRow[] {
  if (!isRecord(data)) {
    console.warn("[normalize-dbrd] Medikamente: Wurzel ist kein Objekt — leeres Array.");
    return [];
  }
  const schemaId = asTrimmedString(data.schemaId);
  if (schemaId !== RAW_MEDICATIONS_SCHEMA_ID) {
    console.warn(
      `[normalize-dbrd] Medikamente: Unerwartetes schemaId "${schemaId}" (erwartet ${RAW_MEDICATIONS_SCHEMA_ID}).`,
    );
  }
  const items = data.items;
  if (!Array.isArray(items)) {
    console.warn('[normalize-dbrd] Medikamente: "items" fehlt oder ist kein Array.');
    return [];
  }

  const out: ReviewMedicationRow[] = [];

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (!isRecord(raw)) {
      console.warn(`[normalize-dbrd] Medikamente: items[${i}] übersprungen (kein Objekt).`);
      continue;
    }

    stats.medicationsRecognized += 1;

    const label = asTrimmedString(raw.label);
    const indication = asTrimmedString(raw.indication);
    if (!isNonEmptyString(indication)) {
      stats.missingIndicationMedications += 1;
    }

    const { summary, detail } = parseMedicationDosage(raw);
    if (!isNonEmptyString(summary)) {
      stats.missingDosageMedications += 1;
    }

    const prov = readProvenance(raw);

    const row: ReviewMedicationRow = {
      source: prov.source || "unbekannte-quelle",
      sourceSection: prov.sourceSection,
      draftId: draftIdForMedication(raw.id, label),
      label: label || "Ohne Titel",
      indication,
      dosageSummary: summary,
      dosageDetail: detail,
      notes: parseMedicationNotes(raw),
      tags: normalizeTags(raw.tags),
      searchTerms: normalizeSearchTerms(raw.searchTerms),
      reviewStatus: prov.reviewStatus,
      openQuestions: [],
    };

    out.push(row);
  }

  return out;
}

function printSummary(stats: NormalizeStats): void {
  const entries =
    stats.algorithmsRecognized +
    stats.medicationsRecognized;
  const missingIndication =
    stats.missingIndicationAlgorithms + stats.missingIndicationMedications;
  const missingSteps = stats.missingStepsAlgorithms;
  const missingDosage = stats.missingDosageMedications;

  console.log("");
  console.log("[normalize-dbrd] — Auswertung");
  console.log(`  Erkannte Einträge (gesamt):     ${entries}`);
  console.log(`    · Algorithmen:               ${stats.algorithmsRecognized}`);
  console.log(`    · Medikamente:               ${stats.medicationsRecognized}`);
  console.log(`  Fehlende Indikation (gesamt):   ${missingIndication}`);
  console.log(`    · Algorithmen:               ${stats.missingIndicationAlgorithms}`);
  console.log(`    · Medikamente:               ${stats.missingIndicationMedications}`);
  console.log(`  Fehlende Algorithmus-Schritte:  ${missingSteps} (Einträge ohne parsebare Schritte)`);
  console.log(`  Fehlende Medikations-Dosierung: ${missingDosage} (leeres dosage.summary)`);
  console.log("");
  console.log(`Repo: ${repoRoot}`);
}

export function runNormalizeDbrd(): void {
  const stats: NormalizeStats = {
    algorithmsRecognized: 0,
    medicationsRecognized: 0,
    missingIndicationAlgorithms: 0,
    missingIndicationMedications: 0,
    missingStepsAlgorithms: 0,
    missingDosageMedications: 0,
  };

  const algPath = rawAlgorithmsPath();
  const medPath = rawMedicationsPath();
  console.log(`[normalize-dbrd] Lese Algorithmen: ${algPath}`);
  const rawAlg = readJsonFile(algPath);
  console.log(`[normalize-dbrd] Lese Medikamente: ${medPath}`);
  const rawMed = readJsonFile(medPath);

  const algorithms = transformAlgorithms(rawAlg, stats);
  const medications = transformMedications(rawMed, stats);

  const algorithmsOut = {
    intermediateSchemaId: INTERMEDIATE_SCHEMA_ID,
    description:
      "Automatisch aus Rohdaten erzeugt (normalize-dbrd.ts) — Review-Zwischenformat für build-lookup-seed.",
    algorithms,
  };

  const medicationsOut = {
    intermediateSchemaId: INTERMEDIATE_SCHEMA_ID,
    description:
      "Automatisch aus Rohdaten erzeugt (normalize-dbrd.ts) — Review-Zwischenformat für build-lookup-seed.",
    medications,
  };

  writeJsonFile(normalizedAlgorithmsPath(), algorithmsOut);
  writeJsonFile(normalizedMedicationsPath(), medicationsOut);

  console.log(`[normalize-dbrd] Geschrieben: ${normalizedAlgorithmsPath()}`);
  console.log(`[normalize-dbrd] Geschrieben: ${normalizedMedicationsPath()}`);

  printSummary(stats);
}

function main(): void {
  try {
    runNormalizeDbrd();
  } catch (e) {
    console.error("[normalize-dbrd] Abbruch:", e);
    process.exit(1);
  }
}

main();
