import type { EvaluationResult } from "./evaluate";
import type { PipelineContext, RenderResult } from "./types";
import { replaceMarkerSection } from "../utils/markers";
import { fileExists, readFile } from "../utils/fs";
import { join } from "node:path";

const TARGET = "docs/context/WORK_SESSION.md";
const MARKER_ID = "STATUS";

export function renderWorkSession(
  ctx: PipelineContext,
  evaluation: EvaluationResult,
): RenderResult {
  const { git, buildRouting } = ctx.snapshot;
  const ts = new Date(ctx.snapshot.collectedAt).toLocaleString("de-DE");

  const routeRows = buildRouting.routes
    .map((r) => `| \`${r.path}\` | \`${r.file}\` | ${r.status === "exists" ? "vorhanden" : "**fehlt**"} |`)
    .join("\n");

  const linkRows = buildRouting.linkSources
    .flatMap((src) =>
      src.links.length === 0
        ? []
        : src.links.map(
            (l) =>
              `| ${src.component} | \`${l.href}\` | ${l.present ? "ja" : "**nein**"} |`,
          ),
    )
    .join("\n");

  const buildIcon = buildRouting.buildStatus === "pass" ? "✓" : "✗";

  const section = `## Website / Routing

_Zuletzt aktualisiert: ${ts}_

### Build

| | |
|---|---|
| Status | ${buildIcon} ${buildRouting.buildStatus} |

### Routen

| Route | Datei | Status |
|-------|-------|--------|
${routeRows}

### Link-Quellen

| Komponente | Ziel | Link gesetzt |
|------------|------|-------------|
${linkRows}`;

  const targetPath = join(ctx.rootDir, TARGET);
  const existing = fileExists(targetPath) ? readFile(targetPath) : "";
  const content = replaceMarkerSection(existing, MARKER_ID, section);

  return { targetFile: TARGET, content };
}
