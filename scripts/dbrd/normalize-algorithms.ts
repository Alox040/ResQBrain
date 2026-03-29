/**
 * Transform: raw/algorithms/algorithms.raw.v1.json → normalized/algorithms.normalized.v1.json
 *
 * Erwartetes Rohformat (explizit, Version 1):
 * {
 *   "schemaId": "dbrd-raw-algorithms/v1",
 *   "items": [
 *     {
 *       "id", "label", "indication",
 *       "tags": string[],
 *       "searchTerms": string[],
 *       "steps": [ { "order": number >= 1, "text": string, "title"?: string } ],
 *       "warnings"?, "clinicalNotes"?,
 *       "relatedMedicationIds"?: string[],
 *       "provenance": { ... }
 *     }
 *   ]
 * }
 */

import type {
  NormalizedAlgorithm,
  NormalizedAlgorithmStep,
} from "../../data/schemas/dbrd-normalized.schema";

import {
  expectRecord,
  fail,
  normalizedAlgorithmsPath,
  optionalString,
  optionalStringArray,
  parseProvenance,
  rawAlgorithmsPath,
  readJsonFile,
  requireString,
  requireStringArray,
  writeJsonFile,
} from "./common";

const RAW_SCHEMA_ID = "dbrd-raw-algorithms/v1";

const OUTPUT_BUNDLE_SCHEMA_ID = "dbrd-normalized.pipeline/algorithms/v1";

function parseStep(raw: unknown, itemCtx: string, stepIndex: number): NormalizedAlgorithmStep {
  const ctx = `${itemCtx}.steps[${stepIndex}]`;
  const o = expectRecord(raw, ctx);
  const orderRaw = o.order;
  if (typeof orderRaw !== "number" || !Number.isInteger(orderRaw) || orderRaw < 1) {
    fail(
      "Schritt order",
      `${ctx}: "order" muss eine ganze Zahl >= 1 sein (erhalten: ${String(orderRaw)}).`,
    );
  }
  const text = requireString(o, "text", ctx);
  const title = optionalString(o, "title");
  return title === undefined ? { order: orderRaw, text } : { order: orderRaw, text, title };
}

function validateStepSequence(steps: NormalizedAlgorithmStep[], itemCtx: string): void {
  const orders = steps.map((s) => s.order).sort((a, b) => a - b);
  const unique = new Set(orders);
  if (unique.size !== orders.length) {
    fail("Schritte", `${itemCtx}: doppelte "order"-Werte in steps.`);
  }
  for (let i = 0; i < orders.length; i++) {
    const expected = i + 1;
    if (orders[i] !== expected) {
      fail(
        "Schritte",
        `${itemCtx}: steps müssen fortlaufende order-Werte 1..n haben nach Sortierung.\nGefunden: ${orders.join(", ")} — erwartet ab Start: 1, 2, 3, …`,
      );
    }
  }
}

function parseRawAlgorithmItem(raw: unknown, index: number): NormalizedAlgorithm {
  const ctx = `items[${index}]`;
  const o = expectRecord(raw, ctx);

  const id = requireString(o, "id", ctx);
  const label = requireString(o, "label", ctx);
  const indication = requireString(o, "indication", ctx);
  const tags = requireStringArray(o, "tags", ctx);
  const searchTerms = requireStringArray(o, "searchTerms", ctx);

  const stepsRaw = o.steps;
  if (!Array.isArray(stepsRaw) || stepsRaw.length === 0) {
    fail("steps", `${ctx}: "steps" muss ein nicht-leeres Array sein.`);
  }

  const steps: NormalizedAlgorithmStep[] = [];
  for (let s = 0; s < stepsRaw.length; s++) {
    steps.push(parseStep(stepsRaw[s], ctx, s));
  }

  steps.sort((a, b) => a.order - b.order);
  validateStepSequence(steps, ctx);

  const warnings = optionalString(o, "warnings");
  const clinicalNotes = optionalString(o, "clinicalNotes");
  const relatedMedicationIds = optionalStringArray(o, "relatedMedicationIds", ctx);
  const provenance = parseProvenance(o.provenance, ctx);

  return {
    entityType: "NormalizedAlgorithm",
    id,
    label,
    indication,
    tags,
    searchTerms,
    steps,
    ...(warnings !== undefined ? { warnings } : {}),
    ...(clinicalNotes !== undefined ? { clinicalNotes } : {}),
    relatedMedicationIds,
    provenance,
  } satisfies NormalizedAlgorithm;
}

function parseRawAlgorithmsFile(data: unknown): NormalizedAlgorithm[] {
  const root = expectRecord(data, "Wurzel");
  const schemaId = requireString(root, "schemaId", "Wurzel");
  if (schemaId !== RAW_SCHEMA_ID) {
    fail(
      "schemaId",
      `Erwartet wurde schemaId "${RAW_SCHEMA_ID}", erhalten: "${schemaId}".`,
    );
  }
  const items = root.items;
  if (!Array.isArray(items)) {
    fail("items", 'Wurzel: Feld "items" muss ein Array sein.');
  }
  if (items.length === 0) {
    fail("items", 'Wurzel: "items" darf nicht leer sein.');
  }

  const normalized: NormalizedAlgorithm[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const one = parseRawAlgorithmItem(items[i], i);
    if (seenIds.has(one.id)) {
      fail("Duplikat-ID", `Die Algorithmus-ID "${one.id}" kommt mehrfach vor (items[${i}]).`);
    }
    seenIds.add(one.id);
    normalized.push(one);
  }

  return normalized;
}

export function runNormalizeAlgorithms(): void {
  const inputPath = rawAlgorithmsPath();
  const outputPath = normalizedAlgorithmsPath();

  console.log(`[dbrd-normalize] Algorithmen: lese  ${inputPath}`);
  const raw = readJsonFile(inputPath);
  const algorithms = parseRawAlgorithmsFile(raw);

  const out = {
    bundleSchemaId: OUTPUT_BUNDLE_SCHEMA_ID,
    algorithms,
  };

  console.log(`[dbrd-normalize] Algorithmen: schreibe ${outputPath} (${algorithms.length} Datensätze)`);
  writeJsonFile(outputPath, out);
}
