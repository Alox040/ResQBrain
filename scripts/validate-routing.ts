import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RouteCheck = {
  route: string;
  file: string;
  status: "vorhanden" | "fehlt";
};

type LinkCheck = {
  component: string;
  target: string;
  status: "gesetzt" | "fehlt";
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function fromRepo(...segments: string[]) {
  return path.join(repoRoot, ...segments);
}

function fileExists(relativePath: string) {
  return existsSync(fromRepo(relativePath));
}

function fileContains(relativePath: string, needle: string) {
  const absolutePath = fromRepo(relativePath);

  if (!existsSync(absolutePath)) {
    return false;
  }

  return readFileSync(absolutePath, "utf8").includes(needle);
}

const routeChecks: RouteCheck[] = [
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

const linkChecks: LinkCheck[] = [
  {
    component: "Footer",
    target: "/impressum",
    status: fileContains("apps/website/components/sections/FooterSection.tsx", 'href="/impressum"')
      ? "gesetzt"
      : "fehlt",
  },
  {
    component: "Footer",
    target: "/datenschutz",
    status: fileContains("apps/website/components/sections/FooterSection.tsx", 'href="/datenschutz"')
      ? "gesetzt"
      : "fehlt",
  },
  {
    component: "HeroSection",
    target: "#cta",
    status: fileContains("apps/website/components/sections/HeroSection.tsx", 'href="#cta"')
      ? "gesetzt"
      : "fehlt",
  },
  {
    component: "CTASection",
    target: "mailto:pilot@resqbrain.de",
    status: fileContains(
      "apps/website/components/sections/CTASection.tsx",
      'href="mailto:pilot@resqbrain.de"',
    )
      ? "gesetzt"
      : "fehlt",
  },
  {
    component: "SurveysSection",
    target: "#feedback",
    status:
      fileContains("apps/website/components/sections/SurveysSection.tsx", 'href="#feedback"') ||
      fileContains("apps/website/components/sections/SurveysSection.tsx", 'surveyUrl: "#feedback"')
        ? "gesetzt"
        : "fehlt",
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

function renderLinkTable(rows: LinkCheck[]) {
  return [
    "### Linkquellen",
    "| Komponente | Ziel | Status |",
    "|------------|------|--------|",
    ...rows.map((row) => `| ${row.component} | ${row.target} | ${row.status} |`),
  ].join("\n");
}

const output = [
  "## Website / Routing",
  "",
  renderRouteTable(routeChecks),
  "",
  renderLinkTable(linkChecks),
  "",
  "### Build-Status",
  "| Zeitpunkt | Ergebnis | Fehler |",
  "|-----------|----------|--------|",
  "| YYYY-MM-DD HH:mm | unbekannt | manuell nach `npm run build` oder `pnpm build` aktualisieren |",
].join("\n");

process.stdout.write(`${output}\n`);

const hasFailures = routeChecks.some((check) => check.status === "fehlt") ||
  linkChecks.some((check) => check.status === "fehlt");

if (hasFailures) {
  process.exitCode = 1;
}
