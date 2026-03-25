import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";

const TARGET = "content/reddit/latest-update.md";

export function renderRedditUpdate(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const { git, milestones } = ctx.snapshot;
  const date = new Date(ctx.snapshot.collectedAt).toLocaleDateString("de-DE");

  const inProgress = milestones
    .filter((m) => m.status === "in-progress")
    .map((m) => `- ${m.label}`)
    .join("\n");

  const done = milestones
    .filter((m) => m.status === "done")
    .map((m) => `- ${m.label}`)
    .join("\n");

  // Reddit post format: plain text, no HTML
  const content = `---
date: ${date}
commit: ${git.commitHash}
---

# ResQBrain Update — ${date}

Kurzes Update zum aktuellen Stand des Projekts.

## Was gerade passiert

${inProgress || "_(nichts aktiv)_"}

## Zuletzt abgeschlossen

${done || "_(noch nichts abgeschlossen)_"}

## Naechste Schritte

_(manuell ergaenzen)_

---

Feedback und Fragen gerne hier oder per Mail an pilot@resqbrain.de.
`;

  return { targetFile: TARGET, content };
}
