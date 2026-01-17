import { Project } from '../entities/project.entity';
import { Result } from '../../../shared/domain/result';

/**
 * Project Repository Interface
 * 도메인 계층에서 정의, 인프라 계층에서 구현
 * 의존성 역전 원칙(DIP) 적용
 */
export interface IProjectRepository {
  save(project: Project): Promise<Result<Project>>;
  findById(id: string): Promise<Result<Project>>;
  delete(id: string): Promise<Result<void>>;
  findAll(): Promise<Result<Project[]>>;
}

export const PROJECT_REPOSITORY = Symbol('IProjectRepository');
