/**
 * Erzeugt `data/lookup-seed/*.json` aus den normalisierten DBRD-Bundles.
 * Validierung: dieselbe Logik wie die Mobile-App (`validateLookupBundle`).
 * Vorprüfung der normalisierten Dateien: `pnpm dbrd:validate-normalized` — empfohlen: `pnpm dbrd:build` (Validierung + dieser Schritt).
 *
 * Aufruf:
 *   pnpm dbrd:build-lookup-seed
 *   pnpm exec tsx scripts/dbrd/build-lookup-seed.ts --content-cutoff-date=2026-03-29
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  NormalizedAlgorithm,
  NormalizedAlgorithmStep,
  NormalizedMedication,
} from "../../data/schemas/dbrd-normalized.schema";
import { LOOKUP_MANIFEST_KEYS } from "../../apps/mobile-app/src/lookup/lookupSchema";
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

const MED_BUNDLE_ID = "dbrd-normalized.pipeline/medications/v1";
const ALG_BUNDLE_ID = "dbrd-normalized.pipeline/algorithms/v1";

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

function parseArgs(argv: string[]): { contentCutoffDate: string | undefined; help: boolean } {
  let contentCutoffDate: string | undefined;
  let help = false;
  for (const a of argv) {
    if (a === "-h" || a === "--help") {
      help = true;
    }
    if (a.startsWith("--content-cutoff-date=")) {
      contentCutoffDate = a.slice("--content-cutoff-date=".length).trim();
    }
    if (a.startsWith("--cutoff-date=")) {
      contentCutoffDate = a.slice("--cutoff-date=".length).trim();
    }
  }
  return { contentCutoffDate, help };
}

function expectEntityType(
  o: Record<string, unknown>,
  expected: string,
  ctx: string,
): void {
  if (o.entityType !== expected) {
    seedFail(`${ctx}: entityType muss "${expected}" sein (ist: ${String(o.entityType)}).`);
  }
}

function joinParagraphs(parts: (string | undefined)[]): string | undefined {
  const cleaned = parts
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((p) => p.length > 0);
  if (cleaned.length === 0) {
    return undefined;
  }
  return cleaned.join("\n\n");
}

function mapDosageToString(m: NormalizedMedication): string {
  const summary = m.dosage.summary.trim();
  const detail = m.dosage.detail?.trim();
  if (detail) {
    return `${summary}\n\n${detail}`;
  }
  return summary;
}

function mapMedicationToLookup(m: NormalizedMedication): Record<string, unknown> {
  const notes = joinParagraphs([m.contraindicationsNote, m.clinicalNotes]);
  const out: Record<string, unknown> = {
    id: m.id,
    kind: "medication",
    label: m.label,
    indication: m.indication,
    tags: [...m.tags],
    searchTerms: [...m.searchTerms],
    dosage: mapDosageToString(m),
    relatedAlgorithmIds: [...m.relatedAlgorithmIds],
  };
  if (notes !== undefined) {
    out.notes = notes;
  }
  return out;
}

function mapAlgorithmStep(step: NormalizedAlgorithmStep): { text: string } {
  const textBody = step.text.trim();
  const title = step.title?.trim();
  const text =
    title && title.length > 0 ? `${title}: ${textBody}` : textBody;
  return { text };
}

function mapAlgorithmToLookup(a: NormalizedAlgorithm): Record<string, unknown> {
  const sortedSteps = [...a.steps].sort((x, y) => x.order - y.order);
  const steps = sortedSteps.map(mapAlgorithmStep);

  const out: Record<string, unknown> = {
    id: a.id,
    kind: "algorithm",
    label: a.label,
    indication: a.indication,
    tags: [...a.tags],
    searchTerms: [...a.searchTerms],
    steps,
    relatedMedicationIds: [...a.relatedMedicationIds],
  };

  const notes = a.clinicalNotes?.trim();
  if (notes) {
    out.notes = notes;
  }

  const warnings = a.warnings?.trim();
  if (warnings) {
    out.warnings = warnings;
  }

  return out;
}

function loadNormalizedMedications(): NormalizedMedication[] {
  const path = normalizedMedicationsPath();
  const raw = readJsonFile(path);
  if (!isPlainObject(raw)) {
    seedFail(`Erwartet Objekt in ${path}`);
  }
  const schema = raw.bundleSchemaId;
  if (schema !== MED_BUNDLE_ID) {
    seedFail(`Unerwartetes bundleSchemaId in Medikamenten-Datei: ${String(schema)}`);
  }
  const list = raw.medications;
  if (!Array.isArray(list) || list.length === 0) {
    seedFail(`medications muss ein nicht-leeres Array sein (${path}).`);
  }
  const out: NormalizedMedication[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!isPlainObject(item)) {
      seedFail(`medications[${i}]: kein Objekt.`);
    }
    expectEntityType(item, "NormalizedMedication", `medications[${i}]`);
    out.push(item as unknown as NormalizedMedication);
  }
  return out;
}

function loadNormalizedAlgorithms(): NormalizedAlgorithm[] {
  const path = normalizedAlgorithmsPath();
  const raw = readJsonFile(path);
  if (!isPlainObject(raw)) {
    seedFail(`Erwartet Objekt in ${path}`);
  }
  const schema = raw.bundleSchemaId;
  if (schema !== ALG_BUNDLE_ID) {
    seedFail(`Unerwartetes bundleSchemaId in Algorithmen-Datei: ${String(schema)}`);
  }
  const list = raw.algorithms;
  if (!Array.isArray(list) || list.length === 0) {
    seedFail(`algorithms muss ein nicht-leeres Array sein (${path}).`);
  }
  const out: NormalizedAlgorithm[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!isPlainObject(item)) {
      seedFail(`algorithms[${i}]: kein Objekt.`);
    }
    expectEntityType(item, "NormalizedAlgorithm", `algorithms[${i}]`);
    out.push(item as unknown as NormalizedAlgorithm);
  }
  return out;
}

/**
 * Liest manifest.json, übernimmt nur erlaubte Schlüssel (Whitelist der App),
 * setzt generatedAt neu, optional contentCutoffDate.
 */
function buildManifest(contentCutoffDateOverride: string | undefined): Record<string, unknown> {
  const manifestPath = lookupManifestSeedPath();
  let prior: Record<string, unknown> = {};
  try {
    const txt = readFileSync(manifestPath, "utf8");
    const parsed = JSON.parse(txt) as unknown;
    if (isPlainObject(parsed)) {
      for (const k of LOOKUP_MANIFEST_KEYS) {
        if (Object.prototype.hasOwnProperty.call(parsed, k) && parsed[k] !== undefined) {
          prior[k] = parsed[k];
        }
      }
    }
  } catch {
    /* erste Auslieferung ohne bestehendes Manifest */
  }

  const schemaVersion =
    typeof prior.schemaVersion === "string" && prior.schemaVersion.trim() !== ""
      ? prior.schemaVersion.trim()
      : "1";
  const bundleId =
    typeof prior.bundleId === "string" && prior.bundleId.trim() !== ""
      ? prior.bundleId.trim()
      : "pilot-wache-001";

  const manifest: Record<string, unknown> = {
    schemaVersion,
    bundleId,
    generatedAt: new Date().toISOString(),
  };

  if (typeof prior.displayName === "string") {
    manifest.displayName = prior.displayName;
  }
  if (typeof prior.locale === "string") {
    manifest.locale = prior.locale;
  }

  if (contentCutoffDateOverride !== undefined && contentCutoffDateOverride !== "") {
    manifest.contentCutoffDate = contentCutoffDateOverride;
  } else if (typeof prior.contentCutoffDate === "string") {
    manifest.contentCutoffDate = prior.contentCutoffDate;
  } else {
    manifest.contentCutoffDate = new Date().toISOString().slice(0, 10);
  }

  return manifest;
}

export function runBuildLookupSeed(contentCutoffDate?: string): void {
  const medicationsNorm = loadNormalizedMedications();
  const algorithmsNorm = loadNormalizedAlgorithms();

  const medications = medicationsNorm.map(mapMedicationToLookup);
  const algorithms = algorithmsNorm.map(mapAlgorithmToLookup);

  const manifest = buildManifest(contentCutoffDate);

  const validation = validateLookupBundle({
    manifest,
    medications,
    algorithms,
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
  const manPath = lookupManifestSeedPath();

  console.log(`[dbrd-seed] schreibe ${medPath} (${medications.length} Einträge)`);
  writeJsonFile(medPath, medications);
  console.log(`[dbrd-seed] schreibe ${algPath} (${algorithms.length} Einträge)`);
  writeJsonFile(algPath, algorithms);
  console.log(`[dbrd-seed] schreibe ${manPath}`);
  writeJsonFile(manPath, manifest);

  console.log("[dbrd-seed] Fertig — Bundle hat validateLookupBundle bestanden.");
}

function main(): void {
  const { contentCutoffDate, help } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(`build-lookup-seed — normalisiert → data/lookup-seed/

Optionen:
  --content-cutoff-date=YYYY-MM-DD   manifest.contentCutoffDate setzen
  --cutoff-date=YYYY-MM-DD           Alias
  -h, --help`);
    process.exit(0);
  }

  try {
    runBuildLookupSeed(contentCutoffDate);
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
