"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    _id;
    props;
    constructor(props, id) {
        this._id = id || this.generateId();
        this.props = props;
    }
    get id() {
        return this._id;
    }
    equals(entity) {
        if (!entity) {
            return false;
        }
        return this._id === entity._id;
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=types.js.map