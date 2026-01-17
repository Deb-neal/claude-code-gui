"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../shared/domain/result");
let SessionRepository = class SessionRepository {
    sessions = new Map();
    async save(session) {
        try {
            this.sessions.set(session.id, session);
            return result_1.Result.ok(session);
        }
        catch (error) {
            return result_1.Result.fail(`Failed to save session: ${error.message}`);
        }
    }
    async findById(id) {
        const session = this.sessions.get(id);
        if (!session) {
            return result_1.Result.fail(`Session not found: ${id}`);
        }
        return result_1.Result.ok(session);
    }
    async findByProjectId(projectId) {
        const sessions = Array.from(this.sessions.values()).filter((session) => session.projectId === projectId);
        return result_1.Result.ok(sessions);
    }
    async delete(id) {
        if (!this.sessions.has(id)) {
            return result_1.Result.fail(`Session not found: ${id}`);
        }
        this.sessions.delete(id);
        return result_1.Result.ok();
    }
};
exports.SessionRepository = SessionRepository;
exports.SessionRepository = SessionRepository = __decorate([
    (0, common_1.Injectable)()
], SessionRepository);
//# sourceMappingURL=session.repository.js.map