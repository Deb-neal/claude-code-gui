import type { IProjectRepository } from '../../domain/interfaces/project.repository.interface';
import type { IFileSystemService } from '../../domain/interfaces/file-system.service.interface';
import { ProjectResponseDto, FileNodeDto, FileContentDto } from '../dto/select-project.dto';
export declare class ProjectService {
    private readonly projectRepository;
    private readonly fileSystemService;
    constructor(projectRepository: IProjectRepository, fileSystemService: IFileSystemService);
    selectProject(path: string): Promise<ProjectResponseDto>;
    getFileTree(projectId: string): Promise<FileNodeDto[]>;
    getFileContent(projectId: string, filePath: string): Promise<FileContentDto>;
}
