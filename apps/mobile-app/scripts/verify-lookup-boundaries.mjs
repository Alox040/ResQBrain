/**
 * Verifies lookup import boundaries:
 * - feature data layer does not import HTTP/API clients
 * - UI screens do not import seeds or bundle loaders directly
 *
 * Run from apps/mobile-app:
 *   node scripts/verify-lookup-boundaries.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, '../src');

function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, acc);
      continue;
    }
    if (entry.isFile() && ['.ts', '.tsx'].includes(extname(entry.name))) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function read(filePath) {
  return readFileSync(filePath, 'utf8');
}

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

function findImports(source) {
  const specifiers = [];
  const importRe = /\bimport\s+(?:type\s+)?(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(source)) !== null) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

const featureDataLayerFiles = [
  join(srcRoot, 'features/lookup/listData.ts'),
  join(srcRoot, 'features/lookup/detailData.ts'),
  join(srcRoot, 'features/lookup/searchData.ts'),
  join(srcRoot, 'data/adapters/resolveContentViewModel.ts'),
  join(srcRoot, 'features/lookup/adapters/MedicationListAdapter.tsx'),
];

const forbiddenFeatureImports = [
  '@/lib/lookup-api',
  '@/lookup/fetchRemoteManifest',
  '@/lookup/sourceResolver',
  '@/lookup/bundleUpdateService',
  '@/lookup/LookupBundleUpdateService',
];

const uiFiles = [
  ...collectFiles(join(srcRoot, 'screens')),
  ...collectFiles(join(srcRoot, 'ui/screens')),
];

const forbiddenUiImports = [
  'lookup-seed/',
  '@/lookup/loadLookupBundle',
  '@/lookup/sourceResolver',
  '@/lookup/fetchRemoteManifest',
  '/manifest.json',
  '/medications.json',
  '/algorithms.json',
];

const violations = [];

for (const filePath of featureDataLayerFiles) {
  const imports = findImports(read(filePath));
  for (const specifier of imports) {
    if (forbiddenFeatureImports.some((prefix) => specifier.startsWith(prefix))) {
      violations.push({
        filePath,
        type: 'feature-data-layer',
        specifier,
      });
    }
  }
}

for (const filePath of uiFiles) {
  const imports = findImports(read(filePath));
  for (const specifier of imports) {
    if (forbiddenUiImports.some((needle) => specifier.includes(needle))) {
      violations.push({
        filePath,
        type: 'ui-screen',
        specifier,
      });
    }
  }
}

if (violations.length > 0) {
  console.error('[verify-lookup-boundaries] Import boundary violations found:');
  for (const violation of violations) {
    console.error(
      `  ${toPosix(violation.filePath)} [${violation.type}] -> ${violation.specifier}`,
    );
  }
  process.exit(1);
}

console.log('[verify-lookup-boundaries] OK - lookup boundaries are clean');
