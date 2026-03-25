import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";

const TARGET = "docs/status/build-routing-status.md";

export function renderBuildRoutingStatus(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const { buildRouting } = ctx.snapshot;
  const ts = new Date(buildRouting.collectedAt).toLocaleString("de-DE");

  const buildIcon = buildRouting.buildStatus === "pass" ? "✓" : "✗";
  const buildLabel = buildRouting.buildStatus === "pass" ? "pass" : "fail";

  const routeRows = buildRouting.routes
    .map((r) => `| \`${r.path}\` | \`${r.file}\` | ${r.status === "exists" ? "vorhanden" : "**fehlt**"} |`)
    .join("\n");

  const linkRows = buildRouting.linkSources
    .flatMap((src) =>
      src.links.length === 0
        ? [`| ${src.component} | — | — |`]
        : src.links.map(
            (l) =>
              `| ${src.component} | \`${l.href}\` | ${l.present ? "ja" : "**nein**"} |`,
          ),
    )
    .join("\n");

  const content = `# Build & Routing Status

> Automatisch generiert — ${ts}

## Build

| | |
|---|---|
| Status | ${buildIcon} ${buildLabel} |
| Tool | \`tsc --noEmit\` |

${buildRouting.buildError ? `\`\`\`\n${buildRouting.buildError}\n\`\`\`` : ""}

## Routen

| Pfad | Datei | Status |
|------|-------|--------|
${routeRows}

## Link-Quellen

| Komponente | Ziel | Link gesetzt |
|------------|------|-------------|
${linkRows}

## Bewertung

| | |
|---|---|
| Alle Routen vorhanden | ${evaluation.allRoutesPresent ? "ja" : "nein"} |
| Build gruen | ${evaluation.buildPassing ? "ja" : "nein"} |
| Fehlende Links | ${evaluation.missingLinks.length} |
| Gesamtstatus | ${evaluation.overallHealth} |
`;

  return { targetFile: TARGET, content };
}
