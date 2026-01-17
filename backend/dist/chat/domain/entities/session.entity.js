"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const types_1 = require("../../../shared/domain/types");
class Session extends types_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get projectId() {
        return this.props.projectId;
    }
    get messages() {
        return this.props.messages;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    addMessage(message) {
        this.props.messages.push(message);
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const now = new Date();
        return new Session({
            ...props,
            id: id || '',
            createdAt: now,
            updatedAt: now,
            messages: [],
        }, id);
    }
    toJSON() {
        return {
            id: this._id,
            projectId: this.projectId,
            messages: this.messages.map((msg) => msg.toJSON()),
            createdAt: this.createdAt.getTime(),
            updatedAt: this.updatedAt.getTime(),
        };
    }
}
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map