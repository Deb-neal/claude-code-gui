import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../domain/interfaces/project.repository.interface';
import { Project } from '../domain/entities/project.entity';
import { Result } from '../../shared/domain/result';

/**
 * In-Memory Project Repository Implementation
 * 실제 프로덕션에서는 DB (PostgreSQL, MongoDB 등)를 사용
 * 지금은 간단하게 메모리에 저장
 */
@Injectable()
export class ProjectRepository implements IProjectRepository {
  private readonly projects: Map<string, Project> = new Map();

  async save(project: Project): Promise<Result<Project>> {
    try {
      this.projects.set(project.id, project);
      return Result.ok(project);
    } catch (error) {
      return Result.fail(`프로젝트를 저장할 수 없습니다: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Result<Project>> {
    const project = this.projects.get(id);
    if (!project) {
      return Result.fail(`프로젝트를 찾을 수 없습니다: ${id}`);
    }
    return Result.ok(project);
  }

  async delete(id: string): Promise<Result<void>> {
    if (!this.projects.has(id)) {
      return Result.fail(`프로젝트를 찾을 수 없습니다: ${id}`);
    }
    this.projects.delete(id);
    return Result.ok();
  }

  async findAll(): Promise<Result<Project[]>> {
    return Result.ok(Array.from(this.projects.values()));
  }
}
