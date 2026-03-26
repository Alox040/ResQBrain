import type { Contraindication } from './Contraindication';
import type { Dose } from './Dose';
import type { Indication } from './Indication';
import type { Version } from './Version';

/**
 * Medikament — optimiert für schnelles Lookup und Offline-Caching.
 *
 * Alle Unterdaten sind eingebettet (keine IDs zum Auflösen).
 * Vollständig JSON-serialisierbar.
 */
export interface Medication {
  readonly kind: 'Medication';
  readonly id: string;
  /** Anzeigename, z. B. "Adrenalin" */
  readonly name: string;
  /** Wirkstoffname, z. B. "Epinephrin" */
  readonly genericName: string;
  /** Handelsnamen, z. B. ["Suprarenin", "EpiPen"] */
  readonly tradeNames: ReadonlyArray<string>;
  /** Alle Dosierungen direkt eingebettet */
  readonly doses: ReadonlyArray<Dose>;
  /** Indikationen direkt eingebettet */
  readonly indications: ReadonlyArray<Indication>;
  /** Kontraindikationen direkt eingebettet */
  readonly contraindications: ReadonlyArray<Contraindication>;
  /** Freitexthinweise, z. B. Lagerung, Besonderheiten */
  readonly notes: string | null;
  /** Versionsstempel des ContentBundles */
  readonly version: Version;
  /**
   * Normalisierte Suchtoken für den lokalen Index.
   * Enthält: name, genericName, tradeNames — kleingeschrieben, dedupliziert.
   */
  readonly searchTokens: ReadonlyArray<string>;
}

export function createMedication(input: {
  id: string;
  name: string;
  genericName: string;
  tradeNames?: ReadonlyArray<string>;
  doses?: ReadonlyArray<Dose>;
  indications?: ReadonlyArray<Indication>;
  contraindications?: ReadonlyArray<Contraindication>;
  notes?: string | null;
  version: Version;
}): Medication {
  if (!input.id.trim()) throw new Error('Medication.id is required');
  if (!input.name.trim()) throw new Error('Medication.name is required');
  if (!input.genericName.trim()) throw new Error('Medication.genericName is required');

  const name = input.name.trim();
  const genericName = input.genericName.trim();
  const tradeNames = Object.freeze((input.tradeNames ?? []).map((t) => t.trim()).filter(Boolean));

  const searchTokens = Object.freeze(
    [...new Set([name, genericName, ...tradeNames].map((s) => s.toLowerCase()))],
  );

  return Object.freeze({
    kind: 'Medication',
    id: input.id.trim(),
    name,
    genericName,
    tradeNames,
    doses: Object.freeze([...(input.doses ?? [])]),
    indications: Object.freeze([...(input.indications ?? [])]),
    contraindications: Object.freeze([...(input.contraindications ?? [])]),
    notes: input.notes?.trim() || null,
    version: input.version,
    searchTokens,
  });
}
