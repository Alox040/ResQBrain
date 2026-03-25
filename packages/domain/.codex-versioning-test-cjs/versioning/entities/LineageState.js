"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmutableLineageStateSet = exports.ALL_LINEAGE_STATES = exports.LineageState = void 0;
exports.createLineageStateSet = createLineageStateSet;
exports.appendLineageStates = appendLineageStates;
const errors_1 = require("../../shared/errors");
exports.LineageState = {
    ACTIVE: 'Active',
    SUPERSEDED: 'Superseded',
    RELEASED: 'Released',
    DEPRECATED: 'Deprecated',
};
exports.ALL_LINEAGE_STATES = Object.freeze([
    exports.LineageState.ACTIVE,
    exports.LineageState.SUPERSEDED,
    exports.LineageState.RELEASED,
    exports.LineageState.DEPRECATED,
]);
class ImmutableLineageStateSet {
    inner;
    constructor(states) {
        const normalized = new Set();
        for (const state of states) {
            assertLineageState(state);
            normalized.add(state);
        }
        if (normalized.size === 0) {
            throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'lineageState must contain at least one state.');
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
exports.ImmutableLineageStateSet = ImmutableLineageStateSet;
function createLineageStateSet(states) {
    return new ImmutableLineageStateSet(states);
}
function appendLineageStates(current, additions) {
    const next = new Set(current);
    for (const addition of additions) {
        assertLineageState(addition);
        next.add(addition);
    }
    if (next.size < current.size) {
        throw new errors_1.DomainError('ENTITY_IMMUTABLE', 'lineageState may only be extended additively.');
    }
    return new ImmutableLineageStateSet(next);
}
function assertLineageState(state) {
    if (!exports.ALL_LINEAGE_STATES.includes(state)) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'lineageState contains an invalid state.', { state });
    }
    return state;
}
