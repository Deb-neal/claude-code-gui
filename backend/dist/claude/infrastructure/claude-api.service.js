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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ClaudeApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const result_1 = require("../../shared/domain/result");
const common_2 = require("@nestjs/common");
const file_system_service_interface_1 = require("../../project/domain/interfaces/file-system.service.interface");
let ClaudeApiService = ClaudeApiService_1 = class ClaudeApiService {
    fileSystemService;
    configService;
    logger = new common_1.Logger(ClaudeApiService_1.name);
    client;
    currentProjectPath = null;
    conversationHistory = [];
    constructor(fileSystemService, configService) {
        this.fileSystemService = fileSystemService;
        this.configService = configService;
        const apiKey = this.configService.get('ANTHROPIC_API_KEY');
        this.logger.log(`API Key loaded: ${apiKey ? 'Yes' : 'No'}`);
        this.client = new sdk_1.default({
            apiKey: apiKey,
        });
    }
    async start(projectPath) {
        try {
            this.currentProjectPath = projectPath;
            this.conversationHistory = [];
            this.logger.log(`Started Claude API for project: ${projectPath}`);
            return result_1.Result.ok();
        }
        catch (error) {
            return result_1.Result.fail(`Failed to start Claude API: ${error.message}`);
        }
    }
    async sendMessage(message, onChunk) {
        if (!this.currentProjectPath) {
            return result_1.Result.fail('Project path not set. Call start() first.');
        }
        try {
            this.conversationHistory.push({
                role: 'user',
                content: message,
            });
            let fullResponse = '';
            let toolUseInProgress = false;
            const tools = [
                {
                    name: 'read_file',
                    description: '프로젝트의 파일을 읽습니다.',
                    input_schema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: '읽을 파일의 상대 경로 (예: src/app.ts)',
                            },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'write_file',
                    description: '프로젝트의 파일을 생성하거나 수정합니다.',
                    input_schema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: '쓸 파일의 상대 경로',
                            },
                            content: {
                                type: 'string',
                                description: '파일에 쓸 내용',
                            },
                        },
                        required: ['path', 'content'],
                    },
                },
                {
                    name: 'list_files',
                    description: '프로젝트의 파일 목록을 가져옵니다.',
                    input_schema: {
                        type: 'object',
                        properties: {},
                    },
                },
            ];
            const stream = await this.client.messages.stream({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 8192,
                messages: this.conversationHistory,
                tools,
                system: `당신은 프로젝트 폴더 "${this.currentProjectPath}"에서 작업하는 코딩 어시스턴트입니다.
파일을 읽고, 수정하고, 생성할 수 있습니다.
사용자가 요청하면 read_file, write_file, list_files 도구를 사용하세요.`,
            });
            for await (const event of stream) {
                if (event.type === 'content_block_delta') {
                    if (event.delta.type === 'text_delta') {
                        const chunk = event.delta.text;
                        fullResponse += chunk;
                        onChunk(chunk);
                    }
                }
                if (event.type === 'content_block_start') {
                    if (event.content_block.type === 'tool_use') {
                        toolUseInProgress = true;
                        this.logger.log(`Tool use detected: ${event.content_block.name}`);
                    }
                }
            }
            const finalMessage = await stream.finalMessage();
            if (finalMessage.stop_reason === 'tool_use') {
                const toolResults = await this.handleToolUse(finalMessage);
                this.conversationHistory.push({
                    role: 'assistant',
                    content: finalMessage.content,
                });
                this.conversationHistory.push({
                    role: 'user',
                    content: toolResults,
                });
                return this.sendMessage('계속해주세요', onChunk);
            }
            this.conversationHistory.push({
                role: 'assistant',
                content: fullResponse,
            });
            return result_1.Result.ok(fullResponse);
        }
        catch (error) {
            this.logger.error(`Claude API error: ${error.message}`);
            return result_1.Result.fail(`Failed to send message: ${error.message}`);
        }
    }
    async handleToolUse(message) {
        const toolResults = [];
        for (const block of message.content) {
            if (block.type === 'tool_use') {
                const { id, name, input } = block;
                this.logger.log(`Executing tool: ${name} with input:`, input);
                let result;
                const toolInput = input;
                switch (name) {
                    case 'read_file':
                        result = await this.executeReadFile(toolInput.path);
                        break;
                    case 'write_file':
                        result = await this.executeWriteFile(toolInput.path, toolInput.content);
                        break;
                    case 'list_files':
                        result = await this.executeListFiles();
                        break;
                    default:
                        result = `Unknown tool: ${name}`;
                }
                toolResults.push({
                    type: 'tool_result',
                    tool_use_id: id,
                    content: result,
                });
            }
        }
        return toolResults;
    }
    async executeReadFile(path) {
        const fullPath = `${this.currentProjectPath}/${path}`;
        const result = await this.fileSystemService.readFileContent(fullPath);
        if (result.isFailure) {
            return `Error: ${result.getError()}`;
        }
        return result.getValue();
    }
    async executeWriteFile(path, content) {
        const fullPath = `${this.currentProjectPath}/${path}`;
        try {
            const fs = await import('fs/promises');
            await fs.writeFile(fullPath, content, 'utf-8');
            return `Successfully wrote to ${path}`;
        }
        catch (error) {
            return `Error writing file: ${error.message}`;
        }
    }
    async executeListFiles() {
        const result = await this.fileSystemService.buildFileTree(this.currentProjectPath);
        if (result.isFailure) {
            return `Error: ${result.getError()}`;
        }
        const files = result.getValue();
        return JSON.stringify(files, null, 2);
    }
    async stop() {
        this.currentProjectPath = null;
        this.conversationHistory = [];
        this.logger.log('Claude API stopped');
        return result_1.Result.ok();
    }
    isRunning() {
        return this.currentProjectPath !== null;
    }
};
exports.ClaudeApiService = ClaudeApiService;
exports.ClaudeApiService = ClaudeApiService = ClaudeApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(file_system_service_interface_1.FILE_SYSTEM_SERVICE)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], ClaudeApiService);
//# sourceMappingURL=claude-api.service.js.map