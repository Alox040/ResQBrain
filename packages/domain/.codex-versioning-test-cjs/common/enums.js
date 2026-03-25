"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SURVEY_CONFIDENCE_LEVELS = exports.SURVEY_INSIGHT_TYPES = exports.SURVEY_TARGET_ENTITY_TYPES = exports.PACKAGE_MEMBER_TYPES = exports.CONTENT_ENTITY_TYPES = void 0;
exports.CONTENT_ENTITY_TYPES = [
    'Algorithm',
    'Medication',
    'Protocol',
    'Guideline',
];
exports.PACKAGE_MEMBER_TYPES = exports.CONTENT_ENTITY_TYPES;
exports.SURVEY_TARGET_ENTITY_TYPES = [
    ...exports.CONTENT_ENTITY_TYPES,
    'Feature',
];
exports.SURVEY_INSIGHT_TYPES = [
    'demand',
    'gap',
    'issue',
    'vote',
];
exports.SURVEY_CONFIDENCE_LEVELS = ['low', 'medium', 'high'];
