import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = { text: string };

type SourceAlgorithm = {
  id: string;
  kind: string;
  // Label candidates in priority order (see deriveLabel)
  label?: string;
  title?: string;
  heading?: string;
  name?: string;
  sourceTitle?: string;
  // Content fields
  indication?: string;
  description?: string;
  rawText?: string;
  tags?: string[];
  searchTerms?: string[];
  warnings?: string[];
  // Step sources in priority order (see deriveSteps)
  steps?: unknown;
  stepTexts?: string[];
  flow?: unknown;
  // Not used as step sources
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

// warnings is string[] (not a single joined string)
type TargetAlgorithm = {
  id: string;
  kind: "algorithm";
  label: string;
  indication: string;
  tags: string[];
  searchTerms: string[];
  steps: Step[];
  relatedMedicationIds: string[];
  warnings?: string[];
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

type TransformStats = {
  total: number;
  discarded: number;
  deduped: number;
  noMedicationLink: number;
  totalUnresolvedRefs: number;
  synonymMapped: number;
  prefixMatched: number;
  unresolvedBySlug: Map<string, number>;
};

type MedLinkStats = {
  synonymMapped: number;
  prefixMatched: number;
  unresolved: number;
  unresolvedSlugs: string[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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
  // Extended canonical tags
  "beatmung",
  "verbrennung",
  "geburt",
  "antiemese",
  "entscheidung",
  "organisation",
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
    pattern: /(opiat|opioid).*(intox|vergiftung)|intoxikation.*(opiat|opioid)/,
    terms: ["opiat", "opioid", "naloxon", "atemdepression", "intox"],
  },
  {
    pattern: /hypoglyk|unterzucker|niedriger blutzucker/,
    terms: ["hypoglykaemie", "unterzucker", "glucose", "glukose"],
  },
  {
    pattern: /reanimation|cpr|kreislaufstillstand/,
    terms: ["reanimation", "cpr", "kreislaufstillstand"],
  },
  {
    pattern: /acs|akutes koronarsyndrom|herzinfarkt|stemi|nstemi/,
    terms: ["acs", "herzinfarkt", "stemi", "nstemi"],
  },
  {
    pattern: /anaphylax|allergischer schock/,
    terms: ["anaphylaxie", "allergie", "adrenalin"],
  },
  {
    pattern: /stroke|schlaganfall|apoplex|tia/,
    terms: ["stroke", "schlaganfall", "tia"],
  },
];

// ---------------------------------------------------------------------------
// Medication synonym map: raw slug (from source algorithm data) → canonical
// base slug used in the medication lookup.
//
// Direction: what the algorithm source uses → what the lookup file contains.
// Prefix matching runs after synonym resolution, so a canonical base slug
// like "acetylsalicylsaeure" will still match "med-acetylsalicylsaeure-iv".
//
// ID prefix strategy:
//   algorithms → "alg-" prefix  (normalizePrefixedId("alg", rawId))
//   medications → "med-" prefix (normalizePrefixedId("med", rawId))
// Change the prefix string in normalizePrefixedId() calls to adapt globally.
// ---------------------------------------------------------------------------
const MED_SYNONYMS: Record<string, string> = {
  // Abbreviations / shorthand used in algorithm source data
  "ass":        "acetylsalicylsaeure",  // → med-acetylsalicylsaeure-{iv,po}
  "atropin":    "atropinsulfat",         // → med-atropinsulfat
  // Numeric-suffix variants → canonical base (prefix match finds specific entry)
  "nacl-0-9":   "nacl-09-prozent",       // → med-nacl-09-prozent
  "glucose-20": "glucose",               // → med-glucose
  "glucose-5":  "glucose",               // → med-glucose
  // Cross-language / alternate nomenclature
  "epinephrin": "adrenalin",
  "adrenaline": "adrenalin",
  "glukose":    "glucose",
  "naloxone":   "naloxon",
};

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const dataDir = path.join(repoRoot, "data");

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tag inference
//
// Pattern → Tags mapping:
//   reanimation|cpr|als|bls|kreislaufstillstand       → reanimation, kreislauf
//   hypoglyk|unterzucker|glucose|diabet               → stoffwechsel, neurologie
//   trauma|polytrauma|verletzung|blutung              → trauma
//   schock|haemorrhag|anaphylax|sepsis                → schock
//   atemweg|dyspnoe|asthma|broncho|anaphylax          → atemwege
//   acs|infarkt|brady|tachy|arrhythm|hypertens        → kreislauf
//   stroke|schlaganfall|tia|krampf|epilep             → neurologie
//   analges|schmerz|sedier|sedation                   → analgesie
//   tox|vergiftung|intox|antidot                      → toxikologie
//   --- extended ---
//   vorhofflimmern|kardioversion|schrittmacher|kardial|lungenoedem  → kreislauf
//   niv|fremdkoerper|krupp|pneumothorax|nasenbluten|epistaxis        → atemwege
//   niv|beatmung|ventilation|respiratorisch|heimbeatmeter           → beatmung
//   zugang|katheter|punktion|beckenschlinge|kardioversion|applikation → verfahren
//   verbrennung|verbruehung                                          → trauma, verbrennung
//   geburt|neugeboren|schwanger|tokol                               → gynaekologie, geburt
//   kind|paediat|neugeboren|saeugling|kleinkind                     → kinder
//   erbrechen|antiemetik|uebelkeit|brechreiz                        → antiemese
//   befoerderung|notarzt|entscheidungsfindung|triage|schockraum      → entscheidung, organisation
//   addison|nebennieren                                              → stoffwechsel
//   erregungszustand|agitation|delir|psychomotorisch                → neurologie
//   [fallback when no pattern matches]                               → verfahren
// ---------------------------------------------------------------------------

function inferAlgorithmTags(label: string, indication: string, searchTerms: string[]): string[] {
  const haystack = asciiNormalize(`${label} ${indication} ${searchTerms.join(" ")}`);
  const tags = new Set<string>();

  // Existing patterns (unchanged)
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
  if (/(atemweg|dyspnoe|asthma|broncho|anaphylax)/.test(haystack)) tags.add("atemwege");
  if (/(acs|infarkt|brady|tachy|arrhythm|hypertens)/.test(haystack)) tags.add("kreislauf");
  if (/(stroke|schlaganfall|tia|fast|be-fast|krampf|epilep)/.test(haystack)) tags.add("neurologie");
  if (/(analges|schmerz|sedier|sedation)/.test(haystack)) tags.add("analgesie");
  if (/(tox|vergiftung|intox|antidot)/.test(haystack)) tags.add("toxikologie");

  // Kreislauf extended: cardiac rhythm interventions, pulmonary oedema
  if (/(vorhofflimmern|vhf|kardioversion|schrittmacher|kardial|lungenoedem|herzinsuffizienz)/.test(haystack)) {
    tags.add("kreislauf");
  }

  // Atemwege extended: airway procedures, obstruction, croup, nosebleed, pneumothorax
  if (/(niv|fremdkoerper|krupp|pseudokrupp|pneumothorax|spannungspneumothorax|nasenbluten|epistaxis|tracheal|intubation)/.test(haystack)) {
    tags.add("atemwege");
  }

  // Beatmung: NIV, mechanical/home ventilation, respiratory failure
  if (/(niv|beatmung|ventilation|respiratorisch|heimbeatmeter|atemversagen)/.test(haystack)) {
    tags.add("beatmung");
  }

  // Verfahren / Procedures: vascular access, drainage, immobilisation, monitoring, medication application
  if (/(zugang|katheter|punktion|entlastungspunktion|beckenschlinge|immobilisation|kardioversion|schrittmacher|defibrillation|applikation|medikament)/.test(haystack)) {
    tags.add("verfahren");
  }

  // Verbrennung: burns and scalds
  if (/(verbrennung|verbruehung|brandverletzung)/.test(haystack)) {
    tags.add("trauma");
    tags.add("verbrennung");
  }

  // Geburt / Gynäkologie
  if (/(geburt|schwanger|partus|geburtshilf|praeeklampsie|eklampsi|tocol|neugeboren)/.test(haystack)) {
    tags.add("gynaekologie");
    tags.add("geburt");
  }

  // Kinder / Pädiatrie
  if (/(kind|paediat|neugeboren|saeugling|kleinkind)/.test(haystack)) {
    tags.add("kinder");
  }

  // Übelkeit / Erbrechen / Antiemese
  if (/(erbrechen|antiemetik|antiemetikum|uebelkeit|brechreiz)/.test(haystack)) {
    tags.add("antiemese");
  }

  // Organisatorisch / Entscheidungsalgorithmen
  if (/(befoerderung|notarztindikation|notarztentscheidung|notarzt|schockraumindikation|triage|entscheidungsfindung|befoerderungsverzicht)/.test(haystack)) {
    tags.add("entscheidung");
    tags.add("organisation");
  }

  // Stoffwechsel extended: adrenal crisis
  if (/(addison|nebennieren|nebenniereninsuffizienz|kortisolmangel)/.test(haystack)) {
    tags.add("stoffwechsel");
  }

  // Neurologie extended: agitation, excitation states
  if (/(erregungszustand|agitation|psychomotorisch|delir)/.test(haystack)) {
    tags.add("neurologie");
  }

  // Secondary catch-all: any canonical tag literally present in haystack
  for (const candidate of TAGS) {
    if (haystack.includes(candidate)) tags.add(candidate);
  }

  const result = Array.from(tags)
    .map((t) => normalizeTag(t))
    .filter(Boolean)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 0)
    .filter((t) => t !== "alg" && t !== "med")
    .filter((t) => t !== "gyn" && t !== "toxi" && t !== "neuro")
    .filter((t, idx, arr) => arr.indexOf(t) === idx)
    .slice(0, 5);

  // Fallback: never return an empty tags array
  return result.length > 0 ? result : ["verfahren"];
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

// ---------------------------------------------------------------------------
// Search term generation
// ---------------------------------------------------------------------------

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

  return [...terms]
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length > 1)
    .sort((a, b) => a.localeCompare(b));
}

// ---------------------------------------------------------------------------
// Object utilities
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Step normalization
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Label derivation
// Extract label from explicit label fields only.
// indication is used as last fallback only when short and title-like.
// ---------------------------------------------------------------------------

function deriveLabel(raw: SourceAlgorithm): string {
  const candidates: Array<string | undefined> = [
    raw.label,
    raw.title,
    raw.heading,
    raw.name,
    raw.sourceTitle,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }

  // Last fallback: indication only if short, title-like, and without sentence structure
  if (typeof raw.indication === "string") {
    const ind = raw.indication.trim();
    const wordCount = ind.split(/\s+/).length;
    const isTitleLike =
      ind.length > 0 &&
      ind.length <= 80 &&
      wordCount <= 8 &&
      !/[.!?;]/.test(ind) &&
      !/\s{2,}/.test(ind);
    if (isTitleLike) return ind;
  }

  return "";
}

// ---------------------------------------------------------------------------
// Step derivation
// Primary: steps, stepTexts, flow.
// Fallback: description, rawText.
// Never: notes, indication (to avoid pseudo-steps from metadata text).
// ---------------------------------------------------------------------------

function deriveSteps(raw: SourceAlgorithm): Step[] {
  const primary: unknown[] = [];

  if (raw.steps !== undefined && raw.steps !== null) {
    primary.push(raw.steps);
  }
  if (Array.isArray(raw.stepTexts) && raw.stepTexts.length > 0) {
    primary.push(raw.stepTexts);
  }
  if (raw.flow !== undefined && raw.flow !== null) {
    primary.push(raw.flow);
  }

  if (primary.length > 0) {
    return normalizeSteps(primary);
  }

  // Fallback: description or rawText only
  const fallback: unknown[] = [];
  if (typeof raw.description === "string" && raw.description.trim()) {
    fallback.push(raw.description);
  }
  if (typeof raw.rawText === "string" && raw.rawText.trim()) {
    fallback.push(raw.rawText);
  }

  return fallback.length > 0 ? normalizeSteps(fallback) : [];
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

function readJsonFile<T>(absolutePath: string): T {
  const raw = readFileSync(absolutePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJsonFile(absolutePath: string, value: unknown): void {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(absolutePath, content, "utf-8");
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

// ---------------------------------------------------------------------------
// Medication ID resolution
//
// Strategy per raw medication reference:
//   1. Exact match:     "med-{slug}" exists in known IDs
//   2. Prefix match:    a known ID starts with "med-{slug}-"
//   3. Synonym match:   MED_SYNONYMS[slug] → canonical slug → repeat 1+2
//   If all fail: keep "med-{slug}" as-is and count as unresolved.
// ---------------------------------------------------------------------------

function loadKnownMedicationIds(): Set<string> {
  const lookupPath = path.join(dataDir, "lookup", "medications.json");

  if (existsSync(lookupPath)) {
    try {
      const meds = readJsonFile<Array<{ id: string }>>(lookupPath);
      if (Array.isArray(meds) && meds.length > 0) {
        const ids = new Set(meds.map((m) => String(m.id)).filter(Boolean));
        console.log(`[INFO] Loaded ${ids.size} known medication IDs from data/lookup/medications.json`);
        return ids;
      }
    } catch {
      console.warn("[WARN] Could not parse data/lookup/medications.json — falling back to source file.");
    }
  }

  // Fallback: derive from raw source file
  try {
    const rawPath = resolveInputPath("dbrd_medications_2024_extracted.json");
    const meds = readJsonFile<SourceMedication[]>(rawPath);
    if (Array.isArray(meds) && meds.length > 0) {
      const ids = new Set(meds.map((m) => normalizePrefixedId("med", m.id)));
      console.log(`[INFO] Derived ${ids.size} known medication IDs from source file (lookup/medications.json not found).`);
      return ids;
    }
  } catch {
    // ignore
  }

  console.warn("[WARN] Could not load any medication reference — medication linking will be skipped.");
  return new Set();
}

function resolveOneMedId(
  slug: string,
  knownIds: Set<string>,
  stats: MedLinkStats,
): string {
  const directId = `med-${slug}`;

  // 1. Exact match
  if (knownIds.has(directId)) return directId;

  // 2. Direct prefix match (e.g. "adrenalin" → "med-adrenalin-fertigspritze")
  const prefixMatches: string[] = [];
  for (const id of knownIds) {
    if (id.startsWith(`${directId}-`)) prefixMatches.push(id);
  }
  if (prefixMatches.length > 0) {
    prefixMatches.sort();
    if (prefixMatches.length > 1) {
      console.warn(
        `[WARN] Multiple prefix matches for "${slug}" — using "${prefixMatches[0]}" (also matched: ${prefixMatches.slice(1).join(", ")})`,
      );
    }
    stats.prefixMatched++;
    return prefixMatches[0];
  }

  // 3. Synonym match (exact, then prefix on canonical base)
  const canonical = MED_SYNONYMS[slug];
  if (canonical) {
    const canonicalId = `med-${canonical}`;

    if (knownIds.has(canonicalId)) {
      stats.synonymMapped++;
      return canonicalId;
    }

    const synonymPrefixMatches: string[] = [];
    for (const id of knownIds) {
      if (id.startsWith(`${canonicalId}-`)) synonymPrefixMatches.push(id);
    }
    if (synonymPrefixMatches.length > 0) {
      synonymPrefixMatches.sort();
      if (synonymPrefixMatches.length > 1) {
        console.warn(
          `[WARN] Multiple synonym-prefix matches for "${slug}" → "${canonical}" — using "${synonymPrefixMatches[0]}" (also matched: ${synonymPrefixMatches.slice(1).join(", ")})`,
        );
      }
      stats.synonymMapped++;
      stats.prefixMatched++;
      return synonymPrefixMatches[0];
    }

    // Synonym applied but canonical not found in known IDs — genuinely missing
    stats.synonymMapped++;
    stats.unresolved++;
    stats.unresolvedSlugs.push(slug);
    return canonicalId;
  }

  // No match — genuinely missing, keep direct ID as-is
  stats.unresolved++;
  stats.unresolvedSlugs.push(slug);
  return directId;
}

function mapMedicationIds(
  rawIds: string[],
  knownIds: Set<string>,
  stats: MedLinkStats,
): string[] {
  const result = new Set<string>();

  for (const rawId of rawIds) {
    const slug = toSlug(asciiNormalize(String(rawId).trim().replace(/^med-/, "")));
    if (!slug) continue;
    result.add(resolveOneMedId(slug, knownIds, stats));
  }

  return [...result].sort((a, b) => a.localeCompare(b));
}

// ---------------------------------------------------------------------------
// Transform: algorithms
// ---------------------------------------------------------------------------

function transformAlgorithms(
  source: SourceAlgorithm[],
  knownMedIds: Set<string>,
): { algorithms: TargetAlgorithm[]; stats: TransformStats } {
  const stats: TransformStats = {
    total: source.length,
    discarded: 0,
    deduped: 0,
    noMedicationLink: 0,
    totalUnresolvedRefs: 0,
    synonymMapped: 0,
    prefixMatched: 0,
    unresolvedBySlug: new Map(),
  };

  const seenIds = new Set<string>();
  const mapped: TargetAlgorithm[] = [];

  for (const item of source) {
    const label = deriveLabel(item);

    if (!label) {
      stats.discarded++;
      console.warn(`[WARN] Discarded algorithm (no derivable label): id=${String(item.id ?? "(missing)")}`);
      continue;
    }

    const id = normalizePrefixedId("alg", item.id);

    if (seenIds.has(id)) {
      stats.deduped++;
      console.warn(`[WARN] Deduped algorithm (duplicate ID): ${id}`);
      continue;
    }
    seenIds.add(id);

    const medLinkStats: MedLinkStats = { synonymMapped: 0, prefixMatched: 0, unresolved: 0, unresolvedSlugs: [] };
    const relatedMedicationIds = mapMedicationIds(
      item.relatedMedicationIds ?? [],
      knownMedIds,
      medLinkStats,
    );

    stats.synonymMapped += medLinkStats.synonymMapped;
    stats.prefixMatched += medLinkStats.prefixMatched;
    stats.totalUnresolvedRefs += medLinkStats.unresolved;
    if (medLinkStats.unresolved > 0) stats.noMedicationLink++;
    for (const s of medLinkStats.unresolvedSlugs) {
      stats.unresolvedBySlug.set(s, (stats.unresolvedBySlug.get(s) ?? 0) + 1);
    }

    const warnings = (item.warnings ?? []).map((w) => String(w).trim()).filter(Boolean);
    const indication = String(item.indication ?? "").trim();
    const searchTerms = generateSearchTerms([item.searchTerms ?? [], label, indication]);
    const tags = inferAlgorithmTags(label, indication, searchTerms);

    const algorithm: TargetAlgorithm = {
      id,
      kind: "algorithm",
      label,
      indication,
      tags,
      searchTerms,
      steps: deriveSteps(item),
      relatedMedicationIds,
      ...(warnings.length > 0 ? { warnings } : {}),
    };

    mapped.push(cleanDeep(algorithm));
  }

  const collator = new Intl.Collator("de", { sensitivity: "base", numeric: true });
  const sorted = mapped.sort((a, b) => collator.compare(a.label, b.label) || a.id.localeCompare(b.id));

  return { algorithms: sorted, stats };
}

// ---------------------------------------------------------------------------
// Transform: medications
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Post-transform validation
// ---------------------------------------------------------------------------

function warnOnUnresolvedMedRefs(algorithms: TargetAlgorithm[], medications: TargetMedication[]): void {
  const medIds = new Set(medications.map((m) => m.id));
  const unresolvedOutputIds = new Set<string>();

  for (const alg of algorithms) {
    for (const medId of alg.relatedMedicationIds ?? []) {
      if (!medIds.has(medId)) unresolvedOutputIds.add(medId);
    }
  }

  for (const medId of [...unresolvedOutputIds].sort()) {
    console.warn(`[WARN] Medication ID not in final lookup: ${medId}`);
  }
}

// ---------------------------------------------------------------------------
// Stats logging
// ---------------------------------------------------------------------------

function printStats(algStats: TransformStats, algCount: number, medCount: number): void {
  process.stdout.write(`\n[INFO] Transform complete: ${algCount} algorithms, ${medCount} medications.\n`);
  process.stdout.write(`[INFO]   Input records:                          ${algStats.total}\n`);
  if (algStats.discarded > 0) {
    process.stdout.write(`[WARN]   Discarded (no derivable label):         ${algStats.discarded}\n`);
  }
  if (algStats.deduped > 0) {
    process.stdout.write(`[WARN]   Deduped (duplicate ID):                 ${algStats.deduped}\n`);
  }
  process.stdout.write(`[INFO]   Medication refs via synonym:             ${algStats.synonymMapped}\n`);
  process.stdout.write(`[INFO]   Medication refs via prefix match:        ${algStats.prefixMatched}\n`);
  if (algStats.totalUnresolvedRefs > 0) {
    process.stdout.write(`[WARN]   Total unresolved medication refs:        ${algStats.totalUnresolvedRefs}\n`);
    process.stdout.write(`[WARN]   Algorithms with unresolved med refs:     ${algStats.noMedicationLink}\n`);
    const sorted = [...algStats.unresolvedBySlug.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    process.stdout.write(`[WARN]   Unresolved grouped by raw med ID:\n`);
    for (const [slug, count] of sorted) {
      process.stdout.write(`[WARN]     ${slug}: ${count} ref(s)\n`);
    }
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  const algorithmsInput = resolveInputPath("dbrd_algorithms_2026_extracted.json");
  const medicationsInput = resolveInputPath("dbrd_medications_2024_extracted.json");

  const sourceAlgorithms = readJsonFile<SourceAlgorithm[]>(algorithmsInput);
  const sourceMedications = readJsonFile<SourceMedication[]>(medicationsInput);

  // Load known medication IDs for linking validation.
  // Prefers data/lookup/medications.json (previous run output), falls back to source file.
  const knownMedIds = loadKnownMedicationIds();

  const { algorithms: transformedAlgorithms, stats: algStats } = transformAlgorithms(
    sourceAlgorithms,
    knownMedIds,
  );
  const transformedMedications = transformMedications(sourceMedications, transformedAlgorithms);

  const lookupDir = path.join(dataDir, "lookup");
  mkdirSync(lookupDir, { recursive: true });

  writeJsonFile(path.join(lookupDir, "algorithms.json"), transformedAlgorithms);
  writeJsonFile(path.join(lookupDir, "medications.json"), transformedMedications);

  warnOnUnresolvedMedRefs(transformedAlgorithms, transformedMedications);
  printStats(algStats, transformedAlgorithms.length, transformedMedications.length);
}

main();
