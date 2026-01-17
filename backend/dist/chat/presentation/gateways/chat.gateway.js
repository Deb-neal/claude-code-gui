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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const claude_cli_service_interface_1 = require("../../../claude/domain/interfaces/claude-cli.service.interface");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    claudeCliService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    constructor(claudeCliService) {
        this.claudeCliService = claudeCliService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleStartChat(data, client) {
        this.logger.log(`Starting chat for project: ${data.projectPath}`);
        const result = await this.claudeCliService.start(data.projectPath);
        if (result.isFailure) {
            client.emit('system:error', { message: result.getError() });
            return;
        }
        client.emit('system:status', { message: 'Claude CLI started' });
    }
    async handleMessage(data, client) {
        this.logger.log(`Received message: ${data.message.substring(0, 50)}...`);
        client.emit('chat:response', {
            role: 'user',
            content: data.message,
            sessionId: data.sessionId,
        });
        const result = await this.claudeCliService.sendMessage(data.message, (chunk) => {
            client.emit('chat:stream', {
                content: chunk,
                sessionId: data.sessionId,
            });
        });
        if (result.isFailure) {
            client.emit('system:error', { message: result.getError() });
            return;
        }
        client.emit('chat:response', {
            role: 'assistant',
            content: result.getValue(),
            sessionId: data.sessionId,
            isComplete: true,
        });
    }
    async handleStopChat(client) {
        this.logger.log('Stopping chat');
        const result = await this.claudeCliService.stop();
        if (result.isFailure) {
            client.emit('system:error', { message: result.getError() });
            return;
        }
        client.emit('system:status', { message: 'Claude CLI stopped' });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:start'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleStartChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleStopChat", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
    }),
    __param(0, (0, common_1.Inject)(claude_cli_service_interface_1.CLAUDE_CLI_SERVICE)),
    __metadata("design:paramtypes", [Object])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map