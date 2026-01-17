"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const project_entity_1 = require("../../domain/entities/project.entity");
const project_repository_interface_1 = require("../../domain/interfaces/project.repository.interface");
const file_system_service_interface_1 = require("../../domain/interfaces/file-system.service.interface");
let ProjectService = class ProjectService {
    projectRepository;
    fileSystemService;
    constructor(projectRepository, fileSystemService) {
        this.projectRepository = projectRepository;
        this.fileSystemService = fileSystemService;
    }
    async selectProject(path) {
        const validationResult = await this.fileSystemService.validatePath(path);
        if (validationResult.isFailure) {
            throw new Error(validationResult.getError());
        }
        const projectName = path.split('/').pop() || 'Unknown';
        const project = project_entity_1.Project.create({
            name: projectName,
            path,
        });
        const saveResult = await this.projectRepository.save(project);
        if (saveResult.isFailure) {
            throw new Error(saveResult.getError());
        }
        return saveResult.getValue().toJSON();
    }
    async getFileTree(projectId) {
        const projectResult = await this.projectRepository.findById(projectId);
        if (projectResult.isFailure) {
            throw new Error(projectResult.getError());
        }
        const project = projectResult.getValue();
        project.updateLastAccessed();
        await this.projectRepository.save(project);
        const fileTreeResult = await this.fileSystemService.buildFileTree(project.path);
        if (fileTreeResult.isFailure) {
            throw new Error(fileTreeResult.getError());
        }
        return fileTreeResult.getValue().map((node) => node.toJSON());
    }
    async getFileContent(projectId, filePath) {
        const projectResult = await this.projectRepository.findById(projectId);
        if (projectResult.isFailure) {
            throw new Error(projectResult.getError());
        }
        const project = projectResult.getValue();
        const fullPath = `${project.path}${filePath}`;
        if (!fullPath.startsWith(project.path)) {
            throw new Error('잘못된 파일 경로입니다');
        }
        const contentResult = await this.fileSystemService.readFileContent(fullPath);
        if (contentResult.isFailure) {
            throw new Error(contentResult.getError());
        }
        return {
            path: filePath,
            content: contentResult.getValue(),
        };
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(project_repository_interface_1.PROJECT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(file_system_service_interface_1.FILE_SYSTEM_SERVICE)),
    __metadata("design:paramtypes", [Object, Object])
], ProjectService);
//# sourceMappingURL=project.service.js.map