import { IFileSystemService } from '../domain/interfaces/file-system.service.interface';
import { FileNode } from '../domain/value-objects/file-node.vo';
import { Result } from '../../shared/domain/result';
export declare class FileSystemService implements IFileSystemService {
    validatePath(dirPath: string): Promise<Result<void>>;
    buildFileTree(dirPath: string): Promise<Result<FileNode[]>>;
    readFileContent(filePath: string): Promise<Result<string>>;
    private buildFileTreeRecursive;
}
