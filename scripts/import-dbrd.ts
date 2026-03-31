import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Step = { text: string };

type SourceAlgorithm = {
  id: string;
  kind: string;
  label: string;
  indication: string;
  tags?: string[];
  searchTerms?: string[];
  warnings?: string[];
  steps?: Step[];
  notes?: string;
  relatedMedicationIds?: string[];
  sourcePages?: number[];
};

type SourceMedication = {
  id: string;
  kind: string;
  label: string;
  section?: string;
  sourcePage?: number;
  detailsAvailable?: boolean;
  tradeNames?: string[];
  activeIngredient?: string | null;
  drugClass?: string | null;
  indications?: string[];
  contraindications?: string[];
  dosage?: string | null;
  applicationRoutes?: string[];
  searchTerms?: string[];
  notes?: string | null;
};

type TargetAlgorithm = {
  id: string;
  kind: "algorithm";
  label: string;
  indication: string;
  tags: string[];
  searchTerms: string[];
  steps: Step[];
  relatedMedicationIds: string[];
  warnings?: string;
};

type TargetMedication = {
  id: string;
  kind: "medication";
  label: string;
  indication: string;
  tags: string[];
  searchTerms: string[];
  dosage: string;
  relatedAlgorithmIds: string[];
  notes?: string;
};

const TAGS = new Set([
  "atemwege",
  "kreislauf",
  "neurologie",
  "analgesie",
  "stoffwechsel",
  "trauma",
  "toxikologie",
  "kinder",
  "gynaekologie",
  "verfahren",
]);

const STOPWORDS = new Set([
  "und",
  "oder",
  "der",
  "die",
  "das",
  "bei",
  "mit",
  "von",
  "im",
  "in",
  "zu",
  "auf",
  "nach",
  "fuer",
  "den",
  "dem",
]);

const SYNONYM_RULES: Array<{
  pattern: RegExp;
  terms: string[];
}> = [
  {
    // Opiat-/Opioidintoxikation
    pattern: /(opiat|opioid).*(intox|vergiftung)|intoxikation.*(opiat|opioid)/,
    terms: ["opiat", "opioid", "naloxon", "atemdepression", "intox"],
  },
  {
    // Hypoglykämie
    pattern: /hypoglyk|unterzucker|niedriger blutzucker/,
    terms: ["hypoglykaemie", "unterzucker", "glucose", "glukose"],
  },
  {
    // Reanimation / CPR
    pattern: /reanimation|cpr|kreislaufstillstand/,
    terms: ["reanimation", "cpr", "kreislaufstillstand"],
  },
  {
    // ACS / Herzinfarkt
    pattern: /acs|akutes koronarsyndrom|herzinfarkt|stemi|nstemi/,
    terms: ["acs", "herzinfarkt", "stemi", "nstemi"],
  },
  {
    // Anaphylaxie
    pattern: /anaphylax|allergischer schock/,
    terms: ["anaphylaxie", "allergie", "adrenalin"],
  },
  {
    // Schlaganfall
    pattern: /stroke|schlaganfall|apoplex|tia/,
    terms: ["stroke", "schlaganfall", "tia"],
  },
];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const dataDir = path.join(repoRoot, "data");

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

function normalizePrefixedId(prefix: "alg" | "med", raw: string): string {
  const withoutPrefix = raw.replace(/^(alg|med)-/, "");
  return `${prefix}-${toSlug(withoutPrefix)}`;
}

function normalizeStringArray(values: string[] | undefined): string[] {
  if (!values) return [];
  const normalized = values
    .map((value) => asciiNormalize(String(value).trim()))
    .map((value) => value.replace(/[^a-z0-9\s-]/g, " "))
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return [...new Set(normalized)].sort((a, b) => a.localeCompare(b));
}

function normalizeTag(tag: string): string {
  const t = toSlug(tag);
  if (t.startsWith("neuro")) return "neurologie";
  if (t.startsWith("gyn")) return "gynaekologie";
  if (t.startsWith("toxi")) return "toxikologie";
  return t;
}

function inferAlgorithmTags(label: string, indication: string, searchTerms: string[]): string[] {
  const haystack = asciiNormalize(`${label} ${indication} ${searchTerms.join(" ")}`);
  const tags = new Set<string>();

  // Topic-specific tags (example-driven)
  if (/(reanimation|cpr|als|bls|kreislaufstillstand)/.test(haystack)) {
    tags.add("reanimation");
    tags.add("kreislauf");
  }
  if (/(hypoglyk|hypoglykaem|hypoglykaemi|unterzucker|glucose|glukose|diabet)/.test(haystack)) {
    tags.add("stoffwechsel");
    tags.add("neurologie");
  }
  if (/(trauma|polytrauma|verletzung|blutung)/.test(haystack)) {
    tags.add("trauma");
  }
  if (/(schock|haemorrhag|hämorrhag|anaphylax|sepsis)/.test(haystack)) {
    tags.add("schock");
  }

  // Category tags
  if (/(atemweg|dyspnoe|asthma|broncho|anaphylax)/.test(haystack)) tags.add("atemwege");
  if (/(acs|infarkt|brady|tachy|arrhythm|hypertens)/.test(haystack)) tags.add("kreislauf");
  if (/(stroke|schlaganfall|tia|fast|be-fast|krampf|epilep)/.test(haystack)) tags.add("neurologie");
  if (/(analges|schmerz|sedier|sedation)/.test(haystack)) tags.add("analgesie");
  if (/(tox|vergiftung|intox|antidot)/.test(haystack)) tags.add("toxikologie");

  // If algorithm already contains canonical tags in its text, keep them.
  for (const candidate of TAGS) {
    if (haystack.includes(candidate)) tags.add(candidate);
  }

  return Array.from(tags)
    .map((t) => normalizeTag(t))
    .filter(Boolean)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 0)
    .filter((t) => t !== "alg" && t !== "med")
    .filter((t) => t !== "gyn" && t !== "toxi" && t !== "neuro")
    .filter((t, idx, arr) => arr.indexOf(t) === idx)
    .slice(0, 5);
}

function inferMedicationTags(section: string, label: string, indications: string[]): string[] {
  const source = asciiNormalize(`${section} ${label} ${indications.join(" ")}`);
  const tags = new Set<string>();

  if (/(kreislauf|antiarrhythm|thrombozyten|antikoagul|hypertens)/.test(source)) tags.add("kreislauf");
  if (/(antiobstrukt|asthma|anaphylax|epistaxis|atem)/.test(source)) tags.add("atemwege");
  if (/(antiepilept|krampf|sedativ|brady|tachy)/.test(source)) tags.add("neurologie");
  if (/(analget|narkotika|opioid|schmerz)/.test(source)) tags.add("analgesie");
  if (/(vergiftung|antidot|tox)/.test(source)) tags.add("toxikologie");
  if (/(glucose|glucagon|hypoglykaem|antipyret|stoffwechsel|fieber)/.test(source)) tags.add("stoffwechsel");
  if (/(kind|paediatr|paed)/.test(source)) tags.add("kinder");
  if (/(gynaek|geburt|tokol)/.test(source)) tags.add("gynaekologie");

  if (tags.size === 0) tags.add("verfahren");
  return [...tags].sort((a, b) => a.localeCompare(b));
}

function generateSearchTerms(parts: Array<string | string[] | null | undefined>): string[] {
  const terms = new Set<string>();
  for (const part of parts) {
    const values = Array.isArray(part) ? part : [part];
    for (const raw of values) {
      if (!raw) continue;
      const normalized = asciiNormalize(raw).replace(/[^a-z0-9\s-]/g, " ");
      const full = normalized.replace(/\s+/g, " ").trim();
      if (full.length > 2) terms.add(full);

      const tokens = full.split(" ");
      for (const token of tokens) {
        if (token.length <= 2) continue;
        if (STOPWORDS.has(token)) continue;
        terms.add(token);
      }
    }
  }

  // Synonym-Erweiterung basierend auf Gesamttext
  const haystack = asciiNormalize(
    (parts ?? [])
      .flat()
      .filter(Boolean)
      .map((v) => String(v))
      .join(" "),
  );
  for (const rule of SYNONYM_RULES) {
    if (rule.pattern.test(haystack)) {
      for (const t of rule.terms) {
        terms.add(asciiNormalize(t));
      }
    }
  }

  const list = [...terms]
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length > 1);

  return list.sort((a, b) => a.localeCompare(b));
}

function cleanDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    const arr = input
      .map((item) => cleanDeep(item))
      .filter((item) => {
        if (item === null || item === undefined) return false;
        if (typeof item === "string") return item.trim().length > 0;
        if (Array.isArray(item)) return item.length > 0;
        if (typeof item === "object") return Object.keys(item as object).length > 0;
        return true;
      });
    return arr as T;
  }

  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const cleaned = cleanDeep(value);
      if (cleaned === null || cleaned === undefined) continue;
      if (typeof cleaned === "string" && cleaned.trim().length === 0) continue;
      if (Array.isArray(cleaned) && cleaned.length === 0) continue;
      if (typeof cleaned === "object" && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0) continue;
      out[key] = cleaned;
    }
    return out as T;
  }

  return input;
}

function collectTexts(input: unknown, into: string[]): void {
  if (input == null) return;
  if (typeof input === "string") {
    into.push(input);
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

function normalizeSteps(raw: unknown): Step[] {
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

function readJsonFile<T>(absolutePath: string): T {
  const raw = readFileSync(absolutePath, "utf-8");
  return JSON.parse(raw) as T;
}

function resolveInputPath(fileName: string): string {
  const candidates = [
    path.join(dataDir, "import", fileName),
    path.join(dataDir, "lookup-seed", fileName),
  ];

  for (const candidate of candidates) {
    try {
      readFileSync(candidate, "utf-8");
      return candidate;
    } catch {
      // try next candidate
    }
  }

  throw new Error(`Input file not found: ${fileName}`);
}

function transformAlgorithms(source: SourceAlgorithm[]): TargetAlgorithm[] {
  const mapped = source.map<TargetAlgorithm>((item) => {
    const warnings = (item.warnings ?? []).map((w) => String(w).trim()).filter(Boolean).join("\n");
    const searchTerms = generateSearchTerms([item.searchTerms ?? [], item.label ?? "", item.indication ?? ""]);
    const tags = inferAlgorithmTags(String(item.label ?? ""), String(item.indication ?? ""), searchTerms);

    const algorithm: TargetAlgorithm = {
      id: normalizePrefixedId("alg", item.id),
      kind: "algorithm",
      label: String(item.label ?? "").trim(),
      indication: String(item.indication ?? "").trim(),
      tags,
      searchTerms,
      steps: normalizeSteps(item.steps ?? []),
      relatedMedicationIds: (item.relatedMedicationIds ?? [])
        .map((id) => normalizePrefixedId("med", id))
        .sort((a, b) => a.localeCompare(b)),
      warnings,
    };

    return cleanDeep(algorithm);
  });

  const collator = new Intl.Collator("de", { sensitivity: "base", numeric: true });
  return mapped.sort((a, b) => collator.compare(a.label, b.label) || a.id.localeCompare(b.id));
}

function transformMedications(source: SourceMedication[], algorithms: TargetAlgorithm[]): TargetMedication[] {
  const medicationToAlgorithms = new Map<string, Set<string>>();
  for (const alg of algorithms) {
    for (const medId of alg.relatedMedicationIds ?? []) {
      if (!medicationToAlgorithms.has(medId)) medicationToAlgorithms.set(medId, new Set<string>());
      medicationToAlgorithms.get(medId)?.add(alg.id);
    }
  }

  const mapped = source.map<TargetMedication>((item) => {
    const medId = normalizePrefixedId("med", item.id);
    const indication = (item.indications ?? []).map((x) => String(x).trim()).filter(Boolean).join("; ");
    const dosage = String(item.dosage ?? "").trim() || "Keine Details extrahiert";
    const relatedAlgorithmIds = [...(medicationToAlgorithms.get(medId) ?? new Set<string>())].sort((a, b) =>
      a.localeCompare(b),
    );

    const medication: TargetMedication = {
      id: medId,
      kind: "medication",
      label: String(item.label ?? "").trim(),
      indication: indication || "Keine Details extrahiert",
      tags: inferMedicationTags(item.section ?? "", item.label ?? "", item.indications ?? []),
      searchTerms: generateSearchTerms([
        item.searchTerms ?? [],
        item.label ?? "",
        item.activeIngredient ?? "",
        item.tradeNames ?? [],
        item.section ?? "",
      ]),
      dosage,
      relatedAlgorithmIds,
      notes: String(item.notes ?? "").trim(),
    };

    return cleanDeep(medication);
  });

  return mapped.sort((a, b) => a.id.localeCompare(b.id));
}

function writeJsonFile(absolutePath: string, value: unknown): void {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(absolutePath, content, "utf-8");
}

function warnOnMissingRelatedMedications(
  algorithms: TargetAlgorithm[],
  medications: TargetMedication[],
): void {
  const medIds = new Set(medications.map((m) => m.id));
  const warned = new Set<string>();

  for (const alg of algorithms) {
    for (const medId of alg.relatedMedicationIds ?? []) {
      if (medIds.has(medId)) continue;
      const key = `${alg.id} -> ${medId}`;
      if (warned.has(key)) continue;
      warned.add(key);
      console.warn(`[WARN] Missing related medication id: ${key}`);
    }
  }
}

function main(): void {
  const algorithmsInput = resolveInputPath("dbrd_algorithms_2026_extracted.json");
  const medicationsInput = resolveInputPath("dbrd_medications_2024_extracted.json");

  const sourceAlgorithms = readJsonFile<SourceAlgorithm[]>(algorithmsInput);
  const sourceMedications = readJsonFile<SourceMedication[]>(medicationsInput);

  const transformedAlgorithms = transformAlgorithms(sourceAlgorithms);
  const transformedMedications = transformMedications(sourceMedications, transformedAlgorithms);

  const lookupDir = path.join(dataDir, "lookup");
  mkdirSync(lookupDir, { recursive: true });

  writeJsonFile(path.join(lookupDir, "algorithms.json"), transformedAlgorithms);
  writeJsonFile(path.join(lookupDir, "medications.json"), transformedMedications);

  warnOnMissingRelatedMedications(transformedAlgorithms, transformedMedications);

  process.stdout.write(
    `Import complete: ${transformedAlgorithms.length} algorithms, ${transformedMedications.length} medications.\n`,
  );
}

main();
