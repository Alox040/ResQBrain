/**
 * Flags navigation.navigate / tabNavigation.navigate route names that are not
 * declared on any stack or tab param list.
 * Run from apps/mobile-app: node scripts/verify-nav-routes.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appNavPath = join(__dirname, '../src/navigation/AppNavigator.tsx');
const homeStackPath = join(__dirname, '../src/navigation/homeStackParamList.ts');
const srcRoot = join(__dirname, '../src');

function collectTsxFiles(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) collectTsxFiles(p, acc);
    else if (ent.isFile() && ent.name.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

function read(p) {
  return readFileSync(p, 'utf8');
}

function topLevelKeysFromTsBlock(inner) {
  let depth = 0;
  const keys = [];
  for (const line of inner.split('\n')) {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (depth === 0) {
      const km = /^\s*([A-Za-z0-9_]+):/.exec(line);
      if (km) keys.push(km[1]);
    }
    depth += opens - closes;
    if (depth < 0) depth = 0;
  }
  return keys;
}

function sliceTypeDefinition(source, typeName) {
  const marker = `export type ${typeName} = {`;
  const start = source.indexOf(marker);
  if (start === -1) return null;
  let i = start + marker.length;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    i += 1;
  }
  return source.slice(start + marker.length, i - 1);
}

function buildAllowedRouteNames() {
  const appNav = read(appNavPath);
  const homeFile = read(homeStackPath);

  const rootStackInner = sliceTypeDefinition(appNav, 'RootStackParamList');
  const rootInner = sliceTypeDefinition(appNav, 'RootTabParamList');
  const homeInner = sliceTypeDefinition(homeFile, 'HomeStackParamList');
  const medInner = sliceTypeDefinition(appNav, 'MedicationStackParamList');
  const algoInner = sliceTypeDefinition(appNav, 'AlgorithmStackParamList');

  const all = [
    ...topLevelKeysFromTsBlock(rootStackInner),
    ...topLevelKeysFromTsBlock(rootInner),
    ...topLevelKeysFromTsBlock(homeInner),
    ...topLevelKeysFromTsBlock(medInner),
    ...topLevelKeysFromTsBlock(algoInner),
  ];
  return new Set(all);
}

const allowed = buildAllowedRouteNames();

/** First argument to .navigate( */
const navigateRe = /\.navigate\(\s*['"]([A-Za-z0-9_]+)['"]/g;
/** Nested stack target: params: { screen: 'X' */
const screenParamRe = /screen:\s*['"]([A-Za-z0-9_]+)['"]/g;

let bad = [];

for (const file of collectTsxFiles(srcRoot)) {
  if (file.replace(/\\/g, '/').includes('/navigation/')) continue;
  const text = read(file);
  for (const re of [navigateRe, screenParamRe]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const name = m[1];
      if (!allowed.has(name)) {
        bad.push({ file, name, match: m[0] });
      }
    }
  }
}

if (bad.length > 0) {
  console.error('[verify-nav-routes] Unknown route names:');
  for (const b of bad) {
    console.error(`  ${b.file}: ${b.match} (not in tab/stack param lists)`);
  }
  process.exit(1);
}

console.log('[verify-nav-routes] OK — navigate targets match declared routes');
