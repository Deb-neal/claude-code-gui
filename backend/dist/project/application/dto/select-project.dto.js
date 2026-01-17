"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileContentDto = exports.FileNodeDto = exports.ProjectResponseDto = exports.SelectProjectDto = void 0;
class SelectProjectDto {
    path;
}
exports.SelectProjectDto = SelectProjectDto;
class ProjectResponseDto {
    id;
    name;
    path;
    createdAt;
    lastAccessedAt;
}
exports.ProjectResponseDto = ProjectResponseDto;
class FileNodeDto {
    name;
    path;
    type;
    children;
}
exports.FileNodeDto = FileNodeDto;
class FileContentDto {
    path;
    content;
}
exports.FileContentDto = FileContentDto;
//# sourceMappingURL=select-project.dto.js.map