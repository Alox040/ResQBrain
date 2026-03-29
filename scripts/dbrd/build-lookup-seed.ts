/**
 * Erzeugt `data/lookup-seed/*.json` aus
 * `data/dbrd-source/normalized/medications.normalized.v1.json` und
 * `data/dbrd-source/normalized/algorithms.normalized.v1.json`.
 * Validierung: gleiche Regeln wie die Mobile-App (`validateLookupBundle`).
 *
 * Aufruf:
 *   pnpm dbrd:build-lookup-seed
 *   pnpm exec tsx scripts/dbrd/build-lookup-seed.ts
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALGORITHM_ITEM_KEYS,
  LOOKUP_MANIFEST_KEYS,
  MEDICATION_ITEM_KEYS,
} from "../../apps/mobile-app/src/lookup/lookupSchema";
import { validateLookupBundle } from "../../apps/mobile-app/src/lookup/validateLookupBundle";
import {
  lookupAlgorithmsSeedPath,
  lookupManifestSeedPath,
  lookupMedicationsSeedPath,
  normalizedAlgorithmsPath,
  normalizedMedicationsPath,
  readJsonFile,
  writeJsonFile,
} from "./common";

const INTERMEDIATE_SCHEMA_ID = "dbrd-source/normalized/review-intermediate/v1";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function seedFail(detail: string, cause?: unknown): never {
  console.error("[dbrd-seed] FEHLER:", detail);
  if (cause !== undefined) {
    console.error(cause);
  }
  process.exit(1);
}

function parseArgs(argv: string[]): { help: boolean } {
  let help = false;
  for (const a of argv) {
    if (a === "-h" || a === "--help") {
      help = true;
    }
  }
  return { help };
}

/** Review-Zwischenformat: Einträge mit TEMPLATE-Id oder TEMPLATE:-Titel nicht ins Seed übernehmen. */
function isTemplateEntry(idRaw: unknown, titleOrLabel: unknown): boolean {
  if (typeof idRaw === "string" && idRaw.toLowerCase().includes("template")) {
    return true;
  }
  if (
    typeof titleOrLabel === "string" &&
    titleOrLabel.trim().toUpperCase().startsWith("TEMPLATE:")
  ) {
    return true;
  }
  return false;
}

function requireNonEmptyString(v: unknown, ctx: string): string {
  if (typeof v !== "string" || v.trim() === "") {
    seedFail(`${ctx}: erwartet nicht-leeren String`);
  }
  return v.trim();
}

function optionalTrimmedString(v: unknown): string | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }
  if (typeof v !== "string") {
    return undefined;
  }
  const t = v.trim();
  return t === "" ? undefined : t;
}

function stringArrayOrEmpty(v: unknown, ctx: string): string[] {
  if (v === undefined || v === null) {
    return [];
  }
  if (!Array.isArray(v)) {
    seedFail(`${ctx}: erwartet Array oder fehlend`);
  }
  const out: string[] = [];
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string" || v[i].trim() === "") {
      seedFail(`${ctx}[${i}]: erwartet nicht-leeren String`);
    }
    out.push(v[i].trim());
  }
  return out;
}

function joinDosageSummaryDetail(summaryRaw: unknown, detailRaw: unknown, ctx: string): string {
  const summary =
    typeof summaryRaw === "string"
      ? summaryRaw.trim()
      : seedFail(`${ctx}: dosage.summary bzw. dosageSummary fehlt oder ungültig`);
  const detail = typeof detailRaw === "string" ? detailRaw.trim() : "";
  if (summary === "") {
    seedFail(`${ctx}: Dosier-Zusammenfassung darf nicht leer sein`);
  }
  if (detail.length > 0) {
    return `${summary}\n\n${detail}`;
  }
  return summary;
}

function resolveDosage(m: Record<string, unknown>, ctx: string): string {
  const d = m.dosage;
  if (isPlainObject(d)) {
    return joinDosageSummaryDetail(d.summary, d.detail, `${ctx}.dosage`);
  }
  return joinDosageSummaryDetail(m.dosageSummary, m.dosageDetail, ctx);
}

/** Kontraindikationen/Klinik aus neuem Modell; sonst Legacy `notes`. */
function buildMedicationNotes(m: Record<string, unknown>): string | undefined {
  const parts: string[] = [];
  const contra = optionalTrimmedString(m.contraindicationsNote);
  const clinical = optionalTrimmedString(m.clinicalNotes);
  if (contra !== undefined) {
    parts.push(contra);
  }
  if (clinical !== undefined) {
    parts.push(clinical);
  }
  if (parts.length > 0) {
    return parts.join("\n\n");
  }
  return optionalTrimmedString(m.notes);
}

function resolveEntityId(row: Record<string, unknown>, ctx: string): string {
  const fromId = optionalTrimmedString(row.id);
  if (fromId !== undefined) {
    return fromId;
  }
  return requireNonEmptyString(row.draftId, `${ctx}.draftId`);
}

function resolveTitle(row: Record<string, unknown>, ctx: string): string {
  const fromTitle = optionalTrimmedString(row.title);
  if (fromTitle !== undefined) {
    return fromTitle;
  }
  return requireNonEmptyString(row.label, `${ctx}.label`);
}

function resolveRelatedAlgorithmIds(
  m: Record<string, unknown>,
  index: number,
  computed: string[],
): string[] {
  const ctx = `medications[${index}].relatedAlgorithmIds`;
  if (Object.prototype.hasOwnProperty.call(m, "relatedAlgorithmIds")) {
    if (!Array.isArray(m.relatedAlgorithmIds)) {
      seedFail(`${ctx}: erwartet Array`);
    }
    return stringArrayOrEmpty(m.relatedAlgorithmIds, ctx);
  }
  return [...computed];
}

function relatedMedicationIdsFromAlgorithm(a: Record<string, unknown>, ctx: string): string[] {
  if (Object.prototype.hasOwnProperty.call(a, "relatedMedicationIds")) {
    return stringArrayOrEmpty(a.relatedMedicationIds, `${ctx}.relatedMedicationIds`);
  }
  if (Object.prototype.hasOwnProperty.call(a, "relatedMedicationDraftIds")) {
    return stringArrayOrEmpty(a.relatedMedicationDraftIds, `${ctx}.relatedMedicationDraftIds`);
  }
  return [];
}

type ReviewMedication = Record<string, unknown>;
type ReviewAlgorithm = Record<string, unknown>;

function loadReviewMedications(filePath: string): ReviewMedication[] {
  const raw = readJsonFile(filePath);
  if (!isPlainObject(raw)) {
    seedFail(`Erwartet Objekt in ${filePath}`);
  }
  if (raw.intermediateSchemaId !== INTERMEDIATE_SCHEMA_ID) {
    seedFail(
      `Unerwartetes intermediateSchemaId in Medikamenten-Datei: ${String(raw.intermediateSchemaId)} (erwartet ${INTERMEDIATE_SCHEMA_ID})`,
    );
  }
  const list = raw.medications;
  if (!Array.isArray(list)) {
    seedFail(`medications muss ein Array sein (${filePath}).`);
  }
  const out: ReviewMedication[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!isPlainObject(item)) {
      seedFail(`medications[${i}]: kein Objekt.`);
    }
    out.push(item);
  }
  return out;
}

function loadReviewAlgorithms(filePath: string): ReviewAlgorithm[] {
  const raw = readJsonFile(filePath);
  if (!isPlainObject(raw)) {
    seedFail(`Erwartet Objekt in ${filePath}`);
  }
  if (raw.intermediateSchemaId !== INTERMEDIATE_SCHEMA_ID) {
    seedFail(
      `Unerwartetes intermediateSchemaId in Algorithmen-Datei: ${String(raw.intermediateSchemaId)} (erwartet ${INTERMEDIATE_SCHEMA_ID})`,
    );
  }
  const list = raw.algorithms;
  if (!Array.isArray(list)) {
    seedFail(`algorithms muss ein Array sein (${filePath}).`);
  }
  const out: ReviewAlgorithm[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!isPlainObject(item)) {
      seedFail(`algorithms[${i}]: kein Objekt.`);
    }
    out.push(item);
  }
  return out;
}

function mapMedicationToLookup(
  m: ReviewMedication,
  index: number,
  relatedAlgorithmIds: string[],
): Record<string, unknown> {
  const ctx = `medications[${index}]`;
  const id = resolveEntityId(m, ctx);
  const label = resolveTitle(m, ctx);
  const indication = requireNonEmptyString(m.indication, `${ctx}.indication`);
  const dosage = resolveDosage(m, ctx);
  const tags = stringArrayOrEmpty(m.tags, `${ctx}.tags`);
  const searchTerms = stringArrayOrEmpty(m.searchTerms, `${ctx}.searchTerms`);

  const out: Record<string, unknown> = {
    id,
    kind: "medication",
    label,
    indication,
    tags,
    searchTerms,
    dosage,
    relatedAlgorithmIds: resolveRelatedAlgorithmIds(m, index, relatedAlgorithmIds),
  };

  const notes = buildMedicationNotes(m);
  if (notes !== undefined) {
    out.notes = notes;
  }

  return out;
}

type StepRow = { order: number; text: string };

function parseAlgorithmSteps(raw: unknown, ctx: string): StepRow[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    seedFail(`${ctx}.steps: mindestens ein Schritt erforderlich`);
  }
  const rows: StepRow[] = [];
  for (let i = 0; i < raw.length; i++) {
    const s = raw[i];
    if (!isPlainObject(s)) {
      seedFail(`${ctx}.steps[${i}]: kein Objekt`);
    }
    const text = requireNonEmptyString(s.text, `${ctx}.steps[${i}].text`);
    let order = i + 1;
    if (s.order !== undefined) {
      if (typeof s.order !== "number" || !Number.isFinite(s.order)) {
        seedFail(`${ctx}.steps[${i}].order: erwartet Zahl`);
      }
      order = s.order;
    }
    rows.push({ order, text });
  }
  rows.sort((a, b) => a.order - b.order);
  return rows;
}

function mapAlgorithmToLookup(a: ReviewAlgorithm, index: number): Record<string, unknown> {
  const ctx = `algorithms[${index}]`;
  const id = resolveEntityId(a, ctx);
  const label = resolveTitle(a, ctx);
  const indication = requireNonEmptyString(a.indication, `${ctx}.indication`);
  const stepRows = parseAlgorithmSteps(a.steps, ctx);
  const steps = stepRows.map((r) => ({ text: r.text }));
  const tags = stringArrayOrEmpty(a.tags, `${ctx}.tags`);
  const searchTerms = stringArrayOrEmpty(a.searchTerms, `${ctx}.searchTerms`);
  const relatedMedicationIds = relatedMedicationIdsFromAlgorithm(a, ctx);

  const out: Record<string, unknown> = {
    id,
    kind: "algorithm",
    label,
    indication,
    tags,
    searchTerms,
    steps,
    relatedMedicationIds,
  };

  const warnings = optionalTrimmedString(a.warnings);
  if (warnings !== undefined) {
    out.warnings = warnings;
  }

  const notes =
    optionalTrimmedString(a.clinicalNotes) ?? optionalTrimmedString(a.notes);
  if (notes !== undefined) {
    out.notes = notes;
  }

  return out;
}

function sortByLabel<T extends Record<string, unknown>>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const la = typeof a.label === "string" ? a.label : "";
    const lb = typeof b.label === "string" ? b.label : "";
    return la.localeCompare(lb, "de", { sensitivity: "base" });
  });
}

/**
 * Aus Algorithmus → Medikament: fehlende relatedAlgorithmIds ergänzen (IDs = Seed-IDs).
 */
function buildMedIdToAlgorithmIds(keptAlgorithms: ReviewAlgorithm[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (let i = 0; i < keptAlgorithms.length; i++) {
    const a = keptAlgorithms[i];
    const ctx = `algorithms[${i}]`;
    const algId = resolveEntityId(a, ctx);
    const mids = relatedMedicationIdsFromAlgorithm(a, ctx);
    for (const mid of mids) {
      const prev = map.get(mid) ?? [];
      if (!prev.includes(algId)) {
        prev.push(algId);
      }
      map.set(mid, prev);
    }
  }
  for (const [k, ids] of map) {
    ids.sort((x, y) => x.localeCompare(y, "de", { sensitivity: "base" }));
    map.set(k, ids);
  }
  return map;
}

function readOptionalManifestSeed(manifestPath: string): Record<string, unknown> | undefined {
  try {
    const text = readFileSync(manifestPath, "utf8");
    const parsed = JSON.parse(text) as unknown;
    if (!isPlainObject(parsed)) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

/** Nur erlaubte Manifest-Keys; `generatedAt` immer neu. */
function buildManifest(manifestPath: string): Record<string, unknown> {
  const existing = readOptionalManifestSeed(manifestPath);
  const out: Record<string, unknown> = {
    schemaVersion: "1",
    bundleId: "pilot-wache-001",
    generatedAt: new Date().toISOString(),
  };

  if (existing) {
    for (const key of LOOKUP_MANIFEST_KEYS) {
      if (key === "generatedAt") {
        continue;
      }
      if (
        Object.prototype.hasOwnProperty.call(existing, key) &&
        existing[key] !== undefined
      ) {
        out[key] = existing[key];
      }
    }
  }

  out.generatedAt = new Date().toISOString();

  const extras = Object.keys(out).filter((k) => !LOOKUP_MANIFEST_KEYS.has(k));
  if (extras.length > 0) {
    seedFail(`Interner Fehler: Manifest enthält unerlaubte Keys: ${extras.sort().join(", ")}`);
  }

  return out;
}

function unknownKeys(obj: Record<string, unknown>, allowed: Set<string>): string[] {
  return Object.keys(obj).filter((k) => !allowed.has(k));
}

function assertLookupSeedSchemaKeys(
  manifest: Record<string, unknown>,
  medications: Record<string, unknown>[],
  algorithms: Record<string, unknown>[],
): void {
  const problems: string[] = [];

  const manifestExtras = unknownKeys(manifest, LOOKUP_MANIFEST_KEYS);
  if (manifestExtras.length > 0) {
    problems.push(`manifest: unbekannte Keys: ${manifestExtras.sort().join(", ")}`);
  }

  medications.forEach((m, i) => {
    const extras = unknownKeys(m, MEDICATION_ITEM_KEYS);
    if (extras.length > 0) {
      problems.push(
        `medications[${i}] (id=${String(m.id)}): unbekannte Keys: ${extras.sort().join(", ")}`,
      );
    }
  });

  algorithms.forEach((a, i) => {
    const extras = unknownKeys(a, ALGORITHM_ITEM_KEYS);
    if (extras.length > 0) {
      problems.push(`algorithms[${i}] (id=${String(a.id)}): unbekannte Keys: ${extras.sort().join(", ")}`);
    }
  });

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }
}

export function runBuildLookupSeed(): void {
  const medPathNorm = normalizedMedicationsPath();
  const algPathNorm = normalizedAlgorithmsPath();

  const allMedications = loadReviewMedications(medPathNorm);
  const allAlgorithms = loadReviewAlgorithms(algPathNorm);

  const keptMedications = allMedications.filter((m) => {
    const idForTemplate = optionalTrimmedString(m.id) ?? optionalTrimmedString(m.draftId);
    const titleOrLabel = m.title ?? m.label;
    return !isTemplateEntry(idForTemplate, titleOrLabel);
  });
  const keptAlgorithms = allAlgorithms.filter((a) => {
    const idForTemplate = optionalTrimmedString(a.id) ?? optionalTrimmedString(a.draftId);
    const titleOrLabel = a.title ?? a.label;
    return !isTemplateEntry(idForTemplate, titleOrLabel);
  });

  if (keptMedications.length === 0) {
    seedFail("Nach Ausschluss von TEMPLATE-Einträgen: keine Medikamente übrig.");
  }
  if (keptAlgorithms.length === 0) {
    seedFail("Nach Ausschluss von TEMPLATE-Einträgen: keine Algorithmen übrig.");
  }

  const medIdToAlgIds = buildMedIdToAlgorithmIds(keptAlgorithms);

  const medications: Record<string, unknown>[] = [];
  for (let i = 0; i < keptMedications.length; i++) {
    const m = keptMedications[i];
    const mid = resolveEntityId(m, `medications[${i}]`);
    const relatedAlgorithmIds = medIdToAlgIds.get(mid) ?? [];
    medications.push(mapMedicationToLookup(m, i, relatedAlgorithmIds));
  }

  const algorithms: Record<string, unknown>[] = [];
  for (let i = 0; i < keptAlgorithms.length; i++) {
    algorithms.push(mapAlgorithmToLookup(keptAlgorithms[i], i));
  }

  const medicationsSorted = sortByLabel(medications);
  const algorithmsSorted = sortByLabel(algorithms);

  const manPath = lookupManifestSeedPath();
  const manifest = buildManifest(manPath);

  assertLookupSeedSchemaKeys(manifest, medicationsSorted, algorithmsSorted);

  const validation = validateLookupBundle({
    manifest,
    medications: medicationsSorted,
    algorithms: algorithmsSorted,
  });

  if (!validation.ok) {
    console.error("[dbrd-seed] Validierung fehlgeschlagen (gleiche Regeln wie die Mobile-App):");
    for (const err of validation.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const medPath = lookupMedicationsSeedPath();
  const algPath = lookupAlgorithmsSeedPath();

  writeJsonFile(medPath, medicationsSorted);
  writeJsonFile(algPath, algorithmsSorted);
  writeJsonFile(manPath, manifest);

  console.log(
    `Fertig: ${medicationsSorted.length} Medikamente, ${algorithmsSorted.length} Algorithmen (Seed + Manifest aktualisiert).`,
  );
}

function main(): void {
  const { help } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(`build-lookup-seed — normalized → data/lookup-seed/

  -h, --help`);
    process.exit(0);
  }

  try {
    runBuildLookupSeed();
  } catch (e) {
    if (e && typeof e === "object" && "message" in e) {
      seedFail(String((e as Error).message), e);
    }
    seedFail("Unerwarteter Fehler", e);
  }
}

const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] !== undefined &&
  path.normalize(path.resolve(process.argv[1])) === path.normalize(path.resolve(__filename));

if (isDirectRun) {
  main();
}
