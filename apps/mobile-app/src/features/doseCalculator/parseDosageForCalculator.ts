/**
 * Extracts a weight-based dose specification from free-text `dosage` fields.
 * Looks for patterns like `0,1 mg/kg`, `1 µg/kg`, optional `min. … mg`, `max. … µg`.
 * All limits are normalized to the same unit as the per-kg rate.
 */

export type DoseUnit = 'mg' | 'mcg';

export type ParsedDoseSpec = {
  amountPerKg: number;
  unit: DoseUnit;
  minDose?: number;
  maxDose?: number;
};

export type DoseResult = {
  /** Rounded value after clamp */
  value: number;
  unit: DoseUnit;
  rawUncapped: number;
  wasClampedToMin: boolean;
  wasClampedToMax: boolean;
};

function normalizeDecimal(raw: string): number {
  return Number.parseFloat(raw.replace(',', '.'));
}

function parseUnitToken(token: string): DoseUnit {
  const u = token.toLowerCase();
  return u === 'mg' ? 'mg' : 'mcg';
}

function convertDose(value: number, from: DoseUnit, to: DoseUnit): number {
  if (from === to) return value;
  if (from === 'mg' && to === 'mcg') return value * 1000;
  return value / 1000;
}

/**
 * First match of `amount (unit) / kg` in the text.
 */
export function parseDosageCalculatorSpec(
  dosage: string,
): ParsedDoseSpec | null {
  const perKg =
    /(\d+(?:[.,]\d+)?)\s*(mg|µg|mcg)\s*\/\s*kg/gi;
  const m = perKg.exec(dosage);
  if (!m) return null;
  const amountPerKg = normalizeDecimal(m[1]);
  if (!Number.isFinite(amountPerKg) || amountPerKg <= 0) return null;
  const unit = parseUnitToken(m[2]);

  let minDose: number | undefined;
  let maxDose: number | undefined;

  const minRe =
    /(?:min\.?|minimum|mind\.?|untergrenze)\s*[:\s–-]*\s*(\d+(?:[.,]\d+)?)\s*(mg|µg|mcg)/i;
  const minM = minRe.exec(dosage);
  if (minM) {
    const v = normalizeDecimal(minM[1]);
    const u = parseUnitToken(minM[2]);
    if (Number.isFinite(v) && v >= 0) {
      minDose = convertDose(v, u, unit);
    }
  }

  const maxRe =
    /(?:max\.?|maximum|höchstens|obergrenze)\s*[:\s–-]*\s*(\d+(?:[.,]\d+)?)\s*(mg|µg|mcg)/i;
  const maxM = maxRe.exec(dosage);
  if (maxM) {
    const v = normalizeDecimal(maxM[1]);
    const u = parseUnitToken(maxM[2]);
    if (Number.isFinite(v) && v >= 0) {
      maxDose = convertDose(v, u, unit);
    }
  }

  if (
    minDose != null &&
    maxDose != null &&
    minDose > maxDose
  ) {
    const t = minDose;
    minDose = maxDose;
    maxDose = t;
  }

  return { amountPerKg, unit, minDose, maxDose };
}

export function roundDoseForDisplay(value: number, unit: DoseUnit): number {
  if (!Number.isFinite(value)) return value;
  if (unit === 'mcg') {
    if (value >= 100) return Math.round(value);
    return Math.round(value * 10) / 10;
  }
  if (value >= 20) return Math.round(value * 10) / 10;
  if (value >= 1) return Math.round(value * 100) / 100;
  return Math.round(value * 1000) / 1000;
}

export function computeWeightBasedDose(
  weightKg: number,
  spec: ParsedDoseSpec,
): DoseResult {
  const rawUncapped = weightKg * spec.amountPerKg;
  let x = rawUncapped;
  let wasClampedToMin = false;
  let wasClampedToMax = false;

  if (spec.minDose != null && x < spec.minDose) {
    x = spec.minDose;
    wasClampedToMin = true;
  }
  if (spec.maxDose != null && x > spec.maxDose) {
    x = spec.maxDose;
    wasClampedToMax = true;
  }

  return {
    value: roundDoseForDisplay(x, spec.unit),
    unit: spec.unit,
    rawUncapped,
    wasClampedToMin,
    wasClampedToMax,
  };
}

export function formatDoseNumber(value: number, unit: DoseUnit): string {
  const s =
    unit === 'mcg' && value >= 100
      ? String(Math.round(value))
      : String(value).replace('.', ',');
  return `${s} ${unit === 'mg' ? 'mg' : 'µg'}`;
}
