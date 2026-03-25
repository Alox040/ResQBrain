import { DomainError } from '../../shared/errors';

export const LineageState = {
  ACTIVE: 'Active',
  SUPERSEDED: 'Superseded',
  RELEASED: 'Released',
  DEPRECATED: 'Deprecated',
} as const;

export type LineageState = (typeof LineageState)[keyof typeof LineageState];

export const ALL_LINEAGE_STATES = Object.freeze([
  LineageState.ACTIVE,
  LineageState.SUPERSEDED,
  LineageState.RELEASED,
  LineageState.DEPRECATED,
] as const);

export class ImmutableLineageStateSet implements ReadonlySet<LineageState> {
  private readonly inner: Set<LineageState>;

  constructor(states: Iterable<LineageState>) {
    const normalized = new Set<LineageState>();

    for (const state of states) {
      assertLineageState(state);
      normalized.add(state);
    }

    if (normalized.size === 0) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'lineageState must contain at least one state.',
      );
    }

    this.inner = normalized;
    Object.freeze(this);
  }

  get size(): number {
    return this.inner.size;
  }

  has(value: LineageState): boolean {
    return this.inner.has(value);
  }

  forEach(
    callbackfn: (value: LineageState, value2: LineageState, set: ReadonlySet<LineageState>) => void,
    thisArg?: unknown,
  ): void {
    this.inner.forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  entries(): SetIterator<[LineageState, LineageState]> {
    return this.inner.entries();
  }

  keys(): SetIterator<LineageState> {
    return this.inner.keys();
  }

  values(): SetIterator<LineageState> {
    return this.inner.values();
  }

  [Symbol.iterator](): SetIterator<LineageState> {
    return this.inner[Symbol.iterator]();
  }

  get [Symbol.toStringTag](): string {
    return 'ImmutableLineageStateSet';
  }
}

export function createLineageStateSet(
  states: Iterable<LineageState>,
): ImmutableLineageStateSet {
  return new ImmutableLineageStateSet(states);
}

export function appendLineageStates(
  current: ReadonlySet<LineageState>,
  additions: Iterable<LineageState>,
): ImmutableLineageStateSet {
  const next = new Set<LineageState>(current);

  for (const addition of additions) {
    assertLineageState(addition);
    next.add(addition);
  }

  for (const prior of current) {
    if (!next.has(prior)) {
      throw new DomainError(
        'ENTITY_IMMUTABLE',
        'lineageState may only be extended additively.',
      );
    }
  }

  return new ImmutableLineageStateSet(next);
}

function assertLineageState(state: LineageState): LineageState {
  if (!ALL_LINEAGE_STATES.includes(state)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'lineageState contains an invalid state.',
      { state },
    );
  }

  return state;
}
