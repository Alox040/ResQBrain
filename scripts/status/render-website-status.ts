import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type SectionKey = "Projektphase" | "Current Focus" | "Next Steps" | "Roadmap";

type ProjectPhase = {
  label: string;
  title: string;
  summary: string;
  asOf: string;
};

type WebsiteStatus = {
  generatedAt: string;
  projectPhase: ProjectPhase;
  currentFocus: string[];
  nextSteps: string[];
  roadmap: string[];
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const sourcePath = path.join(repoRoot, "docs", "status", "PROJECT_STATUS.md");
const outputPath = path.join(repoRoot, "apps", "website", "content", "status.json");

function readSection(markdown: string, heading: SectionKey) {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);

  if (start === -1) {
    throw new Error(`Missing required section: ${heading}`);
  }

  const afterMarker = start + marker.length;
  const nextHeading = markdown.indexOf("\n## ", afterMarker);
  const section = nextHeading === -1
    ? markdown.slice(afterMarker)
    : markdown.slice(afterMarker, nextHeading);

  return section.trim();
}

function parseKeyValueList(block: string) {
  return Object.fromEntries(
    block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^- ([^:]+):\s*(.+)$/);

        if (!match) {
          throw new Error(`Invalid key/value line: ${line}`);
        }

        return [match[1].trim(), match[2].trim()] as const;
      }),
  );
}

function parseBulletList(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function buildStatus(markdown: string): WebsiteStatus {
  const phaseValues = parseKeyValueList(readSection(markdown, "Projektphase"));
  const projectPhase: ProjectPhase = {
    label: phaseValues.Label ?? "",
    title: phaseValues.Titel ?? "",
    summary: phaseValues.Summary ?? "",
    asOf: phaseValues.Stand ?? "",
  };

  if (!projectPhase.label || !projectPhase.title || !projectPhase.summary || !projectPhase.asOf) {
    throw new Error("Projektphase must define Label, Titel, Summary and Stand.");
  }

  return {
    generatedAt: new Date().toISOString(),
    projectPhase,
    currentFocus: parseBulletList(readSection(markdown, "Current Focus")),
    nextSteps: parseBulletList(readSection(markdown, "Next Steps")),
    roadmap: parseBulletList(readSection(markdown, "Roadmap")),
  };
}

const markdown = readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
const status = buildStatus(markdown);

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(status, null, 2)}\n`, "utf8");

process.stdout.write(`Rendered ${path.relative(repoRoot, outputPath)} from ${path.relative(repoRoot, sourcePath)}\n`);
