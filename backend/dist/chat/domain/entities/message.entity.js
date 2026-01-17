"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const types_1 = require("../../../shared/domain/types");
class Message extends types_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get sessionId() {
        return this.props.sessionId;
    }
    get role() {
        return this.props.role;
    }
    get content() {
        return this.props.content;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props, id) {
        const now = new Date();
        return new Message({
            ...props,
            id: id || '',
            createdAt: now,
            updatedAt: now,
        }, id);
    }
    toJSON() {
        return {
            id: this._id,
            sessionId: this.sessionId,
            role: this.role,
            content: this.content,
            timestamp: this.createdAt.getTime(),
        };
    }
}
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map