import type { Medication, Algorithm, AlgorithmStep } from '../types/content';
import {
  type LookupManifest,
  LOOKUP_MANIFEST_KEYS,
  MEDICATION_ITEM_KEYS,
  ALGORITHM_ITEM_KEYS,
  ALGORITHM_STEP_KEYS,
  isContentTag,
  type ValidatedLookupBundle,
} from './lookupSchema';

export type LookupValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: string[] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unknownKeys(obj: Record<string, unknown>, allowed: Set<string>): string[] {
  return Object.keys(obj).filter((k) => !allowed.has(k));
}

function asNonEmptyString(value: unknown, path: string): string | string[] {
  if (typeof value !== 'string' || value.trim() === '') {
    return [`${path}: expected non-empty string`];
  }
  return value;
}

/**
 * `asNonEmptyString` liefert bei Fehler `string[]`, bei Erfolg den gültigen `string`.
 * Nur Fehler-Arrays werden gesammelt — Erfolgs-Strings nicht als Fehler eintragen.
 */
function pushValidationResult(target: string[], result: string | string[]): void {
  if (Array.isArray(result)) {
    target.push(...result);
  }
}

/**
 * Validates `manifest.json` shape — Phase 0 bundle metadata only.
 */
export function validateManifest(raw: unknown): LookupValidationResult<LookupManifest> {
  const errors: string[] = [];

  if (!isPlainObject(raw)) {
    return { ok: false, errors: ['manifest: expected object'] };
  }

  const extra = unknownKeys(raw, LOOKUP_MANIFEST_KEYS);
  if (extra.length > 0) {
    errors.push(`manifest: unknown keys: ${extra.sort().join(', ')}`);
  }

  const sv = asNonEmptyString(raw.schemaVersion, 'manifest.schemaVersion');
  const bid = asNonEmptyString(raw.bundleId, 'manifest.bundleId');
  pushValidationResult(errors, sv);
  pushValidationResult(errors, bid);

  if (raw.displayName !== undefined && typeof raw.displayName !== 'string') {
    errors.push('manifest.displayName: expected string');
  }
  if (raw.version !== undefined && typeof raw.version !== 'string') {
    errors.push('manifest.version: expected string');
  }
  if (raw.createdAt !== undefined && typeof raw.createdAt !== 'string') {
    errors.push('manifest.createdAt: expected string');
  }
  if (raw.checksum !== undefined && typeof raw.checksum !== 'string') {
    errors.push('manifest.checksum: expected string');
  }
  if (raw.locale !== undefined && typeof raw.locale !== 'string') {
    errors.push('manifest.locale: expected string');
  }
  if (raw.contentCutoffDate !== undefined && typeof raw.contentCutoffDate !== 'string') {
    errors.push('manifest.contentCutoffDate: expected string');
  }
  if (raw.generatedAt !== undefined && typeof raw.generatedAt !== 'string') {
    errors.push('manifest.generatedAt: expected string');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const manifest: LookupManifest = {
    schemaVersion: raw.schemaVersion as string,
    bundleId: raw.bundleId as string,
  };
  if (raw.displayName !== undefined) manifest.displayName = raw.displayName as string;
  if (raw.version !== undefined) manifest.version = raw.version as string;
  if (raw.createdAt !== undefined) manifest.createdAt = raw.createdAt as string;
  if (raw.checksum !== undefined) manifest.checksum = raw.checksum as string;
  if (raw.locale !== undefined) manifest.locale = raw.locale as string;
  if (raw.contentCutoffDate !== undefined) {
    manifest.contentCutoffDate = raw.contentCutoffDate as string;
  }
  if (raw.generatedAt !== undefined) manifest.generatedAt = raw.generatedAt as string;

  return { ok: true, data: manifest };
}

function validateMedicationItem(
  raw: unknown,
  index: number,
): LookupValidationResult<Medication> {
  const prefix = `medications[${index}]`;
  const errors: string[] = [];

  if (!isPlainObject(raw)) {
    return { ok: false, errors: [`${prefix}: expected object`] };
  }

  const extra = unknownKeys(raw, MEDICATION_ITEM_KEYS);
  if (extra.length > 0) {
    errors.push(`${prefix}: unknown keys: ${extra.sort().join(', ')}`);
  }

  const id = asNonEmptyString(raw.id, `${prefix}.id`);
  pushValidationResult(errors, id);

  if (raw.kind !== 'medication') {
    errors.push(`${prefix}.kind: expected "medication"`);
  }

  pushValidationResult(errors, asNonEmptyString(raw.label, `${prefix}.label`));
  pushValidationResult(errors, asNonEmptyString(raw.indication, `${prefix}.indication`));

  if (!Array.isArray(raw.tags)) {
    errors.push(`${prefix}.tags: expected array`);
  } else {
    raw.tags.forEach((t, i) => {
      if (!isContentTag(t)) {
        errors.push(`${prefix}.tags[${i}]: not a valid ContentTag`);
      }
    });
  }

  if (!Array.isArray(raw.searchTerms)) {
    errors.push(`${prefix}.searchTerms: expected array`);
  } else {
    raw.searchTerms.forEach((st, i) => {
      if (typeof st !== 'string') {
        errors.push(`${prefix}.searchTerms[${i}]: expected string`);
      }
    });
  }

  if (raw.notes !== undefined && typeof raw.notes !== 'string') {
    errors.push(`${prefix}.notes: expected string`);
  }

  pushValidationResult(errors, asNonEmptyString(raw.dosage, `${prefix}.dosage`));

  if (!Array.isArray(raw.relatedAlgorithmIds)) {
    errors.push(`${prefix}.relatedAlgorithmIds: expected array`);
  } else {
    raw.relatedAlgorithmIds.forEach((rid, i) => {
      if (typeof rid !== 'string' || rid.trim() === '') {
        errors.push(`${prefix}.relatedAlgorithmIds[${i}]: expected non-empty string`);
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const medication: Medication = {
    id: raw.id as string,
    kind: 'medication',
    label: raw.label as string,
    indication: raw.indication as string,
    tags: raw.tags as Medication['tags'],
    searchTerms: raw.searchTerms as string[],
    dosage: raw.dosage as string,
    relatedAlgorithmIds: raw.relatedAlgorithmIds as string[],
  };
  if (raw.notes !== undefined) {
    medication.notes = raw.notes as string;
  }

  return { ok: true, data: medication };
}

function validateAlgorithmStep(
  raw: unknown,
  path: string,
): LookupValidationResult<AlgorithmStep> {
  if (!isPlainObject(raw)) {
    return { ok: false, errors: [`${path}: expected object`] };
  }
  const extra = unknownKeys(raw, ALGORITHM_STEP_KEYS);
  if (extra.length > 0) {
    return {
      ok: false,
      errors: [`${path}: unknown keys: ${extra.sort().join(', ')}`],
    };
  }
  const text = asNonEmptyString(raw.text, `${path}.text`);
  if (typeof text !== 'string') {
    return { ok: false, errors: text };
  }
  return { ok: true, data: { text } };
}

function validateAlgorithmItem(
  raw: unknown,
  index: number,
): LookupValidationResult<Algorithm> {
  const prefix = `algorithms[${index}]`;
  const errors: string[] = [];

  if (!isPlainObject(raw)) {
    return { ok: false, errors: [`${prefix}: expected object`] };
  }

  const extra = unknownKeys(raw, ALGORITHM_ITEM_KEYS);
  if (extra.length > 0) {
    errors.push(`${prefix}: unknown keys: ${extra.sort().join(', ')}`);
  }

  pushValidationResult(errors, asNonEmptyString(raw.id, `${prefix}.id`));

  if (raw.kind !== 'algorithm') {
    errors.push(`${prefix}.kind: expected "algorithm"`);
  }

  pushValidationResult(errors, asNonEmptyString(raw.label, `${prefix}.label`));
  pushValidationResult(errors, asNonEmptyString(raw.indication, `${prefix}.indication`));

  if (!Array.isArray(raw.tags)) {
    errors.push(`${prefix}.tags: expected array`);
  } else {
    raw.tags.forEach((t, i) => {
      if (!isContentTag(t)) {
        errors.push(`${prefix}.tags[${i}]: not a valid ContentTag`);
      }
    });
  }

  if (!Array.isArray(raw.searchTerms)) {
    errors.push(`${prefix}.searchTerms: expected array`);
  } else {
    raw.searchTerms.forEach((st, i) => {
      if (typeof st !== 'string') {
        errors.push(`${prefix}.searchTerms[${i}]: expected string`);
      }
    });
  }

  if (raw.notes !== undefined && typeof raw.notes !== 'string') {
    errors.push(`${prefix}.notes: expected string`);
  }

  if (raw.warnings !== undefined && typeof raw.warnings !== 'string') {
    errors.push(`${prefix}.warnings: expected string`);
  }

  if (!Array.isArray(raw.steps)) {
    errors.push(`${prefix}.steps: expected array`);
  } else if (raw.steps.length === 0) {
    errors.push(`${prefix}.steps: expected at least one step`);
  } else {
    raw.steps.forEach((step, i) => {
      const stepRes = validateAlgorithmStep(step, `${prefix}.steps[${i}]`);
      if (!stepRes.ok) {
        errors.push(...stepRes.errors);
      }
    });
  }

  if (!Array.isArray(raw.relatedMedicationIds)) {
    errors.push(`${prefix}.relatedMedicationIds: expected array`);
  } else {
    raw.relatedMedicationIds.forEach((mid, i) => {
      if (typeof mid !== 'string' || mid.trim() === '') {
        errors.push(`${prefix}.relatedMedicationIds[${i}]: expected non-empty string`);
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const steps: AlgorithmStep[] = (raw.steps as unknown[]).map((s) => {
    const r = validateAlgorithmStep(s, '');
    if (!r.ok) throw new Error('unreachable');
    return r.data;
  });

  const algorithm: Algorithm = {
    id: raw.id as string,
    kind: 'algorithm',
    label: raw.label as string,
    indication: raw.indication as string,
    tags: raw.tags as Algorithm['tags'],
    searchTerms: raw.searchTerms as string[],
    steps,
    relatedMedicationIds: raw.relatedMedicationIds as string[],
  };
  if (raw.notes !== undefined) algorithm.notes = raw.notes as string;
  if (raw.warnings !== undefined) algorithm.warnings = raw.warnings as string;

  return { ok: true, data: algorithm };
}

/**
 * Validates `medications.json` — root must be an array of Phase-0 medications.
 */
export function validateMedications(raw: unknown): LookupValidationResult<Medication[]> {
  if (!Array.isArray(raw)) {
    return { ok: false, errors: ['medications: expected array'] };
  }

  const medications: Medication[] = [];
  const allErrors: string[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < raw.length; i++) {
    const item = validateMedicationItem(raw[i], i);
    if (!item.ok) {
      allErrors.push(...item.errors);
      continue;
    }
    if (seenIds.has(item.data.id)) {
      allErrors.push(`medications: duplicate id "${item.data.id}"`);
    } else {
      seenIds.add(item.data.id);
    }
    medications.push(item.data);
  }

  if (allErrors.length > 0) {
    return { ok: false, errors: allErrors };
  }

  return { ok: true, data: medications };
}

/**
 * Validates `algorithms.json` — root must be an array of Phase-0 algorithms.
 */
export function validateAlgorithms(raw: unknown): LookupValidationResult<Algorithm[]> {
  if (!Array.isArray(raw)) {
    return { ok: false, errors: ['algorithms: expected array'] };
  }

  const algorithms: Algorithm[] = [];
  const allErrors: string[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < raw.length; i++) {
    const item = validateAlgorithmItem(raw[i], i);
    if (!item.ok) {
      allErrors.push(...item.errors);
      continue;
    }
    if (seenIds.has(item.data.id)) {
      allErrors.push(`algorithms: duplicate id "${item.data.id}"`);
    } else {
      seenIds.add(item.data.id);
    }
    algorithms.push(item.data);
  }

  if (allErrors.length > 0) {
    return { ok: false, errors: allErrors };
  }

  return { ok: true, data: algorithms };
}

export type LookupBundleInput = {
  manifest: unknown;
  medications: unknown;
  algorithms: unknown;
};

/**
 * Validates manifest, medication list, and algorithm list; checks cross-references
 * and bundle-wide id uniqueness (`lookup-data-shape.md`).
 */
export function validateLookupBundle(
  input: LookupBundleInput,
): LookupValidationResult<ValidatedLookupBundle> {
  const manifestRes = validateManifest(input.manifest);
  if (!manifestRes.ok) {
    return manifestRes;
  }

  const medRes = validateMedications(input.medications);
  if (!medRes.ok) {
    return medRes;
  }

  const algRes = validateAlgorithms(input.algorithms);
  if (!algRes.ok) {
    return algRes;
  }

  const { data: manifest } = manifestRes;
  const { data: medications } = medRes;
  const { data: algorithms } = algRes;

  const medIds = new Set(medications.map((m) => m.id));
  const algIds = new Set(algorithms.map((a) => a.id));

  const crossErrors: string[] = [];

  for (const m of medications) {
    for (const aid of m.relatedAlgorithmIds) {
      if (!algIds.has(aid)) {
        crossErrors.push(
          `medications id "${m.id}": relatedAlgorithmIds references missing algorithm "${aid}"`,
        );
      }
    }
  }

  for (const a of algorithms) {
    for (const mid of a.relatedMedicationIds) {
      if (!medIds.has(mid)) {
        crossErrors.push(
          `algorithms id "${a.id}": relatedMedicationIds references missing medication "${mid}"`,
        );
      }
    }
  }

  for (const id of algIds) {
    if (medIds.has(id)) {
      crossErrors.push(
        `bundle: id "${id}" must not appear in both medications and algorithms`,
      );
    }
  }

  if (crossErrors.length > 0) {
    return { ok: false, errors: crossErrors };
  }

  return {
    ok: true,
    data: { manifest, medications, algorithms },
  };
}
