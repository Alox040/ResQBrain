import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Step = { text: string };

type Algorithm = {
  id: string;
  kind?: string;
  label?: string;
  tags?: string[];
  searchTerms?: string[];
  steps?: Step[];
  relatedMedicationIds?: string[];
};

type Result = {
  level: "WARN" | "FAIL";
  check: string;
  message: string;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function readJson<T>(relativePath: string): T {
  const abs = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(abs, "utf-8")) as T;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string") && value.length > 0;
}

function main(): void {
  const results: Result[] = [];

  const algorithms = readJson<Algorithm[]>("data/lookup/algorithms.json");
  const medications = readJson<Array<{ id: string }>>("data/lookup/medications.json");
  const medicationIds = new Set(medications.map((m) => m.id));

  // duplicate ids
  const idCounts = new Map<string, number>();
  for (const alg of algorithms) {
    idCounts.set(alg.id, (idCounts.get(alg.id) ?? 0) + 1);
  }
  const duplicateIds = [...idCounts.entries()].filter(([, count]) => count > 1);
  for (const [id, count] of duplicateIds) {
    results.push({
      level: "FAIL",
      check: "duplicate ids",
      message: `id '${id}' appears ${count} times`,
    });
  }

  // per-algorithm checks
  for (const alg of algorithms) {
    if (!isNonEmptyString(alg.label)) {
      results.push({
        level: "FAIL",
        check: "missing label",
        message: `algorithm '${alg.id}' missing/empty label`,
      });
    }

    const steps = alg.steps ?? [];
    if (!Array.isArray(steps) || steps.length === 0) {
      results.push({
        level: "FAIL",
        check: "empty steps",
        message: `algorithm '${alg.id}' has no steps`,
      });
    } else {
      const badStep = steps.find((s) => !isNonEmptyString(s?.text));
      if (badStep) {
        results.push({
          level: "FAIL",
          check: "empty steps",
          message: `algorithm '${alg.id}' has step with empty text`,
        });
      }
    }

    if (!isNonEmptyStringArray(alg.tags)) {
      results.push({
        level: "FAIL",
        check: "empty tags",
        message: `algorithm '${alg.id}' has empty/missing tags`,
      });
    }

    if (!isNonEmptyStringArray(alg.searchTerms)) {
      results.push({
        level: "FAIL",
        check: "empty searchTerms",
        message: `algorithm '${alg.id}' has empty/missing searchTerms`,
      });
    }

    // invalid medication ids
    const rel = alg.relatedMedicationIds ?? [];
    if (Array.isArray(rel)) {
      for (const medId of rel) {
        if (!isNonEmptyString(medId)) continue;
        if (!medicationIds.has(medId)) {
          results.push({
            level: "WARN",
            check: "invalid medication ids",
            message: `algorithm '${alg.id}' references missing medication '${medId}'`,
          });
        }
      }
    }
  }

  const hasFail = results.some((r) => r.level === "FAIL");
  const hasWarn = results.some((r) => r.level === "WARN");
  const verdict = hasFail ? "FAIL" : hasWarn ? "WARN" : "PASS";

  const lines: string[] = [];
  lines.push(`Algorithms validation: ${verdict}`);

  if (results.length > 0) {
    for (const r of results) {
      lines.push(`[${r.level}] ${r.check}: ${r.message}`);
    }
  }

  process.stdout.write(`${lines.join("\n")}\n`);
  if (hasFail) process.exitCode = 1;
}

main();

