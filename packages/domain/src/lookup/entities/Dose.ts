/**
 * Dosierungsangabe für ein Medikament.
 *
 * Flach und selbsterklärend — keine IDs, keine Relations.
 * Für die Anzeige im Einsatz konzipiert.
 */
export type AgeGroup = 'adult' | 'pediatric' | 'neonate';

export type RouteOfAdministration =
  | 'iv'
  | 'im'
  | 'io'
  | 'intranasal'
  | 'oral'
  | 'sublingual'
  | 'rectal'
  | 'topical'
  | 'inhalation'
  | 'other';

export interface Dose {
  /** Applikationsweg */
  readonly route: RouteOfAdministration;
  /** Dosisangabe als Text, z. B. "0,01 mg/kg", "5 mg", "200–400 mg" */
  readonly amount: string;
  /** Ist die Dosis gewichtsabhängig? */
  readonly weightBased: boolean;
  /** Zielgruppe — null bedeutet: gilt für alle */
  readonly ageGroup: AgeGroup | null;
  /** Maximaldosis, z. B. "max. 20 mg" */
  readonly maxDose: string | null;
  /** Freitexthinweis, z. B. "langsam injizieren" */
  readonly notes: string | null;
}

export function createDose(input: {
  route: RouteOfAdministration;
  amount: string;
  weightBased: boolean;
  ageGroup?: AgeGroup | null;
  maxDose?: string | null;
  notes?: string | null;
}): Dose {
  if (!input.amount.trim()) throw new Error('Dose.amount is required');

  return Object.freeze({
    route: input.route,
    amount: input.amount.trim(),
    weightBased: Boolean(input.weightBased),
    ageGroup: input.ageGroup ?? null,
    maxDose: input.maxDose?.trim() || null,
    notes: input.notes?.trim() || null,
  });
}
