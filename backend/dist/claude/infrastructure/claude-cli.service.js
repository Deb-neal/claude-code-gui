"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ClaudeCliService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeCliService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const result_1 = require("../../shared/domain/result");
let ClaudeCliService = ClaudeCliService_1 = class ClaudeCliService {
    logger = new common_1.Logger(ClaudeCliService_1.name);
    process = null;
    currentProjectPath = null;
    async start(projectPath) {
        try {
            if (this.process) {
                await this.stop();
            }
            this.logger.log(`Starting Claude CLI for project: ${projectPath}`);
            this.process = (0, child_process_1.spawn)('claude', [], {
                cwd: projectPath,
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                },
            });
            this.currentProjectPath = projectPath;
            this.process.on('error', (error) => {
                this.logger.error(`Claude CLI error: ${error.message}`);
            });
            this.process.on('exit', (code) => {
                this.logger.log(`Claude CLI exited with code: ${code}`);
                this.process = null;
            });
            this.process.stderr?.on('data', (data) => {
                this.logger.warn(`Claude CLI stderr: ${data.toString()}`);
            });
            return result_1.Result.ok();
        }
        catch (error) {
            this.logger.error(`Failed to start Claude CLI: ${error.message}`);
            return result_1.Result.fail(`Failed to start Claude CLI: ${error.message}`);
        }
    }
    async sendMessage(message, onChunk) {
        if (!this.process || !this.isRunning()) {
            return result_1.Result.fail('Claude CLI is not running');
        }
        try {
            let fullResponse = '';
            const dataHandler = (data) => {
                const chunk = data.toString();
                fullResponse += chunk;
                onChunk(chunk);
            };
            this.process.stdout?.on('data', dataHandler);
            this.process.stdin?.write(message + '\n');
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.process?.stdout?.removeListener('data', dataHandler);
                    resolve(result_1.Result.ok(fullResponse));
                }, 100);
            });
        }
        catch (error) {
            return result_1.Result.fail(`Failed to send message: ${error.message}`);
        }
    }
    async stop() {
        if (!this.process) {
            return result_1.Result.ok();
        }
        try {
            this.process.kill('SIGTERM');
            this.process = null;
            this.currentProjectPath = null;
            this.logger.log('Claude CLI stopped');
            return result_1.Result.ok();
        }
        catch (error) {
            return result_1.Result.fail(`Failed to stop Claude CLI: ${error.message}`);
        }
    }
    isRunning() {
        return this.process !== null && !this.process.killed;
    }
};
exports.ClaudeCliService = ClaudeCliService;
exports.ClaudeCliService = ClaudeCliService = ClaudeCliService_1 = __decorate([
    (0, common_1.Injectable)()
], ClaudeCliService);
//# sourceMappingURL=claude-cli.service.js.map