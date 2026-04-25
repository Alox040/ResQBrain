/**
 * Verifies the canonical offline lookup flow:
 * Embedded bundle -> initializeContentFromLookupBundle() -> content store
 * -> ensureContentStoreReady() -> feature data layer.
 *
 * Run from apps/mobile-app:
 *   node scripts/verify-lookup-flow.mjs
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, '..');
const srcRoot = join(appRoot, 'src');

function createAsyncStorageStub() {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      async getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      async setItem(key, value) {
        store.set(key, value);
      },
      async removeItem(key) {
        store.delete(key);
      },
    },
  };
}

function createLoader() {
  const moduleCache = new Map();
  const asyncStorageStub = createAsyncStorageStub();

  function resolveSpecifier(specifier, fromFile) {
    if (specifier === '@react-native-async-storage/async-storage') {
      return { kind: 'external', value: asyncStorageStub };
    }

    if (specifier.startsWith('@/')) {
      return { kind: 'file', value: resolveFile(join(srcRoot, specifier.slice(2))) };
    }

    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      return {
        kind: 'file',
        value: resolveFile(resolve(dirname(fromFile), specifier)),
      };
    }

    return { kind: 'node', value: specifier };
  }

  function resolveFile(basePath) {
    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.json`,
      join(basePath, 'index.ts'),
      join(basePath, 'index.tsx'),
      join(basePath, 'index.json'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    throw new Error(`Cannot resolve module: ${basePath}`);
  }

  function loadModule(modulePath) {
    const absolutePath = resolve(modulePath);
    if (moduleCache.has(absolutePath)) {
      return moduleCache.get(absolutePath).exports;
    }

    if (extname(absolutePath) === '.json') {
      const jsonModule = { exports: JSON.parse(readFileSync(absolutePath, 'utf8')) };
      moduleCache.set(absolutePath, jsonModule);
      return jsonModule.exports;
    }

    const source = readFileSync(absolutePath, 'utf8');
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      fileName: absolutePath,
    });

    const module = { exports: {} };
    moduleCache.set(absolutePath, module);

    const localRequire = (specifier) => {
      const resolved = resolveSpecifier(specifier, absolutePath);
      if (resolved.kind === 'external') {
        return resolved.value;
      }
      if (resolved.kind === 'node') {
        return require(resolved.value);
      }
      return loadModule(resolved.value);
    };

    const wrapper = `(function (exports, require, module, __filename, __dirname) {${transpiled.outputText}\n})`;
    const script = new vm.Script(wrapper, {
      filename: absolutePath,
      importModuleDynamically: async (specifier) => import(specifier),
    });
    const fn = script.runInThisContext();
    fn(module.exports, localRequire, module, absolutePath, dirname(absolutePath));
    return module.exports;
  }

  return {
    loadModule,
  };
}

function firstMeaningfulToken(value) {
  return value
    .split(/\s+/)
    .map((part) => part.trim())
    .find((part) => part.length >= 3);
}

async function run() {
  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    const store = await contentIndex.ensureContentStoreReady();
    assert.ok(store.manifest.bundleId);
    assert.ok(store.medications.length > 0, 'Expected medications in embedded bundle');
    assert.ok(store.algorithms.length > 0, 'Expected algorithms in embedded bundle');
  }

  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    const bundle = loader.loadModule(join(srcRoot, 'lookup/loadLookupBundle.ts')).loadEmbeddedLookupBundle();
    const initializedOnce = contentIndex.initializeContentFromLookupBundle(bundle);
    const initializedTwice = contentIndex.initializeContentFromLookupBundle(bundle);
    const ensured = await contentIndex.ensureContentStoreReady();
    assert.equal(initializedOnce, bundle);
    assert.equal(initializedTwice, bundle);
    assert.equal(ensured, bundle);
  }

  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    const listData = loader.loadModule(join(srcRoot, 'features/lookup/listData.ts'));
    await contentIndex.ensureContentStoreReady();
    const medications = await listData.loadMedicationList();
    const algorithms = await listData.loadAlgorithmList();
    assert.ok(medications.length > 0, 'Expected medication list rows after initialization');
    assert.ok(algorithms.length > 0, 'Expected algorithm list rows after initialization');
  }

  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    const detailData = loader.loadModule(join(srcRoot, 'features/lookup/detailData.ts'));
    const store = await contentIndex.ensureContentStoreReady();
    const medication = await detailData.loadMedicationDetailViewData(store.medications[0].id);
    const algorithm = await detailData.loadAlgorithmDetailViewData(store.algorithms[0].id);
    assert.equal(medication.id, store.medications[0].id);
    assert.equal(algorithm.id, store.algorithms[0].id);
  }

  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    const searchData = loader.loadModule(join(srcRoot, 'features/lookup/searchData.ts'));
    const store = await contentIndex.ensureContentStoreReady();
    const token =
      firstMeaningfulToken(store.medications[0].label) ??
      firstMeaningfulToken(store.algorithms[0].label) ??
      store.medications[0].id;
    const results = await searchData.loadLookupSearchResults(token);
    assert.ok(results.length > 0, 'Expected search results after initialization');
  }

  {
    const loader = createLoader();
    const contentIndex = loader.loadModule(join(srcRoot, 'data/contentIndex.ts'));
    let thrown = null;
    try {
      contentIndex.getContentVersionInfo();
    } catch (error) {
      thrown = error;
    }
    assert.ok(thrown, 'Expected controlled error before initialization');
    assert.equal(thrown.code, 'LOOKUP_CONTENT_STORE_NOT_READY');
  }

  console.log('[verify-lookup-flow] OK - canonical lookup flow works offline');
}

await run();
