export declare class Result<T> {
    isSuccess: boolean;
    isFailure: boolean;
    private _value?;
    private _error?;
    private constructor();
    getValue(): T;
    getError(): string;
    static ok<U>(value?: U): Result<U>;
    static fail<U>(error: string): Result<U>;
}
