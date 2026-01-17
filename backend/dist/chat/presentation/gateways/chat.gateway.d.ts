import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { IClaudeCliService } from '../../../claude/domain/interfaces/claude-cli.service.interface';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly claudeCliService;
    server: Server;
    private readonly logger;
    constructor(claudeCliService: IClaudeCliService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleStartChat(data: {
        projectPath: string;
    }, client: Socket): Promise<void>;
    handleMessage(data: {
        message: string;
        sessionId: string;
    }, client: Socket): Promise<void>;
    handleStopChat(client: Socket): Promise<void>;
}
