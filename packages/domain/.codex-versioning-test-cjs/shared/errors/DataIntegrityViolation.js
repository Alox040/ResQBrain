"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIntegrityViolation = void 0;
const DomainError_1 = require("./DomainError");
class DataIntegrityViolation extends DomainError_1.DomainError {
    constructor(message, context) {
        super('DATA_INTEGRITY_VIOLATION', message, context);
    }
}
exports.DataIntegrityViolation = DataIntegrityViolation;
