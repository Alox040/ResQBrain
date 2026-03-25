import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";
import { replaceMarkerSection } from "../utils/markers";
import { fileExists, readFile } from "../utils/fs";
import { join } from "node:path";

const TARGET = "README.md";
const MARKER_ID = "PROJECT_STATUS";

export function renderReadmeStatus(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const ts = new Date(ctx.snapshot.collectedAt).toLocaleString("de-DE");
  const { milestonesSummary, overallHealth, buildPassing } = evaluation;

  const healthBadge =
    overallHealth === "green"
      ? "🟢 stabil"
      : overallHealth === "yellow"
        ? "🟡 Hinweise"
        : "🔴 Probleme";

  const section = `## Projektstatus

_Zuletzt aktualisiert: ${ts}_

| | |
|---|---|
| Build | ${buildPassing ? "✓ pass" : "✗ fail"} |
| Status | ${healthBadge} |
| Meilensteine | ${milestonesSummary.done} ✓ · ${milestonesSummary.inProgress} → · ${milestonesSummary.pending} ausstehend |`;

  const targetPath = join(ctx.rootDir, TARGET);
  const existing = fileExists(targetPath) ? readFile(targetPath) : "";
  const content = replaceMarkerSection(existing, MARKER_ID, section);

  return { targetFile: TARGET, content };
}
