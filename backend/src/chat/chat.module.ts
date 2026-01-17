import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/gateways/chat.gateway';
import { SessionRepository } from './infrastructure/session.repository';
import { SESSION_REPOSITORY } from './domain/interfaces/session.repository.interface';
import { ClaudeModule } from '../claude/claude.module';

/**
 * Chat Module
 * 채팅 세션 및 메시지 관리를 담당하는 모듈
 */
@Module({
  imports: [ClaudeModule],
  providers: [
    ChatGateway,
    {
      provide: SESSION_REPOSITORY,
      useClass: SessionRepository,
    },
  ],
  exports: [SESSION_REPOSITORY],
})
export class ChatModule {}
