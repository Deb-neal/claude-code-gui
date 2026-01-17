import { Injectable, Logger } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import type { IClaudeCliService } from '../domain/interfaces/claude-cli.service.interface';
import { Result } from '../../shared/domain/result';

/**
 * Claude CLI Service Implementation
 * child_process를 사용하여 Claude Code CLI와 통신
 */
@Injectable()
export class ClaudeCliService implements IClaudeCliService {
  private readonly logger = new Logger(ClaudeCliService.name);
  private process: ChildProcess | null = null;
  private currentProjectPath: string | null = null;

  async start(projectPath: string): Promise<Result<void>> {
    try {
      if (this.process) {
        await this.stop();
      }

      this.logger.log(`Starting Claude CLI for project: ${projectPath}`);

      // Claude Code CLI 실행
      // 실제 명령어는 환경에 따라 다를 수 있음: 'claude', 'claude-code', etc.
      this.process = spawn('claude', [], {
        cwd: projectPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          // Claude API 키 등 필요한 환경변수 설정
        },
      });

      this.currentProjectPath = projectPath;

      // 에러 핸들링
      this.process.on('error', (error) => {
        this.logger.error(`Claude CLI error: ${error.message}`);
      });

      this.process.on('exit', (code) => {
        this.logger.log(`Claude CLI exited with code: ${code}`);
        this.process = null;
      });

      // stderr 로깅
      this.process.stderr?.on('data', (data) => {
        this.logger.warn(`Claude CLI stderr: ${data.toString()}`);
      });

      return Result.ok();
    } catch (error) {
      this.logger.error(`Failed to start Claude CLI: ${error.message}`);
      return Result.fail(`Failed to start Claude CLI: ${error.message}`);
    }
  }

  async sendMessage(
    message: string,
    onChunk: (chunk: string) => void,
  ): Promise<Result<string>> {
    if (!this.process || !this.isRunning()) {
      return Result.fail('Claude CLI is not running');
    }

    try {
      let fullResponse = '';

      // stdout 데이터 수신 리스너 설정
      const dataHandler = (data: Buffer) => {
        const chunk = data.toString();
        fullResponse += chunk;
        onChunk(chunk); // 스트리밍으로 청크 전달
      };

      this.process.stdout?.on('data', dataHandler);

      // stdin으로 메시지 전송
      this.process.stdin?.write(message + '\n');

      // 응답 완료 대기 (실제로는 더 정교한 로직 필요)
      return new Promise((resolve) => {
        setTimeout(() => {
          this.process?.stdout?.removeListener('data', dataHandler);
          resolve(Result.ok(fullResponse));
        }, 100); // 임시: 실제로는 응답 완료 신호를 감지해야 함
      });
    } catch (error) {
      return Result.fail(`Failed to send message: ${error.message}`);
    }
  }

  async stop(): Promise<Result<void>> {
    if (!this.process) {
      return Result.ok();
    }

    try {
      this.process.kill('SIGTERM');
      this.process = null;
      this.currentProjectPath = null;
      this.logger.log('Claude CLI stopped');
      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to stop Claude CLI: ${error.message}`);
    }
  }

  isRunning(): boolean {
    return this.process !== null && !this.process.killed;
  }
}
