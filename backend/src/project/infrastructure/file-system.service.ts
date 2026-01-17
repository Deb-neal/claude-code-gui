import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IFileSystemService } from '../domain/interfaces/file-system.service.interface';
import { FileNode } from '../domain/value-objects/file-node.vo';
import { Result } from '../../shared/domain/result';

/**
 * File System Service Implementation
 * 파일 시스템 접근을 구현하는 인프라 계층 서비스
 */
@Injectable()
export class FileSystemService implements IFileSystemService {
  async validatePath(dirPath: string): Promise<Result<void>> {
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return Result.fail('선택한 경로가 디렉토리가 아닙니다');
      }
      return Result.ok();
    } catch (error) {
      return Result.fail(`경로를 확인할 수 없습니다: ${error.message}`);
    }
  }

  async buildFileTree(dirPath: string): Promise<Result<FileNode[]>> {
    try {
      const nodes = await this.buildFileTreeRecursive(dirPath, dirPath);
      return Result.ok(nodes);
    } catch (error) {
      return Result.fail(`파일 트리를 생성할 수 없습니다: ${error.message}`);
    }
  }

  async readFileContent(filePath: string): Promise<Result<string>> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return Result.ok(content);
    } catch (error) {
      return Result.fail(`파일을 읽을 수 없습니다: ${error.message}`);
    }
  }

  private async buildFileTreeRecursive(
    dirPath: string,
    basePath: string,
  ): Promise<FileNode[]> {
    const items = await fs.readdir(dirPath);
    const nodes: FileNode[] = [];

    // 숨김 파일과 node_modules 제외
    const filteredItems = items.filter(
      (item) => !item.startsWith('.') && item !== 'node_modules',
    );

    for (const item of filteredItems) {
      const fullPath = path.join(dirPath, item);
      const relativePath = fullPath.replace(basePath, '');
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        const children = await this.buildFileTreeRecursive(fullPath, basePath);
        nodes.push(FileNode.createDirectory(item, relativePath, children));
      } else {
        nodes.push(FileNode.createFile(item, relativePath));
      }
    }

    // 정렬: 디렉토리 먼저, 그다음 파일 (알파벳순)
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return nodes;
  }
}
