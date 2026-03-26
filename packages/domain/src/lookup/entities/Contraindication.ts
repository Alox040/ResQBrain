/**
 * Kontraindikation für ein Medikament oder einen Algorithmus.
 *
 * Wann darf dieser Inhalt NICHT eingesetzt werden?
 */
export type ContraindicationSeverity =
  | 'absolute'   // unter keinen Umständen
  | 'relative';  // Abwägung erforderlich

export interface Contraindication {
  /** Beschreibungstext, z. B. "bekannte Penicillin-Allergie" */
  readonly text: string;
  /** Absolut oder relativ */
  readonly severity: ContraindicationSeverity;
  /** Optionaler Hinweis auf Alternative oder Sonderfall */
  readonly notes: string | null;
}

export function createContraindication(input: {
  text: string;
  severity: ContraindicationSeverity;
  notes?: string | null;
}): Contraindication {
  if (!input.text.trim()) throw new Error('Contraindication.text is required');

  return Object.freeze({
    text: input.text.trim(),
    severity: input.severity,
    notes: input.notes?.trim() || null,
  });
}
