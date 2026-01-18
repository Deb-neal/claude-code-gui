'use client';

import { useState } from 'react';
import { FileTree } from './FileTree';
import { FileNode } from '@/types';
import { useProjectStore } from '@/stores/project-store';
import { useFileStore } from '@/stores/file-store';
import { projectApi } from '@/services/api';
import { VscFolder, VscFolderOpened } from 'react-icons/vsc';

export function Sidebar() {
  const { currentProject, setCurrentProject } = useProjectStore();
  const { setSelectedFile } = useFileStore();
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
    // 파일 선택 시 파일 스토어에 저장
    setSelectedFile(node);
  };

  return (
    <aside className="w-64 border-r border-[#2b2b2b] bg-[#1e1e1e] flex flex-col">
      {/* 프로젝트 선택 영역 */}
      <div className="p-3 border-b border-[#2b2b2b]">
        <div className="flex items-center gap-2 mb-3">
          <VscFolderOpened className="text-[#cccccc]" size={16} />
          <h2 className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">
            탐색기
          </h2>
        </div>

        {!showPathInput ? (
          <>
            <button
              onClick={() => setShowPathInput(true)}
              className="w-full px-3 py-1.5 text-xs bg-[#0e639c] text-white rounded hover:bg-[#1177bb] transition-colors"
            >
              프로젝트 열기
            </button>
            {currentProject && (
              <div className="mt-2 px-2 py-1.5 bg-[#252526] rounded">
                <div className="text-xs text-[#cccccc] truncate font-medium">
                  {currentProject.name}
                </div>
                <div className="text-xs text-[#858585] truncate mt-0.5">
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
              className="w-full px-2 py-1.5 text-xs border border-[#3c3c3c] rounded bg-[#3c3c3c] text-[#cccccc] placeholder-[#858585] focus:outline-none focus:border-[#0e639c]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenProject();
                if (e.key === 'Escape') setShowPathInput(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleOpenProject}
                disabled={isLoading}
                className="flex-1 px-2 py-1.5 text-xs bg-[#0e639c] text-white rounded hover:bg-[#1177bb] disabled:opacity-50"
              >
                {isLoading ? '로딩 중...' : '열기'}
              </button>
              <button
                onClick={() => setShowPathInput(false)}
                className="flex-1 px-2 py-1.5 text-xs border border-[#3c3c3c] text-[#cccccc] rounded hover:bg-[#2a2d2e]"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-xs text-[#f48771]">
            {error}
          </div>
        )}
      </div>

      {/* 파일 트리 영역 */}
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.length === 0 ? (
          <div className="text-xs text-[#858585] px-2">
            프로젝트를 선택해주세요
          </div>
        ) : (
          <FileTree files={fileTree} onFileSelect={handleFileSelect} />
        )}
      </div>
    </aside>
  );
}
