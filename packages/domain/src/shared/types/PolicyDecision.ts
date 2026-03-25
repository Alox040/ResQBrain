import type { DenyReason } from './DenyReason';

export interface PolicyWarning {
  readonly code: string;
  readonly message: string;
  readonly entityId?: string;
}

export interface AllowedPolicyDecision {
  readonly allowed: true;
  readonly denyReason?: undefined;
  readonly warnings: readonly PolicyWarning[];
  readonly context: Readonly<Record<string, unknown>>;
}

export interface DeniedPolicyDecision {
  readonly allowed: false;
  readonly denyReason: DenyReason;
  readonly warnings: readonly PolicyWarning[];
  readonly context: Readonly<Record<string, unknown>>;
}

export type PolicyDecision = AllowedPolicyDecision | DeniedPolicyDecision;

const EMPTY_WARNINGS: readonly PolicyWarning[] = Object.freeze([]);
const EMPTY_CONTEXT: Readonly<Record<string, unknown>> = Object.freeze({});

function freezeWarnings(warnings?: readonly PolicyWarning[]): readonly PolicyWarning[] {
  if (!warnings || warnings.length === 0) {
    return EMPTY_WARNINGS;
  }

  return Object.freeze([...warnings]);
}

function freezeContext(
  context?: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  if (!context || Object.keys(context).length === 0) {
    return EMPTY_CONTEXT;
  }

  return Object.freeze({ ...context });
}

export function allow(opts?: {
  readonly warnings?: readonly PolicyWarning[];
  readonly context?: Readonly<Record<string, unknown>>;
}): AllowedPolicyDecision {
  return Object.freeze({
    allowed: true,
    warnings: freezeWarnings(opts?.warnings),
    context: freezeContext(opts?.context),
  });
}

export function deny(
  reason: DenyReason,
  context?: Readonly<Record<string, unknown>>,
): DeniedPolicyDecision {
  return Object.freeze({
    allowed: false,
    denyReason: reason,
    warnings: EMPTY_WARNINGS,
    context: freezeContext(context),
  });
}
