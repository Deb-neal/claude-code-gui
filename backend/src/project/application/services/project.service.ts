import { Inject, Injectable } from '@nestjs/common';
import { Project } from '../../domain/entities/project.entity';
import type { IProjectRepository } from '../../domain/interfaces/project.repository.interface';
import { PROJECT_REPOSITORY } from '../../domain/interfaces/project.repository.interface';
import type { IFileSystemService } from '../../domain/interfaces/file-system.service.interface';
import { FILE_SYSTEM_SERVICE } from '../../domain/interfaces/file-system.service.interface';
import {
  ProjectResponseDto,
  FileNodeDto,
  FileContentDto,
} from '../dto/select-project.dto';
import { Result } from '../../../shared/domain/result';

/**
 * Project Application Service
 * 유즈케이스를 구현하는 애플리케이션 계층 서비스
 */
@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(FILE_SYSTEM_SERVICE)
    private readonly fileSystemService: IFileSystemService,
  ) {}

  async selectProject(path: string): Promise<ProjectResponseDto> {
    // 1. 경로 유효성 검증
    const validationResult = await this.fileSystemService.validatePath(path);
    if (validationResult.isFailure) {
      throw new Error(validationResult.getError());
    }

    // 2. 프로젝트 엔티티 생성
    const projectName = path.split('/').pop() || 'Unknown';
    const project = Project.create({
      name: projectName,
      path,
    });

    // 3. 저장
    const saveResult = await this.projectRepository.save(project);
    if (saveResult.isFailure) {
      throw new Error(saveResult.getError());
    }

    // 4. DTO로 변환하여 반환
    return saveResult.getValue().toJSON();
  }

  async getFileTree(projectId: string): Promise<FileNodeDto[]> {
    // 1. 프로젝트 조회
    const projectResult = await this.projectRepository.findById(projectId);
    if (projectResult.isFailure) {
      throw new Error(projectResult.getError());
    }

    const project = projectResult.getValue();

    // 2. 마지막 접근 시간 업데이트
    project.updateLastAccessed();
    await this.projectRepository.save(project);

    // 3. 파일 트리 생성
    const fileTreeResult = await this.fileSystemService.buildFileTree(
      project.path,
    );
    if (fileTreeResult.isFailure) {
      throw new Error(fileTreeResult.getError());
    }

    // 4. DTO로 변환
    return fileTreeResult.getValue().map((node) => node.toJSON());
  }

  async getFileContent(
    projectId: string,
    filePath: string,
  ): Promise<FileContentDto> {
    // 1. 프로젝트 조회
    const projectResult = await this.projectRepository.findById(projectId);
    if (projectResult.isFailure) {
      throw new Error(projectResult.getError());
    }

    const project = projectResult.getValue();

    // 2. 보안: 프로젝트 경로 밖의 파일 접근 방지
    const fullPath = `${project.path}${filePath}`;
    if (!fullPath.startsWith(project.path)) {
      throw new Error('잘못된 파일 경로입니다');
    }

    // 3. 파일 내용 읽기
    const contentResult =
      await this.fileSystemService.readFileContent(fullPath);
    if (contentResult.isFailure) {
      throw new Error(contentResult.getError());
    }

    return {
      path: filePath,
      content: contentResult.getValue(),
    };
  }
}
