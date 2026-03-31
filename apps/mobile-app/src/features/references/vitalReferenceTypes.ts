/**
 * Static offline vital sign reference material for emergency orientation.
 * Not patient-specific; local protocols and clinical judgment always take precedence.
 */

export type AgeGroupId = 'adult' | 'child' | 'infant';

/** Clinical quantity we show as a reference card. */
export type VitalSignId =
  | 'heart_rate'
  | 'respiratory_rate'
  | 'systolic_bp'
  | 'diastolic_bp'
  | 'spo2_room_air'
  | 'temp_c';

export type VitalReferenceCard = {
  id: VitalSignId;
  /** Short heading on card */
  title: string;
  /** Unit line, e.g. /min, mmHg */
  unit: string;
  /** Main range string, large type */
  range: string;
  /** Optional context under range */
  hint?: string;
};

export type VitalAgeGroupSection = {
  id: AgeGroupId;
  /** Tab / selector label */
  label: string;
  /** One-line scope, e.g. age band */
  scope: string;
  cards: VitalReferenceCard[];
};
