import { execSync } from "node:child_process";

export type ExecResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

/**
 * Runs a shell command and returns stdout, stderr, and exit code.
 * Never throws — caller decides how to handle non-zero exits.
 */
export function exec(command: string, cwd?: string): ExecResult {
  try {
    const stdout = execSync(command, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout: stdout.trim(), stderr: "", exitCode: 0 };
  } catch (error: unknown) {
    if (
      error !== null &&
      typeof error === "object" &&
      "stdout" in error &&
      "stderr" in error &&
      "status" in error
    ) {
      const e = error as { stdout: Buffer | string; stderr: Buffer | string; status: number | null };
      return {
        stdout: e.stdout?.toString().trim() ?? "",
        stderr: e.stderr?.toString().trim() ?? "",
        exitCode: e.status ?? 1,
      };
    }
    return { stdout: "", stderr: String(error), exitCode: 1 };
  }
}
