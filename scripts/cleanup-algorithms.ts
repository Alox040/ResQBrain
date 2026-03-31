import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Step = { text: string };

type LookupAlgorithm = {
  id: string;
  kind?: string;
  label?: string;
  indication?: string;
  tags?: string[];
  searchTerms?: string[];
  steps?: Step[];
  relatedMedicationIds?: string[];
  warnings?: string;
  notes?: string;
};

type SeedAlgorithm = {
  id: string;
  kind?: string;
  label?: string;
  indication?: string;
  tags?: string[];
  searchTerms?: string[];
  warnings?: string[] | string;
  steps?: unknown;
  notes?: string;
  [key: string]: unknown;
};

type Medication = {
  id: string;
  kind?: string;
  label?: string;
  searchTerms?: string[];
};

type CleanAlgorithm = {
  id: string;
  kind: "algorithm";
  label: string;
  indication: string;
  tags: string[];
  searchTerms: string[];
  steps: Step[];
  relatedMedicationIds?: string[];
  warnings?: string;
  notes?: string;
};

type Stats = {
  discardedEntries: number;
  mergedDuplicates: number;
  repairedLabels: number;
  repairedSteps: number;
  repairedTags: number;
  repairedSearchTerms: number;
  removedInvalidMedicationIds: number;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function readJson<T>(relativePath: string): T {
  const abs = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(abs, "utf-8")) as T;
}

function asciiNormalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[\u0300-\u036f]/g, "");
}

function toSlug(value: string): string {
  return asciiNormalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of values) {
    const key = v.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(key);
  }
  return result;
}

function collectTexts(input: unknown, into: string[]): void {
  if (input == null) return;
  if (typeof input === "string") {
    if (input.trim()) into.push(input);
    return;
  }
  if (Array.isArray(input)) {
    for (const item of input) collectTexts(item, into);
    return;
  }
  if (typeof input === "object") {
    for (const value of Object.values(input as Record<string, unknown>)) {
      collectTexts(value, into);
    }
  }
}

function normalizeStepsFromAny(raw: unknown): Step[] {
  const texts: string[] = [];
  collectTexts(raw, texts);

  const sentences = new Set<string>();

  for (const original of texts) {
    let value = String(original ?? "");
    if (!value.trim()) continue;

    value = value.replace(/[\r\n]+/g, " ");
    value = value.replace(/[•◆▪▶►]/g, " ");

    const parts = value.split(/[.!?]+/);
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;

      part = part.replace(/^[\d\)\(]+[\s.:;-]*/g, "");
      part = part.replace(/^[-–—]+[\s]*/g, "");

      part = part.replace(/[^0-9A-Za-zÀ-ÖØ-öø-ÿÄÖÜäöüß ,;:-]/g, " ");
      part = part.replace(/\s+/g, " ").trim();

      if (!part) continue;
      sentences.add(part);
    }
  }

  return Array.from(sentences).map((text) => ({ text }));
}

function normalizeExistingSteps(steps: Step[] | undefined | null): Step[] {
  if (!Array.isArray(steps)) return [];
  const cleaned: Step[] = [];
  const seen = new Set<string>();
  for (const s of steps) {
    const text = typeof s?.text === "string" ? s.text.trim() : "";
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push({ text });
  }
  return cleaned;
}

function inferTagsFromText(baseTags: string[] | undefined, label: string, indication: string, searchTerms: string[]): string[] {
  const haystack = asciiNormalize(`${label} ${indication} ${searchTerms.join(" ")}`);
  const tags = new Set<string>();

  // start with existing tags
  for (const t of baseTags ?? []) {
    if (!t) continue;
    tags.add(t.toLowerCase());
  }

  // fixed mapping examples
  if (haystack.includes("reanimation")) {
    tags.add("reanimation");
    tags.add("kreislauf");
  }
  if (haystack.includes("trauma")) {
    tags.add("trauma");
    tags.add("schock");
  }
  if (haystack.includes("hypoglykaemie") || haystack.includes("hypoglykaemi") || haystack.includes("unterzucker")) {
    tags.add("stoffwechsel");
    tags.add("neurologie");
  }
  if (haystack.includes("krampfanfall") || haystack.includes("krampf")) {
    tags.add("neurologie");
  }
  if (haystack.includes("anaphylaxie")) {
    tags.add("allergie");
    tags.add("atemwege");
    tags.add("kreislauf");
  }
  if (haystack.includes("intoxikation") || haystack.includes("vergiftung") || haystack.includes("intox")) {
    tags.add("toxikologie");
  }
  if (haystack.includes("bradykard") || haystack.includes("tachykard") || haystack.includes("bradykardie") || haystack.includes("tachykardie")) {
    tags.add("kreislauf");
  }
  if (haystack.includes("atemweg") || haystack.includes("obstruktion") || haystack.includes("bronchoobstruktion")) {
    tags.add("atemwege");
  }
  if (haystack.includes("schmerz") || haystack.includes("analgesie") || haystack.includes("nrs")) {
    tags.add("analgesie");
  }

  // more generic heuristics
  if (/(acs|infarkt|koronarsyndrom|hypertensiv|lungenoedem)/.test(haystack)) tags.add("kreislauf");
  if (/(asthma|copd|dyspnoe|pseudokrupp|broncho)/.test(haystack)) tags.add("atemwege");
  if (/(stroke|schlaganfall|tia|fast|be-fast)/.test(haystack)) tags.add("neurologie");
  if (/(sepsis|schock)/.test(haystack)) tags.add("schock");
  if (/(kind|paediatr|padiatr)/.test(haystack)) tags.add("kinder");

  const normalized = uniqueStrings(Array.from(tags));
  if (normalized.length === 0) {
    return ["verfahren"];
  }
  return normalized.slice(0, 5);
}

function generateSearchTerms(label: string, indication: string, tags: string[], existing: string[] | undefined): string[] {
  const terms = new Set<string>();
  const add = (v: string) => {
    const norm = asciiNormalize(v).replace(/\s+/g, " ").trim().toLowerCase();
    if (norm) terms.add(norm);
  };

  if (existing) {
    for (const t of existing) {
      if (typeof t === "string" && t.trim()) add(t);
    }
  }

  if (label.trim()) add(label);

  const slug = toSlug(label);
  if (slug) {
    add(slug);
    add(slug.replace(/-/g, " "));
  }

  if (indication.trim()) add(indication);

  for (const tag of tags) add(tag);

  // simple synonym hints
  const haystack = asciiNormalize(`${label} ${indication}`);
  if (/(reanimation|cpr|kreislaufstillstand)/.test(haystack)) {
    add("reanimation");
    add("cpr");
  }
  if (/(hypoglyk|unterzucker)/.test(haystack)) {
    add("hypoglykaemie");
    add("unterzucker");
  }
  if (/(acs|akutes koronarsyndrom|herzinfarkt|stemi|nstemi)/.test(haystack)) {
    add("acs");
    add("herzinfarkt");
  }
  if (/anaphylax/.test(haystack)) {
    add("anaphylaxie");
    add("allergischer schock");
  }
  if (/(krampfanfall|status epilepticus)/.test(haystack)) {
    add("krampfanfall");
    add("epilepsie");
  }

  return uniqueStrings(Array.from(terms));
}

const MED_SYNONYM_OVERRIDES: Record<string, string> = {
  epinephrin: "med-adrenalin",
  adrenalin: "med-adrenalin",
  acetylsalicylsaeure: "med-acetylsalicylsaeure-iv",
  ass: "med-acetylsalicylsaeure-iv",
};

function buildMedicationLookup(medications: Medication[]): {
  byId: Set<string>;
  tokenToId: Map<string, string>;
} {
  const byId = new Set<string>();
  const tokenToId = new Map<string, string>();

  for (const med of medications) {
    if (!med.id) continue;
    byId.add(med.id);

    const tokens: string[] = [];
    const idWithoutPrefix = med.id.replace(/^med-/, "");
    tokens.push(idWithoutPrefix);
    tokens.push(...idWithoutPrefix.split("-"));

    if (med.label) {
      const labelNorm = asciiNormalize(med.label);
      tokens.push(labelNorm);
      tokens.push(...labelNorm.split(/\s+/g));
    }

    for (const term of med.searchTerms ?? []) {
      const t = asciiNormalize(term);
      tokens.push(t);
      tokens.push(...t.split(/\s+/g));
    }

    for (const raw of tokens) {
      const key = raw.trim().toLowerCase();
      if (!key) continue;
      if (!tokenToId.has(key)) {
        tokenToId.set(key, med.id);
      }
    }
  }

  return { byId, tokenToId };
}

function mapMedicationId(rawId: string, lookup: { byId: Set<string>; tokenToId: Map<string, string> }): string | null {
  const trimmed = rawId.trim();
  if (!trimmed) return null;
  if (lookup.byId.has(trimmed)) return trimmed;

  const withoutPrefix = trimmed.replace(/^med-/, "");
  const norm = asciiNormalize(withoutPrefix);

  const override = MED_SYNONYM_OVERRIDES[norm];
  if (override && lookup.byId.has(override)) return override;

  if (lookup.tokenToId.has(norm)) return lookup.tokenToId.get(norm) ?? null;

  return null;
}

function normalizeWarnings(w: string | string[] | undefined | null): string | undefined {
  if (w == null) return undefined;
  if (Array.isArray(w)) {
    const joined = w.map((x) => String(x).trim()).filter(Boolean).join("\n");
    const value = joined.trim();
    return value.length > 0 ? value : undefined;
  }
  const value = String(w).trim();
  return value.length > 0 ? value : undefined;
}

function isRealDuplicate(a: CleanAlgorithm, b: CleanAlgorithm): boolean {
  if (asciiNormalize(a.label) !== asciiNormalize(b.label)) return false;
  if (asciiNormalize(a.indication) !== asciiNormalize(b.indication)) return false;

  const stepsA = a.steps.map((s) => asciiNormalize(s.text)).sort();
  const stepsB = b.steps.map((s) => asciiNormalize(s.text)).sort();
  if (stepsA.length !== stepsB.length) return false;
  for (let i = 0; i < stepsA.length; i++) {
    if (stepsA[i] !== stepsB[i]) return false;
  }

  const medsA = uniqueStrings(a.relatedMedicationIds ?? []);
  const medsB = uniqueStrings(b.relatedMedicationIds ?? []);
  if (medsA.length !== medsB.length) return false;
  for (let i = 0; i < medsA.length; i++) {
    if (medsA[i] !== medsB[i]) return false;
  }

  return true;
}

function mergeAlgorithms(base: CleanAlgorithm, incoming: CleanAlgorithm): CleanAlgorithm {
  const merged: CleanAlgorithm = {
    ...base,
    tags: uniqueStrings([...base.tags, ...incoming.tags]),
    searchTerms: uniqueStrings([...base.searchTerms, ...incoming.searchTerms]),
    steps: (() => {
      const all = [...base.steps, ...incoming.steps];
      const seen = new Set<string>();
      const out: Step[] = [];
      for (const s of all) {
        const text = s.text.trim();
        if (!text) continue;
        const key = text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ text });
      }
      return out;
    })(),
    relatedMedicationIds: (() => {
      const all = [...(base.relatedMedicationIds ?? []), ...(incoming.relatedMedicationIds ?? [])];
      return uniqueStrings(all);
    })(),
    warnings: normalizeWarnings(base.warnings ?? incoming.warnings),
    notes: (() => {
      const a = (base.notes ?? "").trim();
      const b = (incoming.notes ?? "").trim();
      if (a && b && a !== b) {
        return `${a}\n${b}`;
      }
      return a || b || undefined;
    })(),
  };

  if (!merged.relatedMedicationIds || merged.relatedMedicationIds.length === 0) {
    delete merged.relatedMedicationIds;
  }
  if (!merged.warnings) delete merged.warnings;
  if (!merged.notes) delete merged.notes;

  return merged;
}

function main(): void {
  const stats: Stats = {
    discardedEntries: 0,
    mergedDuplicates: 0,
    repairedLabels: 0,
    repairedSteps: 0,
    repairedTags: 0,
    repairedSearchTerms: 0,
    removedInvalidMedicationIds: 0,
  };

  const algorithms = readJson<LookupAlgorithm[]>("data/lookup/algorithms.json");
  const medications = readJson<Medication[]>("data/lookup/medications.json");

  let seedAlgorithms: SeedAlgorithm[] = [];
  try {
    seedAlgorithms = readJson<SeedAlgorithm[]>("data/lookup-seed/dbrd_algorithms_2026_extracted.json");
  } catch {
    seedAlgorithms = [];
  }

  const seedBySlug = new Map<string, SeedAlgorithm>();
  for (const s of seedAlgorithms) {
    const slug = toSlug(s.id || s.label || "");
    if (!slug) continue;
    if (!seedBySlug.has(slug)) {
      seedBySlug.set(slug, s);
    }
  }

  const medicationLookup = buildMedicationLookup(medications);

  const cleanedAlgorithms: CleanAlgorithm[] = [];

  for (const alg of algorithms) {
    let label = (alg.label ?? "").trim();
    const indication = (alg.indication ?? label).trim();

    if (!label) {
      const seedSlug = toSlug(alg.id.replace(/^alg-/, ""));
      const seed = seedBySlug.get(seedSlug);
      if (seed?.label && seed.label.trim()) {
        label = seed.label.trim();
        stats.repairedLabels += 1;
      }
    }

    if (!label) {
      stats.discardedEntries += 1;
      continue;
    }

    const seedSlug = toSlug(alg.id.replace(/^alg-/, ""));
    const seed = seedBySlug.get(seedSlug);

    let steps = normalizeExistingSteps(alg.steps);

    if (steps.length === 0 && seed) {
      const stepSources: unknown[] = [];
      if (seed.steps) stepSources.push(seed.steps);
      if (seed.notes) stepSources.push(seed.notes);
      if (seed.warnings) stepSources.push(seed.warnings);
      if ((seed as any).stepTexts) stepSources.push((seed as any).stepTexts);
      if ((seed as any).flow) stepSources.push((seed as any).flow);
      if ((seed as any).content) stepSources.push((seed as any).content);
      if ((seed as any).description) stepSources.push((seed as any).description);
      if ((seed as any).rawText) stepSources.push((seed as any).rawText);

      steps = normalizeStepsFromAny(stepSources);
      if (steps.length > 0) {
        stats.repairedSteps += 1;
      }
    }

    if (steps.length === 0) {
      const fallbackSource: unknown[] = [];
      if (alg.steps) fallbackSource.push(alg.steps);
      if (alg.warnings) fallbackSource.push(alg.warnings);
      if (alg.notes) fallbackSource.push(alg.notes);
      if (indication) fallbackSource.push(indication);
      steps = normalizeStepsFromAny(fallbackSource);
      if (steps.length > 0) {
        stats.repairedSteps += 1;
      }
    }

    if (steps.length === 0) {
      stats.discardedEntries += 1;
      continue;
    }

    let tags = Array.isArray(alg.tags) ? alg.tags.filter((t) => typeof t === "string" && t.trim()) : [];
    tags = inferTagsFromText(tags, label, indication, alg.searchTerms ?? []);
    if (!alg.tags || alg.tags.length === 0) {
      stats.repairedTags += 1;
    }

    let searchTerms = generateSearchTerms(label, indication, tags, alg.searchTerms);
    if (!alg.searchTerms || alg.searchTerms.length === 0) {
      stats.repairedSearchTerms += 1;
    }

    const cleanedRelMeds: string[] = [];
    for (const rawMed of alg.relatedMedicationIds ?? []) {
      if (typeof rawMed !== "string") continue;
      const mapped = mapMedicationId(rawMed, medicationLookup);
      if (mapped) {
        cleanedRelMeds.push(mapped);
      } else {
        stats.removedInvalidMedicationIds += 1;
        console.warn(`[WARN] Removed invalid relatedMedicationId '${rawMed}' from algorithm '${alg.id}'`);
      }
    }
    const relatedMedicationIds = uniqueStrings(cleanedRelMeds);

    const warnings = normalizeWarnings(alg.warnings);
    const notes = (alg.notes ?? "").trim() || undefined;

    const clean: CleanAlgorithm = {
      id: alg.id,
      kind: "algorithm",
      label,
      indication: indication || label,
      tags,
      searchTerms,
      steps,
      ...(relatedMedicationIds.length > 0 ? { relatedMedicationIds } : {}),
      ...(warnings ? { warnings } : {}),
      ...(notes ? { notes } : {}),
    };

    cleanedAlgorithms.push(clean);
  }

  const bySlug = new Map<string, CleanAlgorithm[]>();
  for (const alg of cleanedAlgorithms) {
    const slug = toSlug(alg.label);
    if (!slug) continue;
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug)!.push(alg);
  }

  const finalAlgorithms: CleanAlgorithm[] = [];

  for (const [slug, group] of bySlug.entries()) {
    const uniques: CleanAlgorithm[] = [];

    for (const alg of group) {
      let mergedIntoExisting = false;
      for (let i = 0; i < uniques.length; i++) {
        const existing = uniques[i];
        if (isRealDuplicate(existing, alg)) {
          uniques[i] = mergeAlgorithms(existing, alg);
          stats.mergedDuplicates += 1;
          mergedIntoExisting = true;
          break;
        }
      }
      if (!mergedIntoExisting) {
        uniques.push(alg);
      }
    }

    uniques.forEach((alg, index) => {
      const suffix = index === 0 ? "" : `-${index}`;
      alg.id = `alg-${slug}${suffix}`;
    });

    finalAlgorithms.push(...uniques);
  }

  const collator = new Intl.Collator("de", { sensitivity: "base", numeric: true });
  finalAlgorithms.sort((a, b) => collator.compare(a.label, b.label) || a.id.localeCompare(b.id));

  const outputPath = path.join(repoRoot, "data", "lookup", "algorithms.json");
  writeFileSync(outputPath, `${JSON.stringify(finalAlgorithms, null, 2)}\n`, "utf-8");

  const summaryLines: string[] = [];
  summaryLines.push(`Bereinigung algorithms.json abgeschlossen.`);
  summaryLines.push(`Verworfene Einträge: ${stats.discardedEntries}`);
  summaryLines.push(`Gemergte Dubletten: ${stats.mergedDuplicates}`);
  summaryLines.push(`Reparierte Labels: ${stats.repairedLabels}`);
  summaryLines.push(`Reparierte Steps: ${stats.repairedSteps}`);
  summaryLines.push(`Reparierte Tags: ${stats.repairedTags}`);
  summaryLines.push(`Reparierte SearchTerms: ${stats.repairedSearchTerms}`);
  summaryLines.push(`Entfernte invalid medication ids: ${stats.removedInvalidMedicationIds}`);

  // Also print concise JSON object for easier parsing if needed
  const statsObject = {
    discardedEntries: stats.discardedEntries,
    mergedDuplicates: stats.mergedDuplicates,
    repairedLabels: stats.repairedLabels,
    repairedSteps: stats.repairedSteps,
    repairedTags: stats.repairedTags,
    repairedSearchTerms: stats.repairedSearchTerms,
    removedInvalidMedicationIds: stats.removedInvalidMedicationIds,
  };

  console.log(summaryLines.join("\n"));
  console.log(JSON.stringify(statsObject, null, 2));
}

main();

