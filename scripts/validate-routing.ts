import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RouteCheck = {
  route: string;
  file: string;
  status: "vorhanden" | "fehlt";
};

type SectionCheck = {
  section: string;
  file: string;
  status: "vorhanden" | "fehlt";
  required: boolean;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function fileExists(relativePath: string) {
  return existsSync(path.join(repoRoot, relativePath));
}

const routeChecks: RouteCheck[] = [
  {
    route: "/",
    file: "apps/website/app/page.tsx",
    status: fileExists("apps/website/app/page.tsx") ? "vorhanden" : "fehlt",
  },
  {
    route: "/kontakt",
    file: "apps/website/app/kontakt/page.tsx",
    status: fileExists("apps/website/app/kontakt/page.tsx") ? "vorhanden" : "fehlt",
  },
  {
    route: "/links",
    file: "apps/website/app/links/page.tsx",
    status: fileExists("apps/website/app/links/page.tsx") ? "vorhanden" : "fehlt",
  },
  {
    route: "/mitwirkung",
    file: "apps/website/app/mitwirkung/page.tsx",
    status: fileExists("apps/website/app/mitwirkung/page.tsx") ? "vorhanden" : "fehlt",
  },
  {
    route: "/impressum",
    file: "apps/website/app/impressum/page.tsx",
    status: fileExists("apps/website/app/impressum/page.tsx") ? "vorhanden" : "fehlt",
  },
  {
    route: "/datenschutz",
    file: "apps/website/app/datenschutz/page.tsx",
    status: fileExists("apps/website/app/datenschutz/page.tsx") ? "vorhanden" : "fehlt",
  },
];

const sectionsDir = "apps/website/components/sections";

const sectionChecks: SectionCheck[] = [
  {
    section: "HomeHero",
    file: `${sectionsDir}/home-hero.tsx`,
    status: fileExists(`${sectionsDir}/home-hero.tsx`) ? "vorhanden" : "fehlt",
    required: true,
  },
  {
    section: "SurveyInviteSection",
    file: `${sectionsDir}/survey-invite-section.tsx`,
    status: fileExists(`${sectionsDir}/survey-invite-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "ProblemBenefitsSection",
    file: `${sectionsDir}/problem-benefits-section.tsx`,
    status: fileExists(`${sectionsDir}/problem-benefits-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "FeaturesOverviewSection",
    file: `${sectionsDir}/features-overview-section.tsx`,
    status: fileExists(`${sectionsDir}/features-overview-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "AudiencesSection",
    file: `${sectionsDir}/audiences-section.tsx`,
    status: fileExists(`${sectionsDir}/audiences-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "PilotFeedbackSection",
    file: `${sectionsDir}/pilot-feedback-section.tsx`,
    status: fileExists(`${sectionsDir}/pilot-feedback-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "CollaborationSection",
    file: `${sectionsDir}/collaboration-section.tsx`,
    status: fileExists(`${sectionsDir}/collaboration-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
  {
    section: "FaqSection",
    file: `${sectionsDir}/faq-section.tsx`,
    status: fileExists(`${sectionsDir}/faq-section.tsx`) ? "vorhanden" : "fehlt",
    required: false,
  },
];

function renderRouteTable(rows: RouteCheck[]) {
  return [
    "### Routen-Status",
    "| Route | Datei | Status |",
    "|-------|-------|--------|",
    ...rows.map((row) => `| ${row.route} | ${row.file} | ${row.status} |`),
  ].join("\n");
}

function renderSectionTable(rows: SectionCheck[]) {
  return [
    "### Sections-Status",
    "| Section | Datei | Status | Pflicht |",
    "|---------|-------|--------|---------|",
    ...rows.map(
      (row) =>
        `| ${row.section} | ${row.file} | ${row.status} | ${row.required ? "ja" : "nein"} |`,
    ),
  ].join("\n");
}

const routeFailures = routeChecks.filter((c) => c.status === "fehlt");
const requiredSectionFailures = sectionChecks.filter(
  (c) => c.required && c.status === "fehlt",
);
const hasFailures = routeFailures.length > 0 || requiredSectionFailures.length > 0;

const output = [
  "## Website / Routing",
  "",
  renderRouteTable(routeChecks),
  "",
  renderSectionTable(sectionChecks),
  "",
  `Routing validation: ${hasFailures ? "FAIL" : "PASS"}`,
].join("\n");

process.stdout.write(`${output}\n`);

if (hasFailures) {
  process.exitCode = 1;
}
