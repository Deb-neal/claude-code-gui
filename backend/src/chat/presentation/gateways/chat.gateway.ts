import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import type { IClaudeCliService } from '../../../claude/domain/interfaces/claude-cli.service.interface';
import { CLAUDE_CLI_SERVICE } from '../../../claude/domain/interfaces/claude-cli.service.interface';

/**
 * Chat Gateway
 * WebSocket을 통한 실시간 채팅 통신
 */
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    @Inject(CLAUDE_CLI_SERVICE)
    private readonly claudeCliService: IClaudeCliService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat:start')
  async handleStartChat(
    @MessageBody() data: { projectPath: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Starting chat for project: ${data.projectPath}`);

    const result = await this.claudeCliService.start(data.projectPath);

    if (result.isFailure) {
      client.emit('system:error', { message: result.getError() });
      return;
    }

    client.emit('system:status', { message: 'Claude CLI started' });
  }

  @SubscribeMessage('chat:message')
  async handleMessage(
    @MessageBody() data: { message: string; sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received message: ${data.message.substring(0, 50)}...`);

    // 사용자 메시지를 먼저 브로드캐스트
    client.emit('chat:response', {
      role: 'user',
      content: data.message,
      sessionId: data.sessionId,
    });

    // Claude에게 메시지 전송 및 스트리밍 응답 수신
    const result = await this.claudeCliService.sendMessage(
      data.message,
      (chunk: string) => {
        // 스트리밍 청크를 클라이언트에게 전송
        client.emit('chat:stream', {
          content: chunk,
          sessionId: data.sessionId,
        });
      },
    );

    if (result.isFailure) {
      client.emit('system:error', { message: result.getError() });
      return;
    }

    // 전체 응답 완료 알림
    client.emit('chat:response', {
      role: 'assistant',
      content: result.getValue(),
      sessionId: data.sessionId,
      isComplete: true,
    });
  }

  @SubscribeMessage('chat:stop')
  async handleStopChat(@ConnectedSocket() client: Socket) {
    this.logger.log('Stopping chat');

    const result = await this.claudeCliService.stop();

    if (result.isFailure) {
      client.emit('system:error', { message: result.getError() });
      return;
    }

    client.emit('system:status', { message: 'Claude CLI stopped' });
  }
}
