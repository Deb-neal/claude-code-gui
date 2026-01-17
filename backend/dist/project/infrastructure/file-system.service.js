"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const file_node_vo_1 = require("../domain/value-objects/file-node.vo");
const result_1 = require("../../shared/domain/result");
let FileSystemService = class FileSystemService {
    async validatePath(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            if (!stats.isDirectory()) {
                return result_1.Result.fail('선택한 경로가 디렉토리가 아닙니다');
            }
            return result_1.Result.ok();
        }
        catch (error) {
            return result_1.Result.fail(`경로를 확인할 수 없습니다: ${error.message}`);
        }
    }
    async buildFileTree(dirPath) {
        try {
            const nodes = await this.buildFileTreeRecursive(dirPath, dirPath);
            return result_1.Result.ok(nodes);
        }
        catch (error) {
            return result_1.Result.fail(`파일 트리를 생성할 수 없습니다: ${error.message}`);
        }
    }
    async readFileContent(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return result_1.Result.ok(content);
        }
        catch (error) {
            return result_1.Result.fail(`파일을 읽을 수 없습니다: ${error.message}`);
        }
    }
    async buildFileTreeRecursive(dirPath, basePath) {
        const items = await fs.readdir(dirPath);
        const nodes = [];
        const filteredItems = items.filter((item) => !item.startsWith('.') && item !== 'node_modules');
        for (const item of filteredItems) {
            const fullPath = path.join(dirPath, item);
            const relativePath = fullPath.replace(basePath, '');
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                const children = await this.buildFileTreeRecursive(fullPath, basePath);
                nodes.push(file_node_vo_1.FileNode.createDirectory(item, relativePath, children));
            }
            else {
                nodes.push(file_node_vo_1.FileNode.createFile(item, relativePath));
            }
        }
        nodes.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        return nodes;
    }
};
exports.FileSystemService = FileSystemService;
exports.FileSystemService = FileSystemService = __decorate([
    (0, common_1.Injectable)()
], FileSystemService);
//# sourceMappingURL=file-system.service.js.map