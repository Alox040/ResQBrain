/**
 * Gemeinsame Hilfen für die DBRD-Normalisierung (kein Domain-Import).
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  DbrdNormalizedApprovalStatus,
  DbrdNormalizedProvenance,
} from "../../data/schemas/dbrd-normalized.schema";

const ALLOWED_APPROVAL = new Set<string>([
  "Draft",
  "InReview",
  "Approved",
  "Rejected",
  "Released",
  "Deprecated",
]);

export const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(scriptDir, "..", "..");

export function rawMedicationsPath(): string {
  return path.join(repoRoot, "data", "dbrd-source", "raw", "medications", "medications.raw.v1.json");
}

export function rawAlgorithmsPath(): string {
  return path.join(repoRoot, "data", "dbrd-source", "raw", "algorithms", "algorithms.raw.v1.json");
}

export function normalizedMedicationsPath(): string {
  return path.join(
    repoRoot,
    "data",
    "dbrd-source",
    "normalized",
    "medications.normalized.v1.json",
  );
}

export function normalizedAlgorithmsPath(): string {
  return path.join(
    repoRoot,
    "data",
    "dbrd-source",
    "normalized",
    "algorithms.normalized.v1.json",
  );
}

export function lookupMedicationsSeedPath(): string {
  return path.join(repoRoot, "data", "lookup-seed", "medications.json");
}

export function lookupAlgorithmsSeedPath(): string {
  return path.join(repoRoot, "data", "lookup-seed", "algorithms.json");
}

export function lookupManifestSeedPath(): string {
  return path.join(repoRoot, "data", "lookup-seed", "manifest.json");
}

export function fail(prefix: string, detail: string, cause?: unknown): never {
  console.error(`[dbrd-normalize] FEHLER: ${prefix}`);
  console.error(detail);
  if (cause !== undefined) {
    console.error(cause);
  }
  process.exit(1);
}

export function readJsonFile(filePath: string): unknown {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (e) {
    fail(
      "Datei lesen",
      `Konnte Datei nicht lesen: ${filePath}\nPfad relativ zum Repo: ${path.relative(repoRoot, filePath)}`,
      e,
    );
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch (e) {
    fail("JSON parsen", `Ungültiges JSON: ${filePath}`, e);
  }
}

export function writeJsonFile(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  } catch (e) {
    fail("Datei schreiben", `Konnte nicht schreiben: ${filePath}`, e);
  }
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function expectRecord(v: unknown, ctx: string): Record<string, unknown> {
  if (!isRecord(v)) {
    fail("Typ", `${ctx}: Erwartet wurde ein JSON-Objekt.`);
  }
  return v;
}

export function requireString(obj: Record<string, unknown>, key: string, ctx: string): string {
  const v = obj[key];
  if (typeof v !== "string" || v.trim() === "") {
    fail("Pflichtfeld", `${ctx}: Feld "${key}" fehlt oder ist kein nicht-leerer String.`);
  }
  return v.trim();
}

export function optionalString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  if (v === undefined || v === null) {
    return undefined;
  }
  if (typeof v !== "string") {
    return undefined;
  }
  const t = v.trim();
  return t === "" ? undefined : t;
}

export function requireStringArray(obj: Record<string, unknown>, key: string, ctx: string): string[] {
  const v = obj[key];
  if (!Array.isArray(v)) {
    fail("Pflichtfeld", `${ctx}: Feld "${key}" muss ein Array von Strings sein.`);
  }
  const out: string[] = [];
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string" || v[i].trim() === "") {
      fail(
        "Array-Eintrag",
        `${ctx}: "${key}[${i}]" muss ein nicht-leerer String sein.`,
      );
    }
    out.push(v[i].trim());
  }
  return out;
}

export function optionalStringArray(obj: Record<string, unknown>, key: string, ctx: string): string[] {
  const v = obj[key];
  if (v === undefined || v === null) {
    return [];
  }
  if (!Array.isArray(v)) {
    fail("Optional-Array", `${ctx}: Feld "${key}" ist gesetzt, muss aber ein Array von Strings sein.`);
  }
  const out: string[] = [];
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string" || v[i].trim() === "") {
      fail(
        "Array-Eintrag",
        `${ctx}: "${key}[${i}]" muss ein nicht-leerer String sein.`,
      );
    }
    out.push(v[i].trim());
  }
  return out;
}

export function parseProvenance(raw: unknown, ctx: string): DbrdNormalizedProvenance {
  const p = expectRecord(raw, `${ctx}.provenance`);
  const source = requireString(p, "source", `${ctx}.provenance`);
  const sourceReference = requireString(p, "sourceReference", `${ctx}.provenance`);
  const approvalStatusRaw = requireString(p, "approvalStatus", `${ctx}.provenance`);
  if (!ALLOWED_APPROVAL.has(approvalStatusRaw)) {
    fail(
      "approvalStatus",
      `${ctx}.provenance: Ungültiger approvalStatus "${approvalStatusRaw}".\nErlaubt: ${[...ALLOWED_APPROVAL].join(", ")}`,
    );
  }
  const approvalStatus = approvalStatusRaw as DbrdNormalizedApprovalStatus;
  const lastReviewedAt = requireString(p, "lastReviewedAt", `${ctx}.provenance`);
  if (Number.isNaN(Date.parse(lastReviewedAt))) {
    fail(
      "lastReviewedAt",
      `${ctx}.provenance: lastReviewedAt ist kein gültiges ISO-8601-Datum: "${lastReviewedAt}"`,
    );
  }
  return {
    source,
    sourceReference,
    approvalStatus,
    lastReviewedAt,
  };
}
