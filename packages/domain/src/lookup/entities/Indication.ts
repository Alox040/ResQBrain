/**
 * Indikation für ein Medikament oder einen Algorithmus.
 *
 * Wann ist der Einsatz dieses Inhalts angezeigt?
 */
export interface Indication {
  /** Beschreibungstext, z. B. "Anaphylaxie Grad III–IV" */
  readonly text: string;
  /** Optionale Kategorie, z. B. "Kardiovaskulär", "Neurologisch" */
  readonly category: string | null;
}

export function createIndication(input: {
  text: string;
  category?: string | null;
}): Indication {
  if (!input.text.trim()) throw new Error('Indication.text is required');

  return Object.freeze({
    text: input.text.trim(),
    category: input.category?.trim() || null,
  });
}
