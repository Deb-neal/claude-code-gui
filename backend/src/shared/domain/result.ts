/**
 * Result 패턴: 성공/실패를 명시적으로 처리
 * 예외 대신 Result를 반환하여 에러 핸들링을 명확히 함
 */
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private _value?: T;
  private _error?: string;

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from a failed result');
    }
    return this._value as T;
  }

  public getError(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error as string;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error);
  }
}
