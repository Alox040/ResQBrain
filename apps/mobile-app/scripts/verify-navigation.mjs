/**
 * Ensures registered navigator screens match TypeScript param lists.
 * Run from apps/mobile-app: node scripts/verify-navigation.mjs
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appNavPath = join(__dirname, '../src/navigation/AppNavigator.tsx');
const homeStackPath = join(__dirname, '../src/navigation/homeStackParamList.ts');

function read(p) {
  return readFileSync(p, 'utf8');
}

/** Top-level keys inside a TS type body (handles nested `{ ... }`). */
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

function extractJsxScreenNames(source, componentPrefix, screenSuffix = 'Screen') {
  const re = new RegExp(
    `<${componentPrefix}\\.${screenSuffix}[\\s\\S]*?name="([^"]+)"`,
    'g',
  );
  return [...source.matchAll(re)].map((m) => m[1]);
}

function sliceFunctionBlock(source, functionName) {
  const sig = `function ${functionName}`;
  const start = source.indexOf(sig);
  if (start === -1) {
    throw new Error(`Expected ${sig} in AppNavigator.tsx`);
  }
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  let i = braceStart;
  for (; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(braceStart + 1, i);
    }
  }
  throw new Error(`Unclosed ${functionName}`);
}

function sortUnique(arr) {
  return [...new Set(arr)].sort();
}

function assertSetEqual(label, actual, expected) {
  const a = new Set(actual);
  const e = new Set(expected);
  const missing = [...e].filter((x) => !a.has(x));
  const extra = [...a].filter((x) => !e.has(x));
  if (missing.length === 0 && extra.length === 0) return;
  console.error(`[verify-navigation] ${label} mismatch`);
  if (missing.length) console.error('  Missing in JSX (expected from types):', missing.join(', '));
  if (extra.length) console.error('  Extra in JSX (not in types):', extra.join(', '));
  process.exit(1);
}

const appNav = read(appNavPath);
const homeFile = read(homeStackPath);

const tabBlock = /<Tab\.Navigator[\s\S]*?<\/Tab\.Navigator>/m.exec(appNav)?.[0];
if (!tabBlock) {
  console.error('[verify-navigation] Could not find <Tab.Navigator> block');
  process.exit(1);
}

const tabJsxNames = [...tabBlock.matchAll(/<Tab\.Screen[\s\S]*?name="([^"]+)"/g)].map(
  (m) => m[1],
);

const rootInner = sliceTypeDefinition(appNav, 'RootTabParamList');
if (!rootInner) {
  console.error('[verify-navigation] RootTabParamList not found');
  process.exit(1);
}
const rootTypeKeys = topLevelKeysFromTsBlock(rootInner);

assertSetEqual('Tab screens', sortUnique(tabJsxNames), sortUnique(rootTypeKeys));

const homeInner = sliceTypeDefinition(homeFile, 'HomeStackParamList');
if (!homeInner) {
  console.error('[verify-navigation] HomeStackParamList not found');
  process.exit(1);
}
const homeTypeKeys = topLevelKeysFromTsBlock(homeInner);
const homeBody = sliceFunctionBlock(appNav, 'HomeStackNavigator');
const homeJsxNames = extractJsxScreenNames(homeBody, 'HomeStack');

assertSetEqual('Home stack screens', sortUnique(homeJsxNames), sortUnique(homeTypeKeys));

const medInner = sliceTypeDefinition(appNav, 'MedicationStackParamList');
const medTypeKeys = topLevelKeysFromTsBlock(medInner);
const medBody = sliceFunctionBlock(appNav, 'MedicationStackNavigator');
const medJsxNames = extractJsxScreenNames(medBody, 'MedicationStack');

assertSetEqual('Medication stack screens', sortUnique(medJsxNames), sortUnique(medTypeKeys));

const algoInner = sliceTypeDefinition(appNav, 'AlgorithmStackParamList');
const algoTypeKeys = topLevelKeysFromTsBlock(algoInner);
const algoBody = sliceFunctionBlock(appNav, 'AlgorithmStackNavigator');
const algoJsxNames = extractJsxScreenNames(algoBody, 'AlgorithmStack');

assertSetEqual('Algorithm stack screens', sortUnique(algoJsxNames), sortUnique(algoTypeKeys));

console.log('[verify-navigation] OK — tab + stack registrations match param lists');
