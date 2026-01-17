import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ProjectService } from '../../application/services/project.service';
import {
  SelectProjectDto,
  ProjectResponseDto,
  FileNodeDto,
  FileContentDto,
} from '../../application/dto/select-project.dto';

/**
 * Project Controller
 * REST API 엔드포인트를 제공하는 Presentation 계층
 */
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('select')
  async selectProject(
    @Body() dto: SelectProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.selectProject(dto.path);
  }

  @Get(':id/files')
  async getFileTree(@Param('id') id: string): Promise<FileNodeDto[]> {
    return this.projectService.getFileTree(id);
  }

  @Get(':id/file')
  async getFileContent(
    @Param('id') id: string,
    @Query('path') filePath: string,
  ): Promise<FileContentDto> {
    return this.projectService.getFileContent(id, filePath);
  }
}
