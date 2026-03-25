"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_ENTITY_TYPES = exports.EntityType = void 0;
exports.isContentEntityType = isContentEntityType;
exports.EntityType = {
    ALGORITHM: 'Algorithm',
    MEDICATION: 'Medication',
    PROTOCOL: 'Protocol',
    GUIDELINE: 'Guideline',
    CONTENT_PACKAGE: 'ContentPackage',
};
exports.CONTENT_ENTITY_TYPES = Object.freeze([
    exports.EntityType.ALGORITHM,
    exports.EntityType.MEDICATION,
    exports.EntityType.PROTOCOL,
    exports.EntityType.GUIDELINE,
]);
function isContentEntityType(value) {
    return exports.CONTENT_ENTITY_TYPES.includes(value);
}
