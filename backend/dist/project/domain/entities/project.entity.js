"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const types_1 = require("../../../shared/domain/types");
class Project extends types_1.Entity {
    constructor(props, id) {
        super({
            ...props,
            createdAt: props.createdAt || new Date(),
            lastAccessedAt: props.lastAccessedAt || new Date(),
        }, id);
    }
    get name() {
        return this.props.name;
    }
    get path() {
        return this.props.path;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get lastAccessedAt() {
        return this.props.lastAccessedAt;
    }
    updateLastAccessed() {
        this.props.lastAccessedAt = new Date();
    }
    static create(props, id) {
        const now = new Date();
        return new Project({
            ...props,
            id: id || '',
            createdAt: now,
            updatedAt: now,
            lastAccessedAt: now,
        }, id);
    }
    toJSON() {
        return {
            id: this._id,
            name: this.name,
            path: this.path,
            createdAt: this.createdAt.getTime(),
            lastAccessedAt: this.lastAccessedAt.getTime(),
        };
    }
}
exports.Project = Project;
//# sourceMappingURL=project.entity.js.map