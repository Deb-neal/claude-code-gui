import { FileNode } from '../value-objects/file-node.vo';
import { Result } from '../../../shared/domain/result';
export interface IFileSystemService {
    validatePath(path: string): Promise<Result<void>>;
    buildFileTree(path: string): Promise<Result<FileNode[]>>;
    readFileContent(path: string): Promise<Result<string>>;
}
export declare const FILE_SYSTEM_SERVICE: unique symbol;
