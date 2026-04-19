#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

/** MDR heuristics apply to shipping app surfaces, not platform domain or tooling trees. */
const SCAN_ROOTS = [
  path.join(ROOT, "apps", "mobile-app"),
  path.join(ROOT, "apps", "website"),
  path.join(ROOT, "lib"),
];

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vercel",
  // Prototypes, design exports, and third-party UI kits.
  "figma",
  "figma-export",
  "ui8",
  "_extracted",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
]);

const suspiciousPatterns = [
  {
    pattern: /\bsuggestNextStep\b/i,
    severity: "HIGH",
    reason: "Decision-support wording/function",
  },
  {
    pattern: /\brecommend[A-Z_a-z0-9]*\b/,
    severity: "HIGH",
    reason: "Recommendation logic naming",
  },
  {
    pattern: /\bcalculate[A-Z_a-z0-9]*\b/,
    severity: "HIGH",
    reason: "Calculation logic naming",
  },
  {
    pattern: /\bevaluate[A-Z_a-z0-9]*\b/,
    severity: "HIGH",
    reason: "Evaluation logic naming",
  },
  {
    pattern: /\bbest[A-Z_a-z0-9]*\b/,
    severity: "MEDIUM",
    reason: "Optimization / prioritization naming",
  },
  {
    pattern: /\boptimal[A-Z_a-z0-9]*\b/i,
    severity: "MEDIUM",
    reason: "Optimization / prioritization wording",
  },
  {
    pattern: /\bcalculateDosage\b/i,
    severity: "HIGH",
    reason: "Dosage calculation is forbidden in MDR-safe mode",
  },
  {
    pattern: /\brecommendMedication\b/i,
    severity: "HIGH",
    reason: "Medication recommendation is forbidden",
  },
  {
    pattern: /\bpatient\b/i,
    severity: "MEDIUM",
    reason: "Patient-specific processing must be reviewed",
  },
  {
    pattern: /\bvital ?sign/i,
    severity: "HIGH",
    reason: "Vital-sign processing indicates decision-support risk",
  },
  {
    pattern: /Nächster Schritt/i,
    severity: "HIGH",
    reason: "Guided clinical next-step wording",
  },
  {
    pattern: /Recommended/i,
    severity: "MEDIUM",
    reason: "Recommendation wording in UI/content",
  },
  {
    pattern: /Empfohlen/i,
    severity: "MEDIUM",
    reason: "Recommendation wording in UI/content",
  },
  {
    pattern: /Jetzt durchführen/i,
    severity: "HIGH",
    reason: "Action-guidance wording in UI/content",
  },
];

const findings = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith(".codex-")) continue;
      walk(fullPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;

    scanFile(fullPath);
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(ROOT, filePath);
  const lines = content.split(/\r?\n/);

  suspiciousPatterns.forEach(({ pattern, severity, reason }) => {
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        findings.push({
          file: relPath,
          line: index + 1,
          severity,
          reason,
          snippet: line.trim(),
        });
      }
    });
  });
}

function printFindings() {
  console.error("\nMDR boundary violations / review findings detected:\n");

  for (const finding of findings) {
    console.error(
      `[${finding.severity}] ${finding.file}:${finding.line}\n` +
        `  Reason: ${finding.reason}\n` +
        `  Snippet: ${finding.snippet}\n`
    );
  }

  console.error(
    "Review required against docs/context/regulatory-boundary.md\n"
  );
}

function main() {
  const boundaryFile = path.join(ROOT, "docs", "context", "regulatory-boundary.md");

  if (!fs.existsSync(boundaryFile)) {
    console.error(
      "Missing required file: docs/context/regulatory-boundary.md"
    );
    process.exit(1);
  }

  const roots = SCAN_ROOTS.filter((p) => fs.existsSync(p));
  if (roots.length === 0) {
    console.error(
      "MDR boundary check: expected at least one of apps/mobile-app, apps/website, or lib."
    );
    process.exit(1);
  }
  for (const scanRoot of roots) {
    walk(scanRoot);
  }

  if (findings.length > 0) {
    printFindings();
    process.exit(1);
  }

  console.log("MDR boundary check passed.");
  process.exit(0);
}

main();