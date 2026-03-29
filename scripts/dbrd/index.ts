/**
 * Einstieg: Rohdaten (JSON) → normalisierte Bundles unter data/dbrd-source/normalized/
 *
 * Aufruf:
 *   pnpm dbrd:normalize              — Medikamente und Algorithmen
 *   pnpm exec tsx scripts/dbrd/index.ts medications
 *   pnpm exec tsx scripts/dbrd/index.ts algorithms
 *   pnpm exec tsx scripts/dbrd/index.ts seed   — normalisiert → lookup-seed (siehe auch pnpm dbrd:build-lookup-seed)
 *   pnpm exec tsx scripts/dbrd/index.ts validate-normalized — harte Prüfung der normalisierten JSONs
 */

import { runBuildLookupSeed } from "./build-lookup-seed";
import { runNormalizeAlgorithms } from "./normalize-algorithms";
import { runNormalizeMedications } from "./normalize-medications";
import { runValidateNormalized } from "./validate-normalized";

function parseContentCutoff(argv: string[]): string | undefined {
  for (const a of argv) {
    if (a.startsWith("--content-cutoff-date=")) {
      return a.slice("--content-cutoff-date=".length).trim();
    }
    if (a.startsWith("--cutoff-date=")) {
      return a.slice("--cutoff-date=".length).trim();
    }
  }
  return undefined;
}

function printUsage(): void {
  console.log(`Usage:
  tsx scripts/dbrd/index.ts [medications|algorithms|all|seed|lookup-seed|validate-normalized]

Ohne Argument: alle Normalisierungsschritte (entspricht "all").
seed / lookup-seed: Build von data/lookup-seed/ aus normalized/ (optional: --content-cutoff-date=YYYY-MM-DD).
validate-normalized: Prüfung von medications/algorithms.normalized.v1.json (Pflichtfelder, steps, IDs, Querverweise).`);
}

function main(): void {
  const arg = process.argv[2]?.toLowerCase();

  if (arg === "-h" || arg === "--help") {
    printUsage();
    process.exit(0);
  }

  const mode = arg === undefined || arg === "" || arg === "all" ? "all" : arg;

  if (
    mode !== "medications" &&
    mode !== "algorithms" &&
    mode !== "all" &&
    mode !== "seed" &&
    mode !== "lookup-seed" &&
    mode !== "validate-normalized"
  ) {
    console.error(`[dbrd-normalize] Unbekanntes Argument: ${process.argv[2] ?? ""}`);
    printUsage();
    process.exit(1);
  }

  try {
    if (mode === "validate-normalized") {
      if (!runValidateNormalized()) {
        process.exit(1);
      }
      return;
    }
    if (mode === "seed" || mode === "lookup-seed") {
      runBuildLookupSeed(parseContentCutoff(process.argv.slice(3)));
      return;
    }
    if (mode === "medications" || mode === "all") {
      runNormalizeMedications();
    }
    if (mode === "algorithms" || mode === "all") {
      runNormalizeAlgorithms();
    }
  } catch (e) {
    console.error("[dbrd-normalize] Unerwarteter Fehler:");
    console.error(e);
    process.exit(1);
  }

  console.log("[dbrd-normalize] Fertig.");
}

main();
