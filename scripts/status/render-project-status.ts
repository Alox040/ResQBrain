import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";

const TARGET = "docs/status/project-status.md";

const STATUS_ICON: Record<string, string> = {
  done: "✓",
  "in-progress": "→",
  pending: "·",
};

export function renderProjectStatus(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const { git, milestones } = ctx.snapshot;
  const ts = new Date(ctx.snapshot.collectedAt).toLocaleString("de-DE");

  const milestoneRows = milestones
    .map(
      (m) =>
        `| ${STATUS_ICON[m.status] ?? "?"} | ${m.label} | ${m.status} |`,
    )
    .join("\n");

  const { done, inProgress, pending } = evaluation.milestonesSummary;

  const content = `# Projektstatus

> Automatisch generiert — ${ts}

## Git

| | |
|---|---|
| Branch | \`${git.branch}\` |
| Commit | \`${git.commitHash}\` — ${git.commitMessage} |
| Datum | ${git.commitDate} |

## Gesundheit

| | |
|---|---|
| Build | ${evaluation.buildPassing ? "✓ pass" : "✗ fail"} |
| Routen | ${evaluation.allRoutesPresent ? "✓ vollstaendig" : "✗ unvollstaendig"} |
| Fehlende Links | ${evaluation.missingLinks.length} |
| Gesamtstatus | **${evaluation.overallHealth}** |

## Meilensteine

| | Meilenstein | Status |
|---|-------------|--------|
${milestoneRows}

**${done} abgeschlossen · ${inProgress} in Arbeit · ${pending} ausstehend**
`;

  return { targetFile: TARGET, content };
}
