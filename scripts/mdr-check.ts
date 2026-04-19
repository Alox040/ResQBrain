#!/usr/bin/env node
// @ts-nocheck

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

type Severity = "LOW" | "MEDIUM" | "HIGH";

type Finding = {
  file: string;
  line: number;
  severity: Severity;
  reason: string;
  snippet: string;
};

type Rule = {
  severity: Severity;
  reason: string;
  test: (line: string, normalized: string) => boolean;
};

const ROOT = process.cwd();

const DEFAULT_SCAN_ROOTS = [
  resolve(ROOT, "apps", "website"),
  resolve(ROOT, "apps", "mobile-app"),
  resolve(ROOT, "lib"),
];

const IGNORE_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "figma",
  "figma-export",
  "tmp",
]);

const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"]);

function normalize(input: string): string {
  return input.toLocaleLowerCase("de-DE");
}

function hasAny(text: string, parts: readonly string[]): boolean {
  return parts.some((part) => text.includes(part));
}

function hasAll(text: string, parts: readonly string[]): boolean {
  return parts.every((part) => text.includes(part));
}

const rules: readonly Rule[] = [
  {
    severity: "HIGH",
    reason: 'Patientenbezug zusammen mit Dosierungs- oder Therapiekontext',
    test: (_line, normalized) =>
      normalized.includes("patient") &&
      hasAny(normalized, ["dosis", "dosierung", "therapie", "behandlung", "gewicht", "vital"]),
  },
  {
    severity: "HIGH",
    reason: 'Expliziter Einsatzbezug über "im Einsatz"',
    test: (_line, normalized) => normalized.includes("im einsatz"),
  },
  {
    severity: "HIGH",
    reason: "Behandlungsbezug in Website-Texten",
    test: (_line, normalized) => normalized.includes("behandlung"),
  },
  {
    severity: "HIGH",
    reason: 'System trifft oder steuert Entscheidungen über Formulierungen wie "entscheidet"',
    test: (_line, normalized) => normalized.includes("entscheidet"),
  },
  {
    severity: "HIGH",
    reason: 'Empfehlungslogik oder Empfehlungssprache über "empfiehlt"',
    test: (_line, normalized) => normalized.includes("empfiehlt"),
  },
  {
    severity: "HIGH",
    reason: "Akuter medizinischer Kontext aus Thema plus Algorithmus/Lookup",
    test: (_line, normalized) =>
      hasAny(normalized, ["anaphylax", "adrenalin"]) &&
      hasAny(normalized, ["algorithm", "dosierung", "dosis", "sucht", "findet"]),
  },
  {
    severity: "HIGH",
    reason: "Zuverlaessigkeitsclaim in Verbindung mit Fahrzeug-/Funkloch-/Offline-Kontext",
    test: (_line, normalized) =>
      hasAny(normalized, ["zuverlaessig", "zuverlässig", "100% offline", "100 % offline"]) &&
      hasAny(normalized, ["fahrzeug", "funkloch", "offline", "synchronisiert"]),
  },
  {
    severity: "MEDIUM",
    reason: "Patientenbezug zur manuellen regulatorischen Pruefung",
    test: (_line, normalized) => normalized.includes("patient"),
  },
  {
    severity: "MEDIUM",
    reason: "Relativer klinischer Kontext ueber Behandlungs- oder Entscheidungsnahe",
    test: (_line, normalized) =>
      hasAny(normalized, ["therapie", "diagnose", "klinisch", "medizinische verantwortung"]) &&
      !normalized.includes("keine medizinischen entscheidungen"),
  },
  {
    severity: "MEDIUM",
    reason: "Kontextkombination aus freigegebenem Inhalt und medizinischem Thema",
    test: (_line, normalized) =>
      hasAny(normalized, ["algorithm", "medikament", "sop", "protokoll"]) &&
      hasAny(normalized, ["freigegeben", "leitlinie", "richtlinie"]),
  },
  {
    severity: "LOW",
    reason: "Allgemeiner medizinischer Kontextbegriff",
    test: (_line, normalized) => hasAny(normalized, ["medizin", "medikament", "algorithm", "sop"]),
  },
];

function shouldIgnorePath(pathname: string): boolean {
  const parts = pathname.split(/[\\/]+/);
  return parts.some((part) => IGNORE_DIRS.has(part));
}

function walk(dir: string, collected: string[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (shouldIgnorePath(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      walk(fullPath, collected);
      continue;
    }

    if (!ALLOWED_EXTENSIONS.has(extname(entry.name))) {
      continue;
    }

    collected.push(fullPath);
  }
}

function highestSeverity(a: Severity, b: Severity): Severity {
  const order: Record<Severity, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };
  return order[a] >= order[b] ? a : b;
}

function collectFindings(filePath: string): Finding[] {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const findings: Finding[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalized = normalize(line);

    let matchedSeverity: Severity | null = null;
    const reasons: string[] = [];

    for (const rule of rules) {
      if (!rule.test(line, normalized)) {
        continue;
      }

      matchedSeverity = matchedSeverity ? highestSeverity(matchedSeverity, rule.severity) : rule.severity;
      reasons.push(rule.reason);
    }

    if (!matchedSeverity) {
      continue;
    }

    findings.push({
      file: relative(ROOT, filePath),
      line: index + 1,
      severity: matchedSeverity,
      reason: Array.from(new Set(reasons)).join("; "),
      snippet: line.trim(),
    });
  }

  return findings;
}

function resolveScanRoots(cliArgs: readonly string[]): string[] {
  if (cliArgs.length === 0) {
    return DEFAULT_SCAN_ROOTS.filter((path) => existsSync(path));
  }

  return cliArgs.map((arg) => resolve(ROOT, arg)).filter((path) => existsSync(path));
}

function printUsage(): void {
  console.log("Usage: pnpm exec tsx scripts/mdr-check.ts [path ...]");
  console.log("If no path is given, the script scans apps/website, apps/mobile-app, and lib.");
}

function main(): void {
  const cliArgs = process.argv.slice(2);

  if (cliArgs.includes("--help") || cliArgs.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const scanRoots = resolveScanRoots(cliArgs);

  if (scanRoots.length === 0) {
    console.error("MDR check: no existing scan roots found.");
    process.exit(1);
  }

  const files: string[] = [];
  for (const scanRoot of scanRoots) {
    walk(scanRoot, files);
  }

  const findings = files.flatMap((filePath) => collectFindings(filePath));
  const highFindings = findings.filter((finding) => finding.severity === "HIGH");
  const mediumFindings = findings.filter((finding) => finding.severity === "MEDIUM");
  const lowFindings = findings.filter((finding) => finding.severity === "LOW");

  if (findings.length === 0) {
    console.log("MDR text check passed. No findings.");
    process.exit(0);
  }

  console.log("MDR text check findings:\n");

  for (const finding of findings.filter((entry) => entry.severity !== "LOW")) {
    console.log(`[${finding.severity}] ${finding.file}:${finding.line}`);
    console.log(`  Grund: ${finding.reason}`);
    console.log(`  Text: ${finding.snippet}`);
    console.log();
  }

  if (lowFindings.length > 0) {
    console.log(`LOW findings ignored: ${lowFindings.length}`);
  }

  console.log(
    `Summary: HIGH=${highFindings.length}, MEDIUM=${mediumFindings.length}, LOW=${lowFindings.length}`,
  );

  if (highFindings.length > 0) {
    process.exit(1);
  }

  if (mediumFindings.length > 0) {
    process.exit(0);
  }

  process.exit(0);
}

main();
