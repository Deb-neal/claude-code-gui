import { IProjectRepository } from '../domain/interfaces/project.repository.interface';
import { Project } from '../domain/entities/project.entity';
import { Result } from '../../shared/domain/result';
export declare class ProjectRepository implements IProjectRepository {
    private readonly projects;
    save(project: Project): Promise<Result<Project>>;
    findById(id: string): Promise<Result<Project>>;
    delete(id: string): Promise<Result<void>>;
    findAll(): Promise<Result<Project[]>>;
}
