import { join } from "node:path";
import { writeFile } from "../utils/fs";
import type { RenderResult } from "./types";

export function writeFiles(rootDir: string, results: RenderResult[]): void {
  for (const result of results) {
    const absolutePath = join(rootDir, result.targetFile);
    writeFile(absolutePath, result.content);
    console.log(`  wrote → ${result.targetFile}`);
  }
}
