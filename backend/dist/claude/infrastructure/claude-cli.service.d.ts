import type { IClaudeCliService } from '../domain/interfaces/claude-cli.service.interface';
import { Result } from '../../shared/domain/result';
export declare class ClaudeCliService implements IClaudeCliService {
    private readonly logger;
    private process;
    private currentProjectPath;
    start(projectPath: string): Promise<Result<void>>;
    sendMessage(message: string, onChunk: (chunk: string) => void): Promise<Result<string>>;
    stop(): Promise<Result<void>>;
    isRunning(): boolean;
}
