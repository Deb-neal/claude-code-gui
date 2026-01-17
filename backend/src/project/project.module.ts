import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/controllers/project.controller';
import { ProjectService } from './application/services/project.service';
import { ProjectRepository } from './infrastructure/project.repository';
import { FileSystemService } from './infrastructure/file-system.service';
import { PROJECT_REPOSITORY } from './domain/interfaces/project.repository.interface';
import { FILE_SYSTEM_SERVICE } from './domain/interfaces/file-system.service.interface';

/**
 * Project Module
 * 프로젝트 관리를 담당하는 독립적인 모듈
 *
 * 계층 구조:
 * - Presentation: ProjectController
 * - Application: ProjectService
 * - Infrastructure: ProjectRepository, FileSystemService
 * - Domain: Entities, Value Objects, Interfaces
 */
@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: FILE_SYSTEM_SERVICE,
      useClass: FileSystemService,
    },
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
