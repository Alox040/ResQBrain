import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { Algorithm, Medication } from "../../packages/domain/models/index.ts";
import {
  createAlgorithm,
  createAlgorithmStep,
  createMedication,
} from "../../packages/domain/models/index.ts";

// ---------------------------------------------------------------------------
// Raw catalog (matches data/seeds/ems-reference/catalog.json)
// ---------------------------------------------------------------------------

export type EmsReferenceDosage = Readonly<Record<string, string>>;

export type EmsReferenceMedication = Readonly<{
  id: string;
  name: string;
  class: string;
  indications: ReadonlyArray<string>;
  dosage: EmsReferenceDosage;
  routes: ReadonlyArray<string>;
  onset: string;
  notes: string;
}>;

export type EmsReferenceAlgorithm = Readonly<{
  id: string;
  name: string;
  steps: ReadonlyArray<string>;
  medications: ReadonlyArray<string>;
  notes: string;
}>;

export type EmsReferenceCatalog = Readonly<{
  medications: ReadonlyArray<EmsReferenceMedication>;
  algorithms: ReadonlyArray<EmsReferenceAlgorithm>;
}>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo-root-relative default path to the bundled JSON catalog. */
export const EMS_REFERENCE_CATALOG_PATH = path.join(
  __dirname,
  "../../data/seeds/ems-reference/catalog.json",
);

function formatDosage(dosage: EmsReferenceDosage | undefined): string {
  if (!dosage || typeof dosage !== "object") return "";
  return Object.entries(dosage)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
}

function medicationTags(m: EmsReferenceMedication): ReadonlyArray<string> {
  return Object.freeze(
    [m.class, ...m.routes, m.onset].map((s) => s.trim()).filter(Boolean),
  );
}

function medicationSearchTerms(m: EmsReferenceMedication): ReadonlyArray<string> {
  return Object.freeze(
    [m.name, m.class, ...m.indications].map((s) => s.trim()).filter(Boolean),
  );
}

function specialConsiderations(m: EmsReferenceMedication): string {
  const routes = m.routes.length ? `Routen: ${m.routes.join(", ")}.` : "";
  const onset = m.onset.trim() ? ` Wirkungseintritt: ${m.onset.trim()}.` : "";
  return `${routes}${onset}`.trim() || "";
}

function inferAlgorithmCategory(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("reanimation")) return "Reanimation";
  if (lower.includes("acs")) return "Akutes Koronarsyndrom";
  if (lower.includes("trauma") || lower.includes("bleeding")) return "Trauma / Blutung";
  return "Notfall";
}

function algorithmIndication(a: EmsReferenceAlgorithm): string {
  const first = a.steps[0]?.trim();
  if (first) return first;
  return a.name.trim();
}

function algorithmTags(a: EmsReferenceAlgorithm): ReadonlyArray<string> {
  return Object.freeze([inferAlgorithmCategory(a.id)]);
}

/** Read and parse `catalog.json` (throws on invalid JSON). */
export function loadEmsReferenceCatalogJson(
  filePath: string = EMS_REFERENCE_CATALOG_PATH,
): EmsReferenceCatalog {
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  if (!raw || typeof raw !== "object") throw new Error("Catalog root must be an object");
  const medications = (raw as { medications?: unknown }).medications;
  const algorithms = (raw as { algorithms?: unknown }).algorithms;
  if (!Array.isArray(medications) || !Array.isArray(algorithms)) {
    throw new Error("Catalog must contain medications[] and algorithms[]");
  }
  return Object.freeze({
    medications: medications as EmsReferenceMedication[],
    algorithms: algorithms as EmsReferenceAlgorithm[],
  });
}

/**
 * Map the EMS reference catalog into domain blueprint lookup models
 * (`kind: 'medication' | 'algorithm'`).
 */
export function mapEmsReferenceCatalogToLookupModels(
  catalog: EmsReferenceCatalog,
): Readonly<{ medications: ReadonlyArray<Medication>; algorithms: ReadonlyArray<Algorithm> }> {
  const medToAlgIds = new Map<string, string[]>();
  for (const alg of catalog.algorithms) {
    for (const medId of alg.medications) {
      const list = medToAlgIds.get(medId) ?? [];
      list.push(alg.id);
      medToAlgIds.set(medId, list);
    }
  }

  const medications = catalog.medications.map((m) =>
    createMedication({
      id: m.id,
      label: m.name,
      indication: m.indications.join(", "),
      tags: medicationTags(m),
      searchTerms: medicationSearchTerms(m),
      notes: m.notes,
      genericName: m.name,
      tradeNames: [],
      dosage: formatDosage(m.dosage),
      contraindications: [],
      specialConsiderations: specialConsiderations(m) || null,
      relatedAlgorithmIds: Object.freeze([...(medToAlgIds.get(m.id) ?? [])]),
    }),
  );

  const algorithms = catalog.algorithms.map((a) =>
    createAlgorithm({
      id: a.id,
      label: a.name,
      indication: algorithmIndication(a),
      tags: algorithmTags(a),
      searchTerms: [],
      notes: a.notes,
      category: inferAlgorithmCategory(a.id),
      steps: a.steps.map((instruction, index) =>
        createAlgorithmStep({
          position: index + 1,
          instruction,
          notes: null,
        }),
      ),
      warnings: null,
      relatedMedicationIds: [...a.medications],
    }),
  );

  return Object.freeze({ medications, algorithms });
}

export function loadEmsReferenceLookupModels(
  filePath: string = EMS_REFERENCE_CATALOG_PATH,
): Readonly<{ medications: ReadonlyArray<Medication>; algorithms: ReadonlyArray<Algorithm> }> {
  return mapEmsReferenceCatalogToLookupModels(loadEmsReferenceCatalogJson(filePath));
}

function main(): void {
  const { medications, algorithms } = loadEmsReferenceLookupModels();
  process.stdout.write(
    `[ems-reference] OK — ${medications.length} medications, ${algorithms.length} algorithms\n`,
  );
}

const invokedAsCli =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedAsCli) {
  main();
}
