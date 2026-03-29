/**
 * Transform: raw/medications/medications.raw.v1.json → normalized/medications.normalized.v1.json
 *
 * Erwartetes Rohformat (explizit, Version 1):
 * {
 *   "schemaId": "dbrd-raw-medications/v1",
 *   "items": [
 *     {
 *       "id", "label", "indication",
 *       "tags": string[],
 *       "searchTerms": string[],
 *       "dosage": { "summary": string, "detail"?: string },
 *       "genericName"?, "tradeNames"?: string[],
 *       "contraindicationsNote"?, "clinicalNotes"?,
 *       "relatedAlgorithmIds"?: string[],
 *       "provenance": { source, sourceReference, approvalStatus, lastReviewedAt }
 *     }
 *   ]
 * }
 */

import type { NormalizedMedication } from "../../data/schemas/dbrd-normalized.schema";

import {
  expectRecord,
  fail,
  normalizedMedicationsPath,
  optionalString,
  optionalStringArray,
  parseProvenance,
  rawMedicationsPath,
  readJsonFile,
  requireString,
  requireStringArray,
  writeJsonFile,
} from "./common";

const RAW_SCHEMA_ID = "dbrd-raw-medications/v1";

const OUTPUT_BUNDLE_SCHEMA_ID = "dbrd-normalized.pipeline/medications/v1";

function parseDosage(
  raw: unknown,
  ctx: string,
): { summary: string; detail?: string } {
  const d = expectRecord(raw, `${ctx}.dosage`);
  const summary = requireString(d, "summary", `${ctx}.dosage`);
  const detail = optionalString(d, "detail");
  return detail === undefined ? { summary } : { summary, detail };
}

function parseRawMedicationItem(raw: unknown, index: number): NormalizedMedication {
  const ctx = `items[${index}]`;
  const o = expectRecord(raw, ctx);

  const id = requireString(o, "id", ctx);
  const label = requireString(o, "label", ctx);
  const indication = requireString(o, "indication", ctx);
  const tags = requireStringArray(o, "tags", ctx);
  const searchTerms = requireStringArray(o, "searchTerms", ctx);
  const dosage = parseDosage(o.dosage, ctx);

  const genericName = optionalString(o, "genericName");
  const tradeNames = optionalStringArray(o, "tradeNames", ctx);
  const contraindicationsNote = optionalString(o, "contraindicationsNote");
  const clinicalNotes = optionalString(o, "clinicalNotes");
  const relatedAlgorithmIds = optionalStringArray(o, "relatedAlgorithmIds", ctx);
  const provenance = parseProvenance(o.provenance, ctx);

  return {
    entityType: "NormalizedMedication",
    id,
    label,
    indication,
    tags,
    searchTerms,
    dosage,
    ...(genericName !== undefined ? { genericName } : {}),
    ...(tradeNames.length > 0 ? { tradeNames } : {}),
    ...(contraindicationsNote !== undefined ? { contraindicationsNote } : {}),
    ...(clinicalNotes !== undefined ? { clinicalNotes } : {}),
    relatedAlgorithmIds,
    provenance,
  } satisfies NormalizedMedication;
}

function parseRawMedicationsFile(data: unknown): NormalizedMedication[] {
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

  const normalized: NormalizedMedication[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const one = parseRawMedicationItem(items[i], i);
    if (seenIds.has(one.id)) {
      fail("Duplikat-ID", `Die Medikamenten-ID "${one.id}" kommt mehrfach vor (items[${i}]).`);
    }
    seenIds.add(one.id);
    normalized.push(one);
  }

  return normalized;
}

function assertNormalizedMedicationShape(m: NormalizedMedication, index: number): void {
  const ctx = `normalisiert[${index}]`;
  if (m.entityType !== "NormalizedMedication") {
    fail("entityType", `${ctx}: entityType muss "NormalizedMedication" sein.`);
  }
  if (!m.dosage.summary) {
    fail("dosage", `${ctx}: dosage.summary fehlt.`);
  }
}

export function runNormalizeMedications(): void {
  const inputPath = rawMedicationsPath();
  const outputPath = normalizedMedicationsPath();

  console.log(`[dbrd-normalize] Medikamente: lese  ${inputPath}`);
  const raw = readJsonFile(inputPath);
  const medications = parseRawMedicationsFile(raw);

  for (let i = 0; i < medications.length; i++) {
    assertNormalizedMedicationShape(medications[i], i);
  }

  const out = {
    bundleSchemaId: OUTPUT_BUNDLE_SCHEMA_ID,
    medications,
  };

  console.log(`[dbrd-normalize] Medikamente: schreibe ${outputPath} (${medications.length} Datensätze)`);
  writeJsonFile(outputPath, out);
}
