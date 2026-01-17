/**
 * 도메인 예외 정의
 */

export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
  }
}

export class InvalidOperationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
