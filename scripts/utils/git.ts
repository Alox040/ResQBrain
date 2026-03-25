import { exec } from "./exec";
import type { GitSnapshot } from "../status/types";

export function collectGitSnapshot(cwd: string): GitSnapshot {
  const branch = exec("git rev-parse --abbrev-ref HEAD", cwd).stdout || "unknown";
  const commitHash = exec("git rev-parse --short HEAD", cwd).stdout || "unknown";
  const commitMessage = exec("git log -1 --format=%s", cwd).stdout || "";
  const commitDate = exec("git log -1 --format=%ci", cwd).stdout || "";

  const statusLines = exec("git status --porcelain", cwd)
    .stdout.split("\n")
    .filter(Boolean);

  const untrackedFiles = statusLines
    .filter((l) => l.startsWith("??"))
    .map((l) => l.slice(3).trim());

  const modifiedFiles = statusLines
    .filter((l) => !l.startsWith("??"))
    .map((l) => l.slice(3).trim());

  return { branch, commitHash, commitMessage, commitDate, untrackedFiles, modifiedFiles };
}
