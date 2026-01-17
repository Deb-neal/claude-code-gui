import { Result } from '../../../shared/domain/result';

/**
 * Claude CLI Service Interface
 * Claude Code CLI 실행 및 통신을 추상화
 */
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  isComplete: boolean;
}

export interface IClaudeCliService {
  /**
   * Claude CLI 프로세스 시작
   */
  start(projectPath: string): Promise<Result<void>>;

  /**
   * 메시지 전송 및 스트리밍 응답 수신
   */
  sendMessage(
    message: string,
    onChunk: (chunk: string) => void,
  ): Promise<Result<string>>;

  /**
   * CLI 프로세스 종료
   */
  stop(): Promise<Result<void>>;

  /**
   * 프로세스 상태 확인
   */
  isRunning(): boolean;
}

export const CLAUDE_CLI_SERVICE = Symbol('IClaudeCliService');
