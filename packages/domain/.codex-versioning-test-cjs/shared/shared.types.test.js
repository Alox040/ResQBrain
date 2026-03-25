"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const types_1 = require("./types");
(0, node_test_1.default)('allow() returns an allowed PolicyDecision with immutable warnings and context', () => {
    const warnings = [{ code: 'WARN', message: 'non-blocking' }];
    const decision = (0, types_1.allow)({
        warnings,
        context: { organizationId: 'org-1' },
    });
    strict_1.default.equal(decision.allowed, true);
    strict_1.default.equal(decision.denyReason, undefined);
    strict_1.default.deepEqual(decision.warnings, warnings);
    strict_1.default.deepEqual(decision.context, { organizationId: 'org-1' });
    strict_1.default.throws(() => {
        decision.warnings.push({ code: 'MUTATE', message: 'fail' });
    });
    strict_1.default.throws(() => {
        decision.context.extra = true;
    });
});
(0, node_test_1.default)('deny(reason) returns a denied PolicyDecision with canonical reason and empty warnings', () => {
    const decision = (0, types_1.deny)(types_1.DenyReason.CAPABILITY_NOT_GRANTED, { capability: 'package.release' });
    strict_1.default.equal(decision.allowed, false);
    strict_1.default.equal(decision.denyReason, types_1.DenyReason.CAPABILITY_NOT_GRANTED);
    strict_1.default.deepEqual(decision.warnings, []);
    strict_1.default.deepEqual(decision.context, { capability: 'package.release' });
});
(0, node_test_1.default)('DenyReason exports the canonical governance reasons', () => {
    strict_1.default.equal(types_1.DenyReason.MISSING_ORGANIZATION_CONTEXT, 'MISSING_ORGANIZATION_CONTEXT');
    strict_1.default.equal(types_1.DenyReason.POLICY_UNRESOLVABLE, 'POLICY_UNRESOLVABLE');
    strict_1.default.equal(types_1.DenyReason.COMPOSITION_VERSION_STALE, 'COMPOSITION_VERSION_STALE');
    strict_1.default.equal(types_1.DenyReason.DATA_INTEGRITY_VIOLATION, 'DATA_INTEGRITY_VIOLATION');
});
(0, node_test_1.default)('PolicyDecision is discriminated by allowed', () => {
    const allowedDecision = (0, types_1.allow)();
    const deniedDecision = (0, types_1.deny)(types_1.DenyReason.NO_ACTIVE_ROLE);
    const decisions = [allowedDecision, deniedDecision];
    strict_1.default.equal(decisions[0].allowed, true);
    strict_1.default.equal(decisions[1].allowed, false);
});
function _compileTimeDenyRequiresReason() {
    // @ts-expect-error deny() requires a DenyReason (G0-03)
    (0, types_1.deny)();
}
void _compileTimeDenyRequiresReason;
