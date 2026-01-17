import { Project, FileNode } from '@/types';

const API_BASE_URL = 'http://localhost:3001';

export const projectApi = {
  async selectProject(path: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/projects/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '프로젝트를 열 수 없습니다');
    }

    return response.json();
  },

  async getFileTree(projectId: string): Promise<FileNode[]> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/files`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '파일 트리를 불러올 수 없습니다');
    }

    return response.json();
  },

  async getFileContent(projectId: string, filePath: string): Promise<{ path: string; content: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/file?path=${encodeURIComponent(filePath)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '파일을 읽을 수 없습니다');
    }

    return response.json();
  },
};
