"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../shared/domain/result");
let ProjectRepository = class ProjectRepository {
    projects = new Map();
    async save(project) {
        try {
            this.projects.set(project.id, project);
            return result_1.Result.ok(project);
        }
        catch (error) {
            return result_1.Result.fail(`프로젝트를 저장할 수 없습니다: ${error.message}`);
        }
    }
    async findById(id) {
        const project = this.projects.get(id);
        if (!project) {
            return result_1.Result.fail(`프로젝트를 찾을 수 없습니다: ${id}`);
        }
        return result_1.Result.ok(project);
    }
    async delete(id) {
        if (!this.projects.has(id)) {
            return result_1.Result.fail(`프로젝트를 찾을 수 없습니다: ${id}`);
        }
        this.projects.delete(id);
        return result_1.Result.ok();
    }
    async findAll() {
        return result_1.Result.ok(Array.from(this.projects.values()));
    }
};
exports.ProjectRepository = ProjectRepository;
exports.ProjectRepository = ProjectRepository = __decorate([
    (0, common_1.Injectable)()
], ProjectRepository);
//# sourceMappingURL=project.repository.js.map