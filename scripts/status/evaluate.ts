import type { MilestoneRecord, PhaseStatus, ProjectStatusSnapshot } from "./types";

export type EvaluationResult = {
  allRoutesPresent: boolean;
  missingRoutes: string[];
  missingLinks: Array<{ component: string; href: string }>;
  buildPassing: boolean;
  milestonesSummary: {
    done: number;
    inProgress: number;
    pending: number;
  };
  overallHealth: "green" | "yellow" | "red";
};

export function evaluate(snapshot: ProjectStatusSnapshot): EvaluationResult {
  const { buildRouting, milestones } = snapshot;

  const missingRoutes = buildRouting.routes
    .filter((r) => r.status === "missing")
    .map((r) => r.path);

  const missingLinks = buildRouting.linkSources.flatMap((source) =>
    source.links
      .filter((l) => !l.present)
      .map((l) => ({ component: source.component, href: l.href })),
  );

  const buildPassing = buildRouting.buildStatus === "pass";
  const allRoutesPresent = missingRoutes.length === 0;

  const milestonesSummary = countMilestones(milestones);

  const overallHealth = deriveHealth({
    buildPassing,
    allRoutesPresent,
    missingLinksCount: missingLinks.length,
  });

  return {
    allRoutesPresent,
    missingRoutes,
    missingLinks,
    buildPassing,
    milestonesSummary,
    overallHealth,
  };
}

function countMilestones(milestones: MilestoneRecord[]): EvaluationResult["milestonesSummary"] {
  return milestones.reduce(
    (acc, m) => {
      if (m.status === "done") acc.done++;
      else if (m.status === "in-progress") acc.inProgress++;
      else acc.pending++;
      return acc;
    },
    { done: 0, inProgress: 0, pending: 0 },
  );
}

function deriveHealth(params: {
  buildPassing: boolean;
  allRoutesPresent: boolean;
  missingLinksCount: number;
}): EvaluationResult["overallHealth"] {
  if (!params.buildPassing || !params.allRoutesPresent) return "red";
  if (params.missingLinksCount > 0) return "yellow";
  return "green";
}
