import type { Indication } from './Indication';
import type { Version } from './Version';

/**
 * Einzelner Schritt in einem Notfallalgorithmus.
 *
 * Flach und direkt — kein Decision-Graph, keine Node-IDs.
 * Geeignet für sequenzielle Schritt-für-Schritt-Anzeige.
 */
export interface AlgorithmStep {
  /** Reihenfolge, beginnend bei 1 */
  readonly position: number;
  /** Handlungsanweisung, z. B. "Atemwege freimachen und sichern" */
  readonly instruction: string;
  /**
   * Optionale Bedingung für diesen Schritt.
   * z. B. "wenn SpO2 < 90 %" — wird vor der Anweisung angezeigt.
   */
  readonly condition: string | null;
  /**
   * IDs von Medikamenten, die in diesem Schritt relevant sind.
   * Denormalisiert — keine Relation zum Auflösen nötig.
   */
  readonly medicationIds: ReadonlyArray<string>;
  /** Freitexthinweis für diesen Schritt */
  readonly notes: string | null;
}

/**
 * Notfallalgorithmus — optimiert für schnelles Lookup und Offline-Caching.
 *
 * Schrittbasiert (nicht graphbasiert).
 * Alle Unterdaten eingebettet, vollständig JSON-serialisierbar.
 */
export interface Algorithm {
  readonly kind: 'Algorithm';
  readonly id: string;
  /** Anzeigename, z. B. "Polytrauma Algorithmus" */
  readonly name: string;
  /**
   * Kategorie für Filterung und Gruppierung.
   * z. B. "Trauma", "Kardiovaskulär", "Neurologie", "Pädiatrie"
   */
  readonly category: string;
  /** Indikationen direkt eingebettet */
  readonly indications: ReadonlyArray<Indication>;
  /** Schritte in Reihenfolge — sortiert nach position */
  readonly steps: ReadonlyArray<AlgorithmStep>;
  /** Freitexthinweis zum Gesamtalgorithmus */
  readonly notes: string | null;
  /** Versionsstempel des ContentBundles */
  readonly version: Version;
  /**
   * Normalisierte Suchtoken für den lokalen Index.
   * Enthält: name, category — kleingeschrieben, dedupliziert.
   */
  readonly searchTokens: ReadonlyArray<string>;
}

export function createAlgorithmStep(input: {
  position: number;
  instruction: string;
  condition?: string | null;
  medicationIds?: ReadonlyArray<string>;
  notes?: string | null;
}): AlgorithmStep {
  if (input.position < 1) throw new Error('AlgorithmStep.position must be >= 1');
  if (!input.instruction.trim()) throw new Error('AlgorithmStep.instruction is required');

  return Object.freeze({
    position: input.position,
    instruction: input.instruction.trim(),
    condition: input.condition?.trim() || null,
    medicationIds: Object.freeze([...(input.medicationIds ?? [])]),
    notes: input.notes?.trim() || null,
  });
}

export function createAlgorithm(input: {
  id: string;
  name: string;
  category: string;
  indications?: ReadonlyArray<Indication>;
  steps?: ReadonlyArray<AlgorithmStep>;
  notes?: string | null;
  version: Version;
}): Algorithm {
  if (!input.id.trim()) throw new Error('Algorithm.id is required');
  if (!input.name.trim()) throw new Error('Algorithm.name is required');
  if (!input.category.trim()) throw new Error('Algorithm.category is required');

  const name = input.name.trim();
  const category = input.category.trim();

  const steps = Object.freeze(
    [...(input.steps ?? [])].sort((a, b) => a.position - b.position),
  );

  const searchTokens = Object.freeze(
    [...new Set([name, category].map((s) => s.toLowerCase()))],
  );

  return Object.freeze({
    kind: 'Algorithm',
    id: input.id.trim(),
    name,
    category,
    indications: Object.freeze([...(input.indications ?? [])]),
    steps,
    notes: input.notes?.trim() || null,
    version: input.version,
    searchTokens,
  });
}
