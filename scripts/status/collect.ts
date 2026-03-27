import { join } from "node:path";
import { fileExists } from "../utils/fs";
import { collectGitSnapshot } from "../utils/git";
import { exec } from "../utils/exec";
import type {
  BuildRoutingSnapshot,
  ComponentLinkRecord,
  MilestoneRecord,
  ProjectStatusSnapshot,
  RouteRecord,
} from "./types";

// ─── Routes to verify ────────────────────────────────────────────────────────

const EXPECTED_ROUTES: Array<{ path: string; file: string }> = [
  {
    path: "/impressum",
    file: "apps/website/app/impressum/page.tsx",
  },
  {
    path: "/datenschutz",
    file: "apps/website/app/datenschutz/page.tsx",
  },
];

// ─── Link sources to scan ────────────────────────────────────────────────────

const LINK_SOURCES: Array<{ component: string; file: string; hrefs: string[] }> = [
  {
    component: "FooterSection",
    file: "apps/website/components/sections/FooterSection.tsx",
    hrefs: ["/impressum", "/datenschutz"],
  },
  {
    component: "CTASection",
    file: "apps/website/components/sections/CTASection.tsx",
    hrefs: ["/datenschutz"],
  },
  {
    component: "HeroSection",
    file: "apps/website/components/sections/HeroSection.tsx",
    hrefs: ["/#cta"],
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────

const MILESTONES: MilestoneRecord[] = [
  { id: "domain-baseline", label: "Domain Baseline", status: "in-progress" },
  { id: "content-lifecycle", label: "Content Lifecycle Services", status: "pending" },
  { id: "tenant-scope", label: "Organization / Tenant Scope", status: "pending" },
  { id: "api-auth", label: "API & Auth Boundaries", status: "pending" },
  { id: "website-legal", label: "Website Legal Pages", status: "done" },
  { id: "survey-integration", label: "Survey Integration Phase A", status: "in-progress" },
];

// ─── Collectors ───────────────────────────────────────────────────────────────

function collectRoutes(rootDir: string): RouteRecord[] {
  return EXPECTED_ROUTES.map(({ path, file }) => ({
    path,
    file,
    status: fileExists(join(rootDir, file)) ? "exists" : "missing",
  }));
}

function collectLinkSources(rootDir: string): ComponentLinkRecord[] {
  return LINK_SOURCES.map(({ component, file, hrefs }) => {
    let source = "";
    try {
      source = require("node:fs").readFileSync(join(rootDir, file), "utf8");
    } catch {
      // file missing — all links absent
    }

    return {
      component,
      links: hrefs.map((href) => ({
        href,
        present: source.includes(`"${href}"`) || source.includes(`'${href}'`),
      })),
    };
  });
}

function collectBuildStatus(rootDir: string): Pick<BuildRoutingSnapshot, "buildStatus" | "buildError"> {
  const result = exec("npx tsc --noEmit", join(rootDir, "apps/website"));
  if (result.exitCode === 0) {
    return { buildStatus: "pass" };
  }
  return { buildStatus: "fail", buildError: result.stderr || result.stdout };
}

// ─── Main collector ───────────────────────────────────────────────────────────

export function collect(rootDir: string): ProjectStatusSnapshot {
  const collectedAt = new Date().toISOString();

  const git = collectGitSnapshot(rootDir);
  const { buildStatus, buildError } = collectBuildStatus(rootDir);

  const buildRouting: BuildRoutingSnapshot = {
    collectedAt,
    buildStatus,
    ...(buildError ? { buildError } : {}),
    routes: collectRoutes(rootDir),
    linkSources: collectLinkSources(rootDir),
  };

  return {
    collectedAt,
    git,
    buildRouting,
    milestones: MILESTONES,
  };
}
