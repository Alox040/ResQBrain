import { spawnSync } from "node:child_process";

type Step = {
  label: string;
  cmd: string;
  args: string[];
};

const steps: Step[] = [
  {
    label: "build",
    cmd: "pnpm",
    args: ["build"],
  },
  {
    label: "validate-routing",
    cmd: "pnpm",
    args: ["exec", "tsx", "scripts/validate-routing.ts"],
  },
  {
    label: "validate-content-isolation",
    cmd: "pnpm",
    args: ["exec", "tsx", "scripts/validate-content-isolation.ts"],
  },
  {
    label: "mobile:verify",
    cmd: "pnpm",
    args: ["mobile:verify"],
  },
];

type Result = {
  label: string;
  passed: boolean;
  code: number | null;
};

const results: Result[] = [];

for (const step of steps) {
  process.stdout.write(`\n▶ ${step.label}\n`);

  const { status } = spawnSync(step.cmd, step.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  const passed = status === 0;
  results.push({ label: step.label, passed, code: status });

  if (!passed) {
    break;
  }
}

// --- Summary ---

const totalRan = results.length;
const totalExpected = steps.length;
const skipped = totalExpected - totalRan;
const failed = results.filter((r) => !r.passed);

console.log("\n## Verify Summary\n");
for (const r of results) {
  console.log(`  ${r.passed ? "✓" : "✗"} ${r.label}`);
}
if (skipped > 0) {
  for (const s of steps.slice(totalRan)) {
    console.log(`  - ${s.label}  (skipped)`);
  }
}
console.log();

if (failed.length > 0) {
  console.error(`Verify: FAIL — step "${failed[0].label}" exited with code ${failed[0].code}`);
  process.exit(1);
}

console.log("Verify: PASS");
process.exit(0);
