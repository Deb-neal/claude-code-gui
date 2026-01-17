"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.InvalidOperationException = exports.EntityNotFoundException = exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainException = DomainException;
class EntityNotFoundException extends DomainException {
    constructor(entityName, id) {
        super(`${entityName} with id ${id} not found`);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class InvalidOperationException extends DomainException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidOperationException = InvalidOperationException;
class ValidationException extends DomainException {
    constructor(message) {
        super(message);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=exceptions.js.map