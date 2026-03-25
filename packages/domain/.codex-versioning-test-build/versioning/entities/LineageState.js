import { DomainError } from '../../shared/errors';
export const LineageState = {
    ACTIVE: 'Active',
    SUPERSEDED: 'Superseded',
    RELEASED: 'Released',
    DEPRECATED: 'Deprecated',
};
export const ALL_LINEAGE_STATES = Object.freeze([
    LineageState.ACTIVE,
    LineageState.SUPERSEDED,
    LineageState.RELEASED,
    LineageState.DEPRECATED,
]);
export class ImmutableLineageStateSet {
    inner;
    constructor(states) {
        const normalized = new Set();
        for (const state of states) {
            assertLineageState(state);
            normalized.add(state);
        }
        if (normalized.size === 0) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'lineageState must contain at least one state.');
        }
        this.inner = normalized;
        Object.freeze(this);
    }
    get size() {
        return this.inner.size;
    }
    has(value) {
        return this.inner.has(value);
    }
    forEach(callbackfn, thisArg) {
        this.inner.forEach((value) => {
            callbackfn.call(thisArg, value, value, this);
        });
    }
    entries() {
        return this.inner.entries();
    }
    keys() {
        return this.inner.keys();
    }
    values() {
        return this.inner.values();
    }
    [Symbol.iterator]() {
        return this.inner[Symbol.iterator]();
    }
    get [Symbol.toStringTag]() {
        return 'ImmutableLineageStateSet';
    }
}
export function createLineageStateSet(states) {
    return new ImmutableLineageStateSet(states);
}
export function appendLineageStates(current, additions) {
    const next = new Set(current);
    for (const addition of additions) {
        assertLineageState(addition);
        next.add(addition);
    }
    if (next.size < current.size) {
        throw new DomainError('ENTITY_IMMUTABLE', 'lineageState may only be extended additively.');
    }
    return new ImmutableLineageStateSet(next);
}
function assertLineageState(state) {
    if (!ALL_LINEAGE_STATES.includes(state)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'lineageState contains an invalid state.', { state });
    }
    return state;
}
