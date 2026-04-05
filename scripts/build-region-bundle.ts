import path from "node:path";
import { fileURLToPath } from "node:url";

import type { LookupManifest } from "../apps/mobile-app/src/lookup/lookupSchema";
import { validateLookupBundle } from "../apps/mobile-app/src/lookup/validateLookupBundle";
import {
  lookupAlgorithmsSeedPath,
  lookupManifestSeedPath,
  lookupMedicationsSeedPath,
  readJsonFile,
  repoRoot,
  writeJsonFile,
} from "./dbrd/common";

type CliArgs = {
  readonly organizationId: string;
  readonly regionId: string;
  readonly help: boolean;
};

type LookupRecord = Record<string, unknown>;

function fail(detail: string): never {
  console.error(`[build-region-bundle] FEHLER: ${detail}`);
  process.exit(1);
}

function parseArgs(argv: string[]): CliArgs {
  let organizationId: string | undefined;
  let regionId: string | undefined;
  let help = false;
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "-h" || arg === "--help") {
      help = true;
      continue;
    }

    if (arg === "--organizationId") {
      organizationId = argv[++i];
      continue;
    }

    if (arg.startsWith("--organizationId=")) {
      organizationId = arg.slice("--organizationId=".length);
      continue;
    }

    if (arg === "--regionId") {
      regionId = argv[++i];
      continue;
    }

    if (arg.startsWith("--regionId=")) {
      regionId = arg.slice("--regionId=".length);
      continue;
    }

    positional.push(arg);
  }

  if (!organizationId && positional[0]) {
    organizationId = positional[0];
  }

  if (!regionId && positional[1]) {
    regionId = positional[1];
  }

  return {
    organizationId: normalizeRequiredArg(organizationId, "organizationId"),
    regionId: normalizeRequiredArg(regionId, "regionId"),
    help,
  };
}

function normalizeRequiredArg(value: string | undefined, field: string): string {
  if (value == null) {
    return "";
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "";
}

function sanitizePathSegment(value: string, field: string): string {
  if (!/^[A-Za-z0-9._-]+$/.test(value)) {
    fail(`${field} darf nur A-Z, a-z, 0-9, ".", "_" oder "-" enthalten.`);
  }
  return value;
}

function isScopedRecordForRegion(
  record: LookupRecord,
  organizationId: string,
  regionId: string,
): boolean {
  const recordOrganizationId = normalizeOptionalString(record.organizationId);
  if (recordOrganizationId != null && recordOrganizationId !== organizationId) {
    return false;
  }

  const recordRegionId = normalizeOptionalString(record.regionId);
  if (recordRegionId != null && recordRegionId !== regionId) {
    return false;
  }

  return true;
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function assertRecordArray(value: unknown, field: string): LookupRecord[] {
  if (!Array.isArray(value)) {
    fail(`${field} muss ein Array sein.`);
  }

  const out: LookupRecord[] = [];
  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      fail(`${field}[${i}] muss ein Objekt sein.`);
    }
    out.push(row as LookupRecord);
  }
  return out;
}

function assertManifest(value: unknown): LookupManifest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail("manifest.json muss ein Objekt sein.");
  }
  return value as LookupManifest;
}

function buildScopedManifest(
  base: LookupManifest,
  organizationId: string,
  regionId: string,
): LookupManifest {
  const scopedBundleId = `${base.bundleId}-${organizationId}-${regionId}`;
  const scopedVersion =
    base.version != null ? `${base.version}-${organizationId}-${regionId}` : undefined;
  const scopedChecksum =
    base.checksum != null ? `${base.checksum}-${organizationId}-${regionId}` : undefined;

  return {
    ...base,
    bundleId: scopedBundleId,
    ...(scopedVersion ? { version: scopedVersion } : {}),
    ...(scopedChecksum ? { checksum: scopedChecksum } : {}),
    generatedAt: new Date().toISOString(),
  };
}

function createScopedBundle(
  organizationId: string,
  regionId: string,
): {
  readonly manifest: LookupManifest;
  readonly medications: LookupRecord[];
  readonly algorithms: LookupRecord[];
} {
  const manifest = assertManifest(readJsonFile(lookupManifestSeedPath()));
  const medications = assertRecordArray(
    readJsonFile(lookupMedicationsSeedPath()),
    "medications",
  ).filter((item) => isScopedRecordForRegion(item, organizationId, regionId));
  const algorithms = assertRecordArray(
    readJsonFile(lookupAlgorithmsSeedPath()),
    "algorithms",
  ).filter((item) => isScopedRecordForRegion(item, organizationId, regionId));

  const scopedManifest = buildScopedManifest(manifest, organizationId, regionId);
  const validation = validateLookupBundle({
    manifest: scopedManifest,
    medications,
    algorithms,
  });

  if (!validation.ok) {
    console.error("[build-region-bundle] Validierung fehlgeschlagen:");
    for (const error of validation.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  return {
    manifest: scopedManifest,
    medications,
    algorithms,
  };
}

function outputDirFor(organizationId: string, regionId: string): string {
  return path.join(
    repoRoot,
    "data",
    "bundles",
    sanitizePathSegment(organizationId, "organizationId"),
    sanitizePathSegment(regionId, "regionId"),
  );
}

export function runBuildRegionBundle(
  organizationId: string,
  regionId: string,
): void {
  const normalizedOrganizationId = sanitizePathSegment(organizationId.trim(), "organizationId");
  const normalizedRegionId = sanitizePathSegment(regionId.trim(), "regionId");

  const bundle = createScopedBundle(normalizedOrganizationId, normalizedRegionId);
  const outputDir = outputDirFor(normalizedOrganizationId, normalizedRegionId);

  writeJsonFile(path.join(outputDir, "manifest.json"), bundle.manifest);
  writeJsonFile(path.join(outputDir, "medications.json"), bundle.medications);
  writeJsonFile(path.join(outputDir, "algorithms.json"), bundle.algorithms);

  console.log(
    `[build-region-bundle] Fertig: ${path.relative(repoRoot, outputDir)} ` +
      `(${bundle.medications.length} Medikamente, ${bundle.algorithms.length} Algorithmen)`,
  );
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`build-region-bundle - erzeugt ein regionales Lookup-Bundle

Aufruf:
  pnpm exec tsx scripts/build-region-bundle.ts <organizationId> <regionId>
  pnpm exec tsx scripts/build-region-bundle.ts --organizationId <organizationId> --regionId <regionId>
`);
    process.exit(0);
  }

  if (!args.organizationId) {
    fail("organizationId ist erforderlich.");
  }
  if (!args.regionId) {
    fail("regionId ist erforderlich.");
  }

  runBuildRegionBundle(args.organizationId, args.regionId);
}

const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] !== undefined &&
  path.normalize(path.resolve(process.argv[1])) === path.normalize(path.resolve(__filename));

if (isDirectRun) {
  main();
}
