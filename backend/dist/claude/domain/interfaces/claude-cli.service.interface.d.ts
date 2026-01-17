import { Result } from '../../../shared/domain/result';
export interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface ClaudeResponse {
    content: string;
    isComplete: boolean;
}
export interface IClaudeCliService {
    start(projectPath: string): Promise<Result<void>>;
    sendMessage(message: string, onChunk: (chunk: string) => void): Promise<Result<string>>;
    stop(): Promise<Result<void>>;
    isRunning(): boolean;
}
export declare const CLAUDE_CLI_SERVICE: unique symbol;
