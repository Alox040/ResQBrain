const EMPTY_WARNINGS = Object.freeze([]);
const EMPTY_CONTEXT = Object.freeze({});
function freezeWarnings(warnings) {
    if (!warnings || warnings.length === 0) {
        return EMPTY_WARNINGS;
    }
    return Object.freeze([...warnings]);
}
function freezeContext(context) {
    if (!context || Object.keys(context).length === 0) {
        return EMPTY_CONTEXT;
    }
    return Object.freeze({ ...context });
}
export function allow(opts) {
    return Object.freeze({
        allowed: true,
        warnings: freezeWarnings(opts?.warnings),
        context: freezeContext(opts?.context),
    });
}
export function deny(reason, context) {
    return Object.freeze({
        allowed: false,
        denyReason: reason,
        warnings: EMPTY_WARNINGS,
        context: freezeContext(context),
    });
}
