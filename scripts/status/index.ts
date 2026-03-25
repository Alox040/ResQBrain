import { resolve } from "node:path";
import { collect } from "./collect";
import { evaluate } from "./evaluate";
import { renderBuildRoutingStatus } from "./render-build-routing-status";
import { renderProjectStatus } from "./render-project-status";
import { renderReadmeStatus } from "./render-readme-status";
import { renderRedditUpdate } from "./render-reddit-update";
import { renderRoadmapStatus } from "./render-roadmap-status";
import { renderWorkSession } from "./render-work-session";
import { writeFiles } from "./write-files";
import type { PipelineContext } from "./types";

const ROOT_DIR = resolve(process.cwd());

function main(): void {
  console.log("ResQBrain status pipeline");
  console.log(`Root: ${ROOT_DIR}\n`);

  console.log("Collecting...");
  const snapshot = collect(ROOT_DIR);

  console.log("Evaluating...");
  const evaluation = evaluate(snapshot);

  const ctx: PipelineContext = { rootDir: ROOT_DIR, snapshot };

  console.log("Rendering...");
  const results = [
    renderBuildRoutingStatus(ctx, evaluation),
    renderProjectStatus(ctx, evaluation),
    renderRoadmapStatus(ctx, evaluation),
    renderWorkSession(ctx, evaluation),
    renderReadmeStatus(ctx, evaluation),
    renderRedditUpdate(ctx, evaluation),
  ];

  console.log("Writing files...");
  writeFiles(ROOT_DIR, results);

  console.log(`\nDone. Health: ${evaluation.overallHealth}`);

  if (evaluation.missingRoutes.length > 0) {
    console.warn(`Missing routes: ${evaluation.missingRoutes.join(", ")}`);
  }
  if (evaluation.missingLinks.length > 0) {
    console.warn(
      `Missing links:\n${evaluation.missingLinks.map((l) => `  ${l.component} → ${l.href}`).join("\n")}`,
    );
  }
}

main();
