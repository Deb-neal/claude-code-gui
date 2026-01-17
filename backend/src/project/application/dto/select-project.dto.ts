/**
 * Select Project DTO
 * API 요청/응답 데이터 전송 객체
 */
export class SelectProjectDto {
  path: string;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  path: string;
  createdAt: number;
  lastAccessedAt: number;
}

export class FileNodeDto {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNodeDto[];
}

export class FileContentDto {
  path: string;
  content: string;
}
