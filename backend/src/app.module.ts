import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProjectModule } from './project/project.module';
import { ClaudeModule } from './claude/claude.module';
import { ChatModule } from './chat/chat.module';

/**
 * App Module
 * 애플리케이션의 루트 모듈
 * Modular Monolith 아키텍처의 진입점
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    ProjectModule,
    ClaudeModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
