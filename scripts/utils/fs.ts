import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function readFile(filePath: string): string {
  return readFileSync(filePath, "utf8");
}

export function writeFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

export function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir);
}

export function resolveFromRoot(root: string, ...segments: string[]): string {
  return join(root, ...segments);
}
