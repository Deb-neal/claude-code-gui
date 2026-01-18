import { ConfigService } from '@nestjs/config';
import type { IClaudeCliService } from '../domain/interfaces/claude-cli.service.interface';
import { Result } from '../../shared/domain/result';
import type { IFileSystemService } from '../../project/domain/interfaces/file-system.service.interface';
export declare class ClaudeApiService implements IClaudeCliService {
    private readonly fileSystemService;
    private readonly configService;
    private readonly logger;
    private readonly client;
    private currentProjectPath;
    private conversationHistory;
    constructor(fileSystemService: IFileSystemService, configService: ConfigService);
    start(projectPath: string): Promise<Result<void>>;
    sendMessage(message: string, onChunk: (chunk: string) => void): Promise<Result<string>>;
    private handleToolUse;
    private executeReadFile;
    private executeWriteFile;
    private executeListFiles;
    stop(): Promise<Result<void>>;
    isRunning(): boolean;
}
