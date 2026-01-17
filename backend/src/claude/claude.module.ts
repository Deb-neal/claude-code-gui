import { Module } from '@nestjs/common';
import { ClaudeCliService } from './infrastructure/claude-cli.service';
import { CLAUDE_CLI_SERVICE } from './domain/interfaces/claude-cli.service.interface';

/**
 * Claude Module
 * Claude Code CLI 통합을 담당하는 모듈
 */
@Module({
  providers: [
    {
      provide: CLAUDE_CLI_SERVICE,
      useClass: ClaudeCliService,
    },
  ],
  exports: [CLAUDE_CLI_SERVICE],
})
export class ClaudeModule {}
