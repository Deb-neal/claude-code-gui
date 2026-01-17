import { FileNode } from '../value-objects/file-node.vo';
import { Result } from '../../../shared/domain/result';

/**
 * File System Service Interface
 * 파일 시스템 접근을 추상화
 */
export interface IFileSystemService {
  validatePath(path: string): Promise<Result<void>>;
  buildFileTree(path: string): Promise<Result<FileNode[]>>;
  readFileContent(path: string): Promise<Result<string>>;
}

export const FILE_SYSTEM_SERVICE = Symbol('IFileSystemService');
