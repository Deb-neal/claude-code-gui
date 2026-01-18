import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { IClaudeCliService } from '../domain/interfaces/claude-cli.service.interface';
import { Result } from '../../shared/domain/result';
import type { IFileSystemService } from '../../project/domain/interfaces/file-system.service.interface';
import { Inject } from '@nestjs/common';
import { FILE_SYSTEM_SERVICE } from '../../project/domain/interfaces/file-system.service.interface';

/**
 * Claude API Service (Tool Use 포함)
 * Anthropic API를 사용하여 Claude와 통신
 * Tool Use를 통해 파일 시스템 접근
 */
@Injectable()
export class ClaudeApiService implements IClaudeCliService {
  private readonly logger = new Logger(ClaudeApiService.name);
  private readonly client: Anthropic;
  private currentProjectPath: string | null = null;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(
    @Inject(FILE_SYSTEM_SERVICE)
    private readonly fileSystemService: IFileSystemService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.logger.log(`API Key loaded: ${apiKey ? 'Yes' : 'No'}`);

    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async start(projectPath: string): Promise<Result<void>> {
    try {
      this.currentProjectPath = projectPath;
      this.conversationHistory = [];
      this.logger.log(`Started Claude API for project: ${projectPath}`);
      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to start Claude API: ${error.message}`);
    }
  }

  async sendMessage(
    message: string,
    onChunk: (chunk: string) => void,
  ): Promise<Result<string>> {
    if (!this.currentProjectPath) {
      return Result.fail('Project path not set. Call start() first.');
    }

    try {
      // 사용자 메시지 추가
      this.conversationHistory.push({
        role: 'user',
        content: message,
      });

      let fullResponse = '';
      let toolUseInProgress = false;

      // Tool 정의
      const tools: Anthropic.Tool[] = [
        {
          name: 'read_file',
          description: '프로젝트의 파일을 읽습니다.',
          input_schema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '읽을 파일의 상대 경로 (예: src/app.ts)',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'write_file',
          description: '프로젝트의 파일을 생성하거나 수정합니다.',
          input_schema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '쓸 파일의 상대 경로',
              },
              content: {
                type: 'string',
                description: '파일에 쓸 내용',
              },
            },
            required: ['path', 'content'],
          },
        },
        {
          name: 'list_files',
          description: '프로젝트의 파일 목록을 가져옵니다.',
          input_schema: {
            type: 'object',
            properties: {},
          },
        },
      ];

      // 스트리밍 API 호출
      const stream = await this.client.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        messages: this.conversationHistory,
        tools,
        system: `당신은 프로젝트 폴더 "${this.currentProjectPath}"에서 작업하는 코딩 어시스턴트입니다.
파일을 읽고, 수정하고, 생성할 수 있습니다.
사용자가 요청하면 read_file, write_file, list_files 도구를 사용하세요.`,
      });

      // 스트리밍 처리
      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullResponse += chunk;
            onChunk(chunk);
          }
        }

        // Tool Use 감지
        if (event.type === 'content_block_start') {
          if (event.content_block.type === 'tool_use') {
            toolUseInProgress = true;
            this.logger.log(`Tool use detected: ${event.content_block.name}`);
          }
        }
      }

      const finalMessage = await stream.finalMessage();

      // Tool Use가 있으면 처리
      if (finalMessage.stop_reason === 'tool_use') {
        const toolResults = await this.handleToolUse(finalMessage);

        // Tool 결과를 포함하여 다시 요청
        this.conversationHistory.push({
          role: 'assistant',
          content: finalMessage.content,
        });

        this.conversationHistory.push({
          role: 'user',
          content: toolResults,
        });

        // 재귀적으로 다시 호출
        return this.sendMessage('계속해주세요', onChunk);
      }

      // 대화 히스토리에 추가
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
      });

      return Result.ok(fullResponse);
    } catch (error) {
      this.logger.error(`Claude API error: ${error.message}`);
      return Result.fail(`Failed to send message: ${error.message}`);
    }
  }

  private async handleToolUse(
    message: Anthropic.Message,
  ): Promise<Anthropic.ToolResultBlockParam[]> {
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of message.content) {
      if (block.type === 'tool_use') {
        const { id, name, input } = block;

        this.logger.log(`Executing tool: ${name} with input:`, input);

        let result: string;

        // input을 any로 타입 단언
        const toolInput = input as any;

        switch (name) {
          case 'read_file':
            result = await this.executeReadFile(toolInput.path as string);
            break;

          case 'write_file':
            result = await this.executeWriteFile(
              toolInput.path as string,
              toolInput.content as string,
            );
            break;

          case 'list_files':
            result = await this.executeListFiles();
            break;

          default:
            result = `Unknown tool: ${name}`;
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: id,
          content: result,
        });
      }
    }

    return toolResults;
  }

  private async executeReadFile(path: string): Promise<string> {
    const fullPath = `${this.currentProjectPath}/${path}`;
    const result = await this.fileSystemService.readFileContent(fullPath);

    if (result.isFailure) {
      return `Error: ${result.getError()}`;
    }

    return result.getValue();
  }

  private async executeWriteFile(
    path: string,
    content: string,
  ): Promise<string> {
    const fullPath = `${this.currentProjectPath}/${path}`;

    try {
      const fs = await import('fs/promises');
      await fs.writeFile(fullPath, content, 'utf-8');
      return `Successfully wrote to ${path}`;
    } catch (error) {
      return `Error writing file: ${error.message}`;
    }
  }

  private async executeListFiles(): Promise<string> {
    const result = await this.fileSystemService.buildFileTree(
      this.currentProjectPath!,
    );

    if (result.isFailure) {
      return `Error: ${result.getError()}`;
    }

    const files = result.getValue();
    return JSON.stringify(files, null, 2);
  }

  async stop(): Promise<Result<void>> {
    this.currentProjectPath = null;
    this.conversationHistory = [];
    this.logger.log('Claude API stopped');
    return Result.ok();
  }

  isRunning(): boolean {
    return this.currentProjectPath !== null;
  }
}
