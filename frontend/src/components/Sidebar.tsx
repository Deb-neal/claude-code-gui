'use client';

import { useState } from 'react';
import { FileTree } from './FileTree';
import { FileNode } from '@/types';
import { useProjectStore } from '@/stores/project-store';
import { projectApi } from '@/services/api';

export function Sidebar() {
  const { currentProject, setCurrentProject } = useProjectStore();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPathInput, setShowPathInput] = useState(false);
  const [projectPath, setProjectPath] = useState('');

  const handleOpenProject = async () => {
    if (!projectPath.trim()) {
      setError('프로젝트 경로를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const project = await projectApi.selectProject(projectPath);
      setCurrentProject(project);

      const files = await projectApi.getFileTree(project.id);
      setFileTree(files);
      setShowPathInput(false);
      setProjectPath('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트를 열 수 없습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (node: FileNode) => {
    console.log('Selected:', node.path);
    // TODO: 파일 내용을 표시하거나 다른 작업 수행
  };

  return (
    <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      {/* 프로젝트 선택 영역 */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          프로젝트
        </h2>

        {!showPathInput ? (
          <>
            <button
              onClick={() => setShowPathInput(true)}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로젝트 열기
            </button>
            {currentProject && (
              <div className="mt-3">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                  {currentProject.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                  {currentProject.path}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              placeholder="/Users/username/project"
              className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenProject();
                if (e.key === 'Escape') setShowPathInput(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleOpenProject}
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '로딩 중...' : '열기'}
              </button>
              <button
                onClick={() => setShowPathInput(false)}
                className="flex-1 px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* 파일 트리 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
          파일 탐색기
        </h3>
        {fileTree.length === 0 ? (
          <div className="text-sm text-zinc-400 dark:text-zinc-600">
            프로젝트를 선택해주세요
          </div>
        ) : (
          <FileTree files={fileTree} onFileSelect={handleFileSelect} />
        )}
      </div>
    </aside>
  );
}
