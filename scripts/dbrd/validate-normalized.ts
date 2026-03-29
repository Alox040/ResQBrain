/**
 * Harte Validierung der normalisierten DBRD-Bundles vor dem Seed-Build.
 *
 * Aufruf: pnpm dbrd:validate-normalized
 *         pnpm exec tsx scripts/dbrd/index.ts validate-normalized
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isContentTag } from "../../apps/mobile-app/src/lookup/lookupSchema";
import {
  isRecord,
  normalizedAlgorithmsPath,
  normalizedMedicationsPath,
  repoRoot,
} from "./common";

const MED_BUNDLE_ID = "dbrd-normalized.pipeline/medications/v1";
const ALG_BUNDLE_ID = "dbrd-normalized.pipeline/algorithms/v1";

const APPROVAL = new Set([
  "Draft",
  "InReview",
  "Approved",
  "Rejected",
  "Released",
  "Deprecated",
]);

/** Feste Reihenfolge der Konsolen-Gruppen für lesbare Ausgabe. */
const GROUP_ORDER = [
  "Datei / JSON",
  "Bundle (Medikamente)",
  "Bundle (Algorithmen)",
  "Medikamente (Datensätze)",
  "Algorithmen (Datensätze)",
  "Algorithmen — Schritte (steps)",
  "IDs",
  "Querverweise",
] as const;

type Group = (typeof GROUP_ORDER)[number] | string;

const report = new Map<string, string[]>();

function add(group: Group, message: string): void {
  const prev = report.get(group) ?? [];
  prev.push(message);
  report.set(group, prev);
}

function readJson(
  filePath: string,
  label: string,
): { ok: true; data: unknown } | { ok: false } {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (e) {
    add(
      "Datei / JSON",
      `${label}: Datei nicht lesbar: ${path.relative(repoRoot, filePath)} (${String(e)})`,
    );
    return { ok: false };
  }
  try {
    return { ok: true, data: JSON.parse(raw) as unknown };
  } catch (e) {
    add(
      "Datei / JSON",
      `${label}: Ungültiges JSON (${path.relative(repoRoot, filePath)}): ${String(e)}`,
    );
    return { ok: false };
  }
}

function nonEmptyString(
  v: unknown,
  ctx: string,
  field: string,
): string | null {
  if (typeof v !== "string") {
    add("Medikamente (Datensätze)", `${ctx}: "${field}" muss ein String sein.`);
    return null;
  }
  const t = v.trim();
  if (t === "") {
    add("Medikamente (Datensätze)", `${ctx}: "${field}" darf nicht leer sein (nur Whitespace).`);
    return null;
  }
  return t;
}

function nonEmptyStringAlg(
  v: unknown,
  ctx: string,
  field: string,
): string | null {
  if (typeof v !== "string") {
    add("Algorithmen (Datensätze)", `${ctx}: "${field}" muss ein String sein.`);
    return null;
  }
  const t = v.trim();
  if (t === "") {
    add("Algorithmen (Datensätze)", `${ctx}: "${field}" darf nicht leer sein (nur Whitespace).`);
    return null;
  }
  return t;
}

function validateStringArray(
  arr: unknown,
  ctx: string,
  field: string,
  group: "Medikamente (Datensätze)" | "Algorithmen (Datensätze)",
): string[] | null {
  if (!Array.isArray(arr)) {
    add(group, `${ctx}: "${field}" muss ein Array sein.`);
    return null;
  }
  const out: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (typeof el !== "string" || el.trim() === "") {
      add(group, `${ctx}: "${field}[${i}]" muss ein nicht-leerer String sein.`);
      return null;
    }
    if (field === "tags" && !isContentTag(el)) {
      add(
        group,
        `${ctx}: "${field}[${i}]"="${el}" ist kein gültiger ContentTag (siehe lookupSchema / gleiche Regel wie Seed).`,
      );
      return null;
    }
    out.push(el.trim());
  }
  return out;
}

function validateDosage(
  raw: unknown,
  ctx: string,
): { summary: string; detail?: string } | null {
  if (!isRecord(raw)) {
    add("Medikamente (Datensätze)", `${ctx}: "dosage" muss ein Objekt sein.`);
    return null;
  }
  const summary = raw.summary;
  if (typeof summary !== "string" || summary.trim() === "") {
    add(
      "Medikamente (Datensätze)",
      `${ctx}: "dosage.summary" fehlt oder ist leer.`,
    );
    return null;
  }
  const detail = raw.detail;
  if (detail !== undefined && detail !== null) {
    if (typeof detail !== "string") {
      add("Medikamente (Datensätze)", `${ctx}: "dosage.detail" muss ein String sein.`);
      return null;
    }
    if (detail.trim() === "") {
      add(
        "Medikamente (Datensätze)",
        `${ctx}: "dosage.detail" ist gesetzt, aber leer — entfernen oder Text eintragen.`,
      );
      return null;
    }
    return { summary: summary.trim(), detail: detail.trim() };
  }
  return { summary: summary.trim() };
}

function validateProvenance(
  raw: unknown,
  ctx: string,
  group: "Medikamente (Datensätze)" | "Algorithmen (Datensätze)",
): boolean {
  if (!isRecord(raw)) {
    add(group, `${ctx}: "provenance" muss ein Objekt sein.`);
    return false;
  }
  let ok = true;
  const src = raw.source;
  if (typeof src !== "string" || src.trim() === "") {
    add(group, `${ctx}: provenance.source fehlt oder ist leer.`);
    ok = false;
  }
  const ref = raw.sourceReference;
  if (typeof ref !== "string" || ref.trim() === "") {
    add(group, `${ctx}: provenance.sourceReference fehlt oder ist leer.`);
    ok = false;
  }
  const st = raw.approvalStatus;
  if (typeof st !== "string" || !APPROVAL.has(st)) {
    add(
      group,
      `${ctx}: provenance.approvalStatus ungültig: ${String(st)} (erlaubt: ${[...APPROVAL].join(", ")}).`,
    );
    ok = false;
  }
  const reviewed = raw.lastReviewedAt;
  if (typeof reviewed !== "string" || reviewed.trim() === "") {
    add(group, `${ctx}: provenance.lastReviewedAt fehlt oder ist leer.`);
    ok = false;
  } else if (Number.isNaN(Date.parse(reviewed))) {
    add(
      group,
      `${ctx}: provenance.lastReviewedAt ist kein parsebares ISO-Datum: "${reviewed}".`,
    );
    ok = false;
  }
  return ok;
}

function validateOptionalNonEmptyStringMed(
  raw: Record<string, unknown>,
  key: string,
  ctx: string,
): void {
  if (!Object.prototype.hasOwnProperty.call(raw, key)) {
    return;
  }
  const v = raw[key];
  if (v === null || v === undefined) {
    return;
  }
  if (typeof v !== "string") {
    add("Medikamente (Datensätze)", `${ctx}: "${key}" muss ein String sein.`);
    return;
  }
  if (v.trim() === "") {
    add(
      "Medikamente (Datensätze)",
      `${ctx}: "${key}" ist leer — Feld weglassen oder mit Inhalt füllen.`,
    );
  }
}

function validateTradeNames(
  raw: Record<string, unknown>,
  ctx: string,
): void {
  if (!Object.prototype.hasOwnProperty.call(raw, "tradeNames")) {
    return;
  }
  const v = raw.tradeNames;
  if (v === null || v === undefined) {
    return;
  }
  if (!Array.isArray(v)) {
    add("Medikamente (Datensätze)", `${ctx}: "tradeNames" muss ein Array von Strings sein.`);
    return;
  }
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string" || v[i].trim() === "") {
      add(
        "Medikamente (Datensätze)",
        `${ctx}: tradeNames[${i}] muss ein nicht-leerer String sein.`,
      );
    }
  }
}

function validateAlgorithmSteps(
  stepsRaw: unknown,
  ctx: string,
): { orders: number[] } | null {
  if (!Array.isArray(stepsRaw)) {
    add("Algorithmen (Datensätze)", `${ctx}: "steps" muss ein Array sein.`);
    return null;
  }
  if (stepsRaw.length === 0) {
    add("Algorithmen (Datensätze)", `${ctx}: "steps" darf nicht leer sein.`);
    return null;
  }

  const orders: number[] = [];

  for (let i = 0; i < stepsRaw.length; i++) {
    const stepCtx = `${ctx}.steps[${i}]`;
    const step = stepsRaw[i];
    if (!isRecord(step)) {
      add("Algorithmen — Schritte (steps)", `${stepCtx}: Schritt muss ein Objekt sein.`);
      return null;
    }

    const ord = step.order;
    if (typeof ord !== "number" || !Number.isFinite(ord) || !Number.isInteger(ord)) {
      add(
        "Algorithmen — Schritte (steps)",
        `${stepCtx}: "order" muss eine endliche ganze Zahl sein (ist: ${String(ord)}).`,
      );
      return null;
    }
    if (ord < 1) {
      add(
        "Algorithmen — Schritte (steps)",
        `${stepCtx}: "order" muss >= 1 sein (ist: ${ord}).`,
      );
      return null;
    }
    orders.push(ord);

    const txt = step.text;
    if (typeof txt !== "string" || txt.trim() === "") {
      add(
        "Algorithmen — Schritte (steps)",
        `${stepCtx}: "text" fehlt oder ist leer.`,
      );
      return null;
    }

    if (Object.prototype.hasOwnProperty.call(step, "title")) {
      const title = step.title;
      if (title !== null && title !== undefined) {
        if (typeof title !== "string") {
          add(
            "Algorithmen — Schritte (steps)",
            `${stepCtx}: "title" muss ein String sein.`,
          );
          return null;
        }
        if (title.trim() === "") {
          add(
            "Algorithmen — Schritte (steps)",
            `${stepCtx}: "title" ist leer — weglassen oder befüllen.`,
          );
          return null;
        }
      }
    }

    const extraKeys = Object.keys(step).filter((k) => !["order", "text", "title"].includes(k));
    if (extraKeys.length > 0) {
      add(
        "Algorithmen — Schritte (steps)",
        `${stepCtx}: unerwartete Schlüssel: ${extraKeys.sort().join(", ")}`,
      );
      return null;
    }
  }

  const sorted = [...orders].sort((a, b) => a - b);
  const unique = new Set(sorted);
  if (unique.size !== sorted.length) {
    add(
      "Algorithmen — Schritte (steps)",
      `${ctx}: doppelte "order"-Werte in steps: [${orders.join(", ")}].`,
    );
    return null;
  }
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) {
      add(
        "Algorithmen — Schritte (steps)",
        `${ctx}: "order" muss lückenlos 1..n sein nach Sortierung (gefunden: ${sorted.join(", ")}).`,
      );
      return null;
    }
  }

  return { orders: sorted };
}

function validateOptionalNotesAlg(raw: Record<string, unknown>, ctx: string): void {
  for (const key of ["warnings", "clinicalNotes"] as const) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) {
      continue;
    }
    const v = raw[key];
    if (v === null || v === undefined) {
      continue;
    }
    if (typeof v !== "string") {
      add("Algorithmen (Datensätze)", `${ctx}: "${key}" muss ein String sein.`);
      continue;
    }
    if (v.trim() === "") {
      add(
        "Algorithmen (Datensätze)",
        `${ctx}: "${key}" ist leer — Feld weglassen oder Text setzen.`,
      );
    }
  }
}

function printReport(): void {
  const seen = new Set<string>();
  for (const g of GROUP_ORDER) {
    const lines = report.get(g);
    if (lines && lines.length > 0) {
      seen.add(g);
      console.error(`\n=== ${g} ===`);
      for (const line of lines) {
        console.error(`  • ${line}`);
      }
    }
  }
  for (const [g, lines] of report) {
    if (seen.has(g) || lines.length === 0) {
      continue;
    }
    console.error(`\n=== ${g} ===`);
    for (const line of lines) {
      console.error(`  • ${line}`);
    }
  }
}

export function runValidateNormalized(): boolean {
  report.clear();

  const medPath = normalizedMedicationsPath();
  const algPath = normalizedAlgorithmsPath();

  const medRead = readJson(medPath, "Medikamente");
  const algRead = readJson(algPath, "Algorithmen");

  let medList: unknown[] | null = null;
  let algList: unknown[] | null = null;
  const medicationIds = new Set<string>();
  const algorithmIds = new Set<string>();

  if (medRead.ok) {
    if (!isRecord(medRead.data)) {
      add("Bundle (Medikamente)", "Wurzel muss ein JSON-Objekt sein.");
    } else {
      const root = medRead.data;
      const bid = root.bundleSchemaId;
      if (bid !== MED_BUNDLE_ID) {
        add(
          "Bundle (Medikamente)",
          `bundleSchemaId muss "${MED_BUNDLE_ID}" sein (ist: ${JSON.stringify(bid)}).`,
        );
      }
      const meds = root.medications;
      if (!Array.isArray(meds)) {
        add("Bundle (Medikamente)", `"medications" muss ein Array sein.`);
      } else if (meds.length === 0) {
        add("Bundle (Medikamente)", `"medications" darf nicht leer sein.`);
      } else {
        medList = meds;
      }
    }
  }

  if (algRead.ok) {
    if (!isRecord(algRead.data)) {
      add("Bundle (Algorithmen)", "Wurzel muss ein JSON-Objekt sein.");
    } else {
      const root = algRead.data;
      const bid = root.bundleSchemaId;
      if (bid !== ALG_BUNDLE_ID) {
        add(
          "Bundle (Algorithmen)",
          `bundleSchemaId muss "${ALG_BUNDLE_ID}" sein (ist: ${JSON.stringify(bid)}).`,
        );
      }
      const algs = root.algorithms;
      if (!Array.isArray(algs)) {
        add("Bundle (Algorithmen)", `"algorithms" muss ein Array sein.`);
      } else if (algs.length === 0) {
        add("Bundle (Algorithmen)", `"algorithms" darf nicht leer sein.`);
      } else {
        algList = algs;
      }
    }
  }

  const allowedMedKeys = new Set([
    "entityType",
    "id",
    "label",
    "genericName",
    "tradeNames",
    "indication",
    "tags",
    "searchTerms",
    "dosage",
    "contraindicationsNote",
    "clinicalNotes",
    "relatedAlgorithmIds",
    "provenance",
  ]);

  const allowedAlgKeys = new Set([
    "entityType",
    "id",
    "label",
    "indication",
    "tags",
    "searchTerms",
    "steps",
    "warnings",
    "clinicalNotes",
    "relatedMedicationIds",
    "provenance",
  ]);

  if (medList) {
    for (let i = 0; i < medList.length; i++) {
      const ctx = `medications[${i}]`;
      const item = medList[i];
      if (!isRecord(item)) {
        add("Medikamente (Datensätze)", `${ctx}: Eintrag muss ein Objekt sein.`);
        continue;
      }
      const unknown = Object.keys(item).filter((k) => !allowedMedKeys.has(k));
      if (unknown.length > 0) {
        add(
          "Medikamente (Datensätze)",
          `${ctx}: unerwartete Schlüssel: ${unknown.sort().join(", ")}`,
        );
      }
      if (item.entityType !== "NormalizedMedication") {
        add(
          "Medikamente (Datensätze)",
          `${ctx}: entityType muss "NormalizedMedication" sein (ist: ${JSON.stringify(item.entityType)}).`,
        );
      }
      const id = nonEmptyString(item.id, ctx, "id");
      if (id) {
        if (medicationIds.has(id)) {
          add("IDs", `Medikamenten-ID mehrfach: "${id}" (${ctx}).`);
        }
        medicationIds.add(id);
      }
      nonEmptyString(item.label, ctx, "label");
      nonEmptyString(item.indication, ctx, "indication");
      validateStringArray(item.tags, ctx, "tags", "Medikamente (Datensätze)");
      validateStringArray(item.searchTerms, ctx, "searchTerms", "Medikamente (Datensätze)");
      validateDosage(item.dosage, ctx);
      const relAlg = item.relatedAlgorithmIds;
      if (!Array.isArray(relAlg)) {
        add("Medikamente (Datensätze)", `${ctx}: "relatedAlgorithmIds" muss ein Array sein.`);
      } else {
        for (let j = 0; j < relAlg.length; j++) {
          if (typeof relAlg[j] !== "string" || relAlg[j].trim() === "") {
            add(
              "Medikamente (Datensätze)",
              `${ctx}: relatedAlgorithmIds[${j}] muss ein nicht-leerer String sein.`,
            );
          }
        }
      }
      validateOptionalNonEmptyStringMed(item, "genericName", ctx);
      validateOptionalNonEmptyStringMed(item, "contraindicationsNote", ctx);
      validateOptionalNonEmptyStringMed(item, "clinicalNotes", ctx);
      validateTradeNames(item, ctx);
      validateProvenance(item.provenance, ctx, "Medikamente (Datensätze)");
    }
  }

  if (algList) {
    for (let i = 0; i < algList.length; i++) {
      const ctx = `algorithms[${i}]`;
      const item = algList[i];
      if (!isRecord(item)) {
        add("Algorithmen (Datensätze)", `${ctx}: Eintrag muss ein Objekt sein.`);
        continue;
      }
      const unknown = Object.keys(item).filter((k) => !allowedAlgKeys.has(k));
      if (unknown.length > 0) {
        add(
          "Algorithmen (Datensätze)",
          `${ctx}: unerwartete Schlüssel: ${unknown.sort().join(", ")}`,
        );
      }
      if (item.entityType !== "NormalizedAlgorithm") {
        add(
          "Algorithmen (Datensätze)",
          `${ctx}: entityType muss "NormalizedAlgorithm" sein (ist: ${JSON.stringify(item.entityType)}).`,
        );
      }
      const id = nonEmptyStringAlg(item.id, ctx, "id");
      if (id) {
        if (algorithmIds.has(id)) {
          add("IDs", `Algorithmus-ID mehrfach: "${id}" (${ctx}).`);
        }
        algorithmIds.add(id);
      }
      nonEmptyStringAlg(item.label, ctx, "label");
      nonEmptyStringAlg(item.indication, ctx, "indication");
      validateStringArray(item.tags, ctx, "tags", "Algorithmen (Datensätze)");
      validateStringArray(item.searchTerms, ctx, "searchTerms", "Algorithmen (Datensätze)");
      validateAlgorithmSteps(item.steps, ctx);
      const relMed = item.relatedMedicationIds;
      if (!Array.isArray(relMed)) {
        add("Algorithmen (Datensätze)", `${ctx}: "relatedMedicationIds" muss ein Array sein.`);
      } else {
        for (let j = 0; j < relMed.length; j++) {
          if (typeof relMed[j] !== "string" || relMed[j].trim() === "") {
            add(
              "Algorithmen (Datensätze)",
              `${ctx}: relatedMedicationIds[${j}] muss ein nicht-leerer String sein.`,
            );
          }
        }
      }
      validateOptionalNotesAlg(item, ctx);
      validateProvenance(item.provenance, ctx, "Algorithmen (Datensätze)");
    }
  }

  for (const id of medicationIds) {
    if (algorithmIds.has(id)) {
      add("IDs", `Die ID "${id}" kommt sowohl bei Medikamenten als bei Algorithmen vor (Seed verbietet das).`);
    }
  }

  if (medList && algList) {
    for (let i = 0; i < medList.length; i++) {
      const item = medList[i];
      if (!isRecord(item)) {
        continue;
      }
      const rel = item.relatedAlgorithmIds;
      if (!Array.isArray(rel)) {
        continue;
      }
      for (let j = 0; j < rel.length; j++) {
        const aid = typeof rel[j] === "string" ? rel[j].trim() : "";
        if (aid && !algorithmIds.has(aid)) {
          add(
            "Querverweise",
            `medications[${i}]: relatedAlgorithmIds verweist auf unbekannte Algorithmus-ID "${aid}".`,
          );
        }
      }
    }
    for (let i = 0; i < algList.length; i++) {
      const item = algList[i];
      if (!isRecord(item)) {
        continue;
      }
      const rel = item.relatedMedicationIds;
      if (!Array.isArray(rel)) {
        continue;
      }
      for (let j = 0; j < rel.length; j++) {
        const mid = typeof rel[j] === "string" ? rel[j].trim() : "";
        if (mid && !medicationIds.has(mid)) {
          add(
            "Querverweise",
            `algorithms[${i}]: relatedMedicationIds verweist auf unbekannte Medikamenten-ID "${mid}".`,
          );
        }
      }
    }
  }

  let errorCount = 0;
  for (const lines of report.values()) {
    errorCount += lines.length;
  }

  if (errorCount > 0) {
    console.error(`[dbrd-validate-normalized] ${errorCount} Problem(e) in normalisierten Daten:`);
    printReport();
    return false;
  }

  const medCount = medList?.length ?? 0;
  const algCount = algList?.length ?? 0;
  console.log(
    `[dbrd-validate-normalized] OK — ${medCount} Medikament(e), ${algCount} Algorithmus/Algorithmen geprüft.`,
  );
  return true;
}

function printHelp(): void {
  console.log(`validate-normalized — prüft medications.normalized.v1.json und algorithms.normalized.v1.json

  pnpm dbrd:validate-normalized
  tsx scripts/dbrd/validate-normalized.ts`);
}

function main(): void {
  const arg = process.argv[2]?.toLowerCase();
  if (arg === "-h" || arg === "--help") {
    printHelp();
    process.exit(0);
  }
  const ok = runValidateNormalized();
  process.exit(ok ? 0 : 1);
}

const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] !== undefined &&
  path.normalize(path.resolve(process.argv[1])) === path.normalize(path.resolve(__filename));

if (isDirectRun) {
  main();
}
