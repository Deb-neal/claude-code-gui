import { Project } from '../entities/project.entity';
import { Result } from '../../../shared/domain/result';
export interface IProjectRepository {
    save(project: Project): Promise<Result<Project>>;
    findById(id: string): Promise<Result<Project>>;
    delete(id: string): Promise<Result<void>>;
    findAll(): Promise<Result<Project[]>>;
}
export declare const PROJECT_REPOSITORY: unique symbol;
