import { Module } from '@nestjs/common';
import { ClaudeApiService } from './infrastructure/claude-api.service';
import { CLAUDE_CLI_SERVICE } from './domain/interfaces/claude-cli.service.interface';
import { ProjectModule } from '../project/project.module';

/**
 * Claude Module
 * Claude API + Tool Use 통합을 담당하는 모듈
 */
@Module({
  imports: [ProjectModule],
  providers: [
    {
      provide: CLAUDE_CLI_SERVICE,
      useClass: ClaudeApiService,
    },
  ],
  exports: [CLAUDE_CLI_SERVICE],
})
export class ClaudeModule {}
