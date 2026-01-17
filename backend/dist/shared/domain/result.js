"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    isSuccess;
    isFailure;
    _value;
    _error;
    constructor(isSuccess, value, error) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this._error = error;
        Object.freeze(this);
    }
    getValue() {
        if (!this.isSuccess) {
            throw new Error('Cannot get value from a failed result');
        }
        return this._value;
    }
    getError() {
        if (this.isSuccess) {
            throw new Error('Cannot get error from a successful result');
        }
        return this._error;
    }
    static ok(value) {
        return new Result(true, value);
    }
    static fail(error) {
        return new Result(false, undefined, error);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map