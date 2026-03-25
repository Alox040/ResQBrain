import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";

const TARGET = "docs/status/roadmap-status.md";

const STATUS_LABEL: Record<string, string> = {
  done: "Abgeschlossen",
  "in-progress": "In Arbeit",
  pending: "Ausstehend",
};

export function renderRoadmapStatus(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const ts = new Date(ctx.snapshot.collectedAt).toLocaleString("de-DE");
  const { milestones } = ctx.snapshot;

  const groups = {
    done: milestones.filter((m) => m.status === "done"),
    "in-progress": milestones.filter((m) => m.status === "in-progress"),
    pending: milestones.filter((m) => m.status === "pending"),
  };

  const renderGroup = (status: keyof typeof groups): string => {
    const items = groups[status];
    if (items.length === 0) return "";
    const lines = items.map((m) => `- ${m.label}`).join("\n");
    return `### ${STATUS_LABEL[status]}\n\n${lines}`;
  };

  const content = `# Roadmap Status

> Automatisch generiert — ${ts}

${renderGroup("in-progress")}

${renderGroup("pending")}

${renderGroup("done")}
`;

  return { targetFile: TARGET, content };
}
