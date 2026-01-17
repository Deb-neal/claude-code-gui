import { ProjectService } from '../../application/services/project.service';
import { SelectProjectDto, ProjectResponseDto, FileNodeDto, FileContentDto } from '../../application/dto/select-project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    selectProject(dto: SelectProjectDto): Promise<ProjectResponseDto>;
    getFileTree(id: string): Promise<FileNodeDto[]>;
    getFileContent(id: string, filePath: string): Promise<FileContentDto>;
}
