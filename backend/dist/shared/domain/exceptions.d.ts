export declare abstract class DomainException extends Error {
    constructor(message: string);
}
export declare class EntityNotFoundException extends DomainException {
    constructor(entityName: string, id: string);
}
export declare class InvalidOperationException extends DomainException {
    constructor(message: string);
}
export declare class ValidationException extends DomainException {
    constructor(message: string);
}
