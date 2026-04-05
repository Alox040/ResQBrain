import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceDir = path.join(repoRoot, 'data', 'lookup-seed');
const targetDir = path.join(repoRoot, 'apps', 'mobile-app', 'data', 'lookup-seed');

function runPnpmScript(scriptName) {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(command, [scriptName], {
    cwd: repoRoot,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`seed:update: failed to run ${scriptName}`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runPnpmScript('dbrd:validate-normalized');
runPnpmScript('dbrd:build');

if (!existsSync(sourceDir)) {
  console.error(`seed:update: source directory not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, {
  recursive: true,
  force: true,
});

console.log(`seed:update: copied ${sourceDir} -> ${targetDir}`);
