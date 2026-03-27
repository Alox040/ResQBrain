import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type IsolationCheck = {
  check: string;
  status: "pass" | "fail";
  hint: string;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const websiteRoot = path.join(repoRoot, "apps", "website");
const appRoot = path.join(websiteRoot, "app");

const allowedRoutes = new Set(["/", "/impressum", "/datenschutz"]);
const forbiddenRouteSegments = new Set(["docs", "packages", "scripts", "context", "domain", "admin"]);

function safeExists(...segments: string[]) {
  return existsSync(path.join(repoRoot, ...segments));
}

function routeDirs() {
  return readdirSync(appRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function appRoutes() {
  const routes = ["/"];

  for (const dir of routeDirs()) {
    routes.push(`/${dir}`);
  }

  return routes.sort();
}

const discoveredRoutes = appRoutes();
const unexpectedRoutes = discoveredRoutes.filter((route) => !allowedRoutes.has(route));
const forbiddenRoutes = discoveredRoutes.filter((route) => forbiddenRouteSegments.has(route.slice(1)));

const repoLevelVercelConfig = safeExists("vercel.json");
const appLevelVercelConfig = safeExists("apps", "website", "vercel.json");
const repoPublicDir = safeExists("public");
const websiteForbiddenPublicDirs = ["docs", "packages", "scripts", "context", "domain", ".github"]
  .filter((dir) => safeExists("apps", "website", "public", dir));

const checks: IsolationCheck[] = [
  {
    check: "Root = apps/website",
    status: appLevelVercelConfig && !repoLevelVercelConfig ? "pass" : "fail",
    hint: appLevelVercelConfig && !repoLevelVercelConfig
      ? "app-level vercel.json vorhanden; Root Directory zusaetzlich in Vercel auf apps/website setzen"
      : "app-level vercel.json fehlt oder Repo-Root vercel.json vorhanden",
  },
  {
    check: "keine repo files exposed",
    status: !repoPublicDir && websiteForbiddenPublicDirs.length === 0 ? "pass" : "fail",
    hint: !repoPublicDir && websiteForbiddenPublicDirs.length === 0
      ? "kein Repo-public und keine verbotenen Verzeichnisse unter apps/website/public"
      : `unerwartete oeffentliche Quellen: ${[repoPublicDir ? "public/" : "", ...websiteForbiddenPublicDirs.map((dir) => `apps/website/public/${dir}`)].filter(Boolean).join(", ")}`,
  },
  {
    check: "nur erlaubte routes",
    status: unexpectedRoutes.length === 0 && forbiddenRoutes.length === 0 ? "pass" : "fail",
    hint: unexpectedRoutes.length === 0 && forbiddenRoutes.length === 0
      ? discoveredRoutes.join(", ")
      : `unerwartete Routen: ${[...unexpectedRoutes, ...forbiddenRoutes].join(", ")}`,
  },
  {
    check: "keine monorepo leaks",
    status: !repoPublicDir && websiteForbiddenPublicDirs.length === 0 && forbiddenRoutes.length === 0
      ? "pass"
      : "fail",
    hint: !repoPublicDir && websiteForbiddenPublicDirs.length === 0 && forbiddenRoutes.length === 0
      ? "kein root/public, keine verbotenen Verzeichnisse unter apps/website/public, keine verbotenen Route-Segmente"
      : "root/public, verbotene Verzeichnisse unter apps/website/public oder verbotene Route-Segmente pruefen",
  },
];

const output = [
  "## Content Isolation",
  "",
  "| Check | Status | Hinweis |",
  "|------|--------|--------|",
  ...checks.map((check) => `| ${check.check} | ${check.status} | ${check.hint} |`),
].join("\n");

process.stdout.write(`${output}\n`);

if (checks.some((check) => check.status === "fail")) {
  process.exitCode = 1;
}
