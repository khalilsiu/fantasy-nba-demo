// import Logger from './Logger';
import { Result } from './Result';
import UseCaseError from './UseCaseError';

export default class UnexpectedError extends Result<UseCaseError> {
  public constructor(err: Error) {
    const message = err.message || `An unexpected error occurred.`;
    super(false, {
      name: err.name,
      message,
      error: err,
    } as UseCaseError);
    console.error(`[UnexpectedError]: ${message}`);
  }

  public static create(err: Error): UnexpectedError {
    return new UnexpectedError(err);
  }
}

export class DomainModelCreationError extends Result<UseCaseError> {
  public constructor(message: string) {
    super(false, { message } as UseCaseError);
    console.error(`[DomainModelCreationError]: ${message}`);
  }
}

export class NotFoundError extends Result<UseCaseError> {
  public constructor(message: string) {
    super(false, { message } as UseCaseError);
    console.error(`[NotFoundError]: ${message}`);
  }
}

export class ValueObjectCreationError extends Result<UseCaseError> {
  public constructor(message: string) {
    super(false, { message } as UseCaseError);
    console.error(`[ValueObjectCreationError]: ${message}`);
  }
}
