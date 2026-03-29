/**
 * Validiert `data/lookup-seed/*.json` streng gegen das Phase-0-Lookup-Schema
 * der Mobile-App (`validateLookupBundle` — gleiche Regeln wie `dbrd:build-lookup-seed`).
 *
 * Aufruf:
 *   pnpm dbrd:validate-lookup-seed
 *   pnpm exec tsx scripts/dbrd/validate-lookup-bundle.ts
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  collectLookupBidirectionalWarnings,
  validateLookupBundle,
} from "../../apps/mobile-app/src/lookup/validateLookupBundle";
import {
  lookupAlgorithmsSeedPath,
  lookupManifestSeedPath,
  lookupMedicationsSeedPath,
  readJsonFile,
  repoRoot,
} from "./common";

function relFromRepo(absolute: string): string {
  return path.relative(repoRoot, absolute).split(path.sep).join("/");
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

/**
 * Ergänzt Meldungen um die betroffene Datei (Pfad relativ zum Repo).
 * Quelle der Regeln: `apps/mobile-app/src/lookup/validateLookupBundle.ts`.
 *
 * Hinweis zum Schema: `warnings` bei Algorithmen ist in Phase 0 optional als **String**
 * (nicht als Array) — siehe `Algorithm` in `types/content.ts`.
 */
function withSeedFileContext(
  message: string,
  files: {
    manifestRel: string;
    medicationsRel: string;
    algorithmsRel: string;
  },
): string {
  if (message.startsWith("manifest")) {
    return `${files.manifestRel}: ${message}`;
  }
  if (message.startsWith("bundle:")) {
    return `${files.manifestRel} + ${files.medicationsRel} + ${files.algorithmsRel}: ${message}`;
  }
  if (message.startsWith("medications id ") || message.startsWith("algorithms id ")) {
    return `${files.medicationsRel} ↔ ${files.algorithmsRel}: ${message}`;
  }
  if (message.startsWith("medications")) {
    return `${files.medicationsRel}: ${message}`;
  }
  if (message.startsWith("algorithms")) {
    return `${files.algorithmsRel}: ${message}`;
  }
  return message;
}

function main(): void {
  const manifestPath = lookupManifestSeedPath();
  const medicationsPath = lookupMedicationsSeedPath();
  const algorithmsPath = lookupAlgorithmsSeedPath();

  const manifestRel = relFromRepo(manifestPath);
  const medicationsRel = relFromRepo(medicationsPath);
  const algorithmsRel = relFromRepo(algorithmsPath);

  const files = { manifestRel, medicationsRel, algorithmsRel };

  const manifest = readJsonFile(manifestPath);
  const medications = readJsonFile(medicationsPath);
  const algorithms = readJsonFile(algorithmsPath);

  const result = validateLookupBundle({ manifest, medications, algorithms });

  if (!result.ok) {
    console.error("");
    console.error("Lookup-Bundle — FEHLER");
    console.error("─".repeat(56));
    console.error("Schema / Querverweise (hart):");
    for (const err of result.errors) {
      console.error(`  • ${withSeedFileContext(err, files)}`);
    }
    console.error("");
    process.exit(1);
  }

  const medCount = result.data.medications.length;
  const algCount = result.data.algorithms.length;
  const validatedMeds = result.data.medications;
  const validatedAlgs = result.data.algorithms;

  const symmetryWarnings = collectLookupBidirectionalWarnings(validatedMeds, validatedAlgs);

  console.log("");
  console.log("Lookup-Bundle — OK");
  console.log("─".repeat(56));
  console.log(`  Dateien: ${manifestRel}`);
  console.log(`           ${medicationsRel}`);
  console.log(`           ${algorithmsRel}`);
  console.log(`  Einträge: ${medCount} Medikamente, ${algCount} Algorithmen (Phase-0-Schema).`);
  console.log("  Querverweise: existierende IDs, keine Self-Refs, keine Dubletten in Arrays — ok.");

  if (symmetryWarnings.length > 0) {
    console.log("");
    console.warn("WARN — bidirektionale Verknüpfungen (optional, nur Hinweis):");
    for (const w of symmetryWarnings) {
      console.warn(`  • ${w}`);
    }
  }

  console.log("");
}

const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] !== undefined &&
  path.normalize(path.resolve(process.argv[1])) === path.normalize(path.resolve(__filename));

if (isDirectRun) {
  const { help } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(`validate-lookup-bundle — prüft data/lookup-seed gegen validateLookupBundle (Mobile-App)

  -h, --help`);
    process.exit(0);
  }
  main();
}
