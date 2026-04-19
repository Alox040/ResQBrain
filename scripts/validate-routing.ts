import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function fileExists(relativePath: string): boolean {
  return existsSync(path.join(repoRoot, relativePath));
}

function readFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf-8");
}

// --- 1. app/page.tsx existiert ---

const PAGE_FILE = "apps/website/app/page.tsx";
const pageExists = fileExists(PAGE_FILE);

// --- 2. Section-Imports in app/page.tsx ---

const REQUIRED_SECTIONS = [
  "HeroSection",
  "ProblemSection",
  "IdeaProjectGoalSplitSection",
  "StatusSection",
  "AudienceSection",
  "MitwirkungSection",
  "FaqSection",
] as const;

type SectionImportCheck = {
  section: string;
  imported: boolean;
};

let sectionChecks: SectionImportCheck[] = [];

if (pageExists) {
  const pageContent = readFile(PAGE_FILE);
  sectionChecks = REQUIRED_SECTIONS.map((section) => ({
    section,
    imported: pageContent.includes(`import`) && pageContent.includes(section),
  }));
}

// --- 3. Statische Routen ---

type RouteCheck = {
  route: string;
  file: string;
  exists: boolean;
};

const routeChecks: RouteCheck[] = [
  { route: "/", file: "apps/website/app/page.tsx", exists: pageExists },
  {
    route: "/kontakt",
    file: "apps/website/app/kontakt/page.tsx",
    exists: fileExists("apps/website/app/kontakt/page.tsx"),
  },
  {
    route: "/links",
    file: "apps/website/app/links/page.tsx",
    exists: fileExists("apps/website/app/links/page.tsx"),
  },
  {
    route: "/mitwirkung",
    file: "apps/website/app/mitwirkung/page.tsx",
    exists: fileExists("apps/website/app/mitwirkung/page.tsx"),
  },
  {
    route: "/impressum",
    file: "apps/website/app/impressum/page.tsx",
    exists: fileExists("apps/website/app/impressum/page.tsx"),
  },
  {
    route: "/datenschutz",
    file: "apps/website/app/datenschutz/page.tsx",
    exists: fileExists("apps/website/app/datenschutz/page.tsx"),
  },
];

// --- Auswertung ---

const missingRoutes = routeChecks.filter((c) => !c.exists);
const missingImports = sectionChecks.filter((c) => !c.imported);
const errors: string[] = [];

if (!pageExists) {
  errors.push(`[FEHLT] ${PAGE_FILE}`);
}

for (const r of missingRoutes) {
  if (r.route !== "/") {
    errors.push(`[FEHLT] Route ${r.route} → ${r.file}`);
  }
}

for (const s of missingImports) {
  errors.push(`[FEHLT] Import von ${s.section} in ${PAGE_FILE}`);
}

// --- Output ---

console.log("## Website / Routing Validation\n");

console.log("### Routen");
for (const r of routeChecks) {
  console.log(`  ${r.exists ? "✓" : "✗"} ${r.route.padEnd(14)} ${r.file}`);
}

console.log("\n### Section-Imports in app/page.tsx");
if (!pageExists) {
  console.log("  (übersprungen — page.tsx fehlt)");
} else {
  for (const s of sectionChecks) {
    console.log(`  ${s.imported ? "✓" : "✗"} ${s.section}`);
  }
}

console.log();

if (errors.length > 0) {
  for (const e of errors) {
    console.error(e);
  }
  console.error(`\nRouting validation: FAIL (${errors.length} Fehler)`);
  process.exit(1);
}

console.log("Routing validation: PASS");
process.exit(0);
