'use client';

import { useFileStore } from '@/stores/file-store';
import { useProjectStore } from '@/stores/project-store';
import { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VscFile } from 'react-icons/vsc';
import { projectApi } from '@/services/api';

// 파일 확장자로 언어 감지
const getLanguageFromExtension = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    php: 'php',
    rb: 'ruby',
  };

  return languageMap[ext || ''] || 'text';
};

export function FileViewer() {
  const { selectedFile, fileContent, isLoadingContent, setFileContent, setLoadingContent } = useFileStore();
  const { currentProject } = useProjectStore();

  useEffect(() => {
    // 파일이 선택되고 파일 타입일 때만 내용 로드
    if (selectedFile && selectedFile.type === 'file' && currentProject) {
      loadFileContent();
    } else {
      setFileContent(null);
    }
  }, [selectedFile, currentProject]);

  const loadFileContent = async () => {
    if (!selectedFile || !currentProject) return;

    setLoadingContent(true);
    try {
      const data = await projectApi.getFileContent(currentProject.id, selectedFile.path);
      setFileContent(data.content);
    } catch (error) {
      console.error('Error loading file content:', error);
      setFileContent('파일을 읽을 수 없습니다.');
    } finally {
      setLoadingContent(false);
    }
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center text-[#858585]">
          <VscFile size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">파일을 선택해주세요</p>
        </div>
      </div>
    );
  }

  if (selectedFile.type === 'directory') {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center text-[#858585]">
          <p className="text-sm">폴더는 표시할 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      {/* 파일 헤더 */}
      <header className="px-4 py-2 border-b border-[#2b2b2b] bg-[#252526]">
        <div className="flex items-center gap-2">
          <VscFile className="text-[#858585]" size={16} />
          <span className="text-[13px] text-[#cccccc] font-[var(--font-geist-mono)]">
            {selectedFile.name}
          </span>
          <span className="text-xs text-[#858585]">
            {selectedFile.path}
          </span>
        </div>
      </header>

      {/* 파일 내용 */}
      <div className="flex-1 overflow-auto">
        {isLoadingContent ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[#858585] text-sm">로딩 중...</div>
          </div>
        ) : fileContent ? (
          <SyntaxHighlighter
            language={getLanguageFromExtension(selectedFile.name)}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '16px',
              background: '#1e1e1e',
              fontSize: '13px',
              fontFamily: 'var(--font-geist-mono)',
              height: '100%',
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#858585',
              userSelect: 'none',
            }}
          >
            {fileContent}
          </SyntaxHighlighter>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[#858585] text-sm">파일 내용을 불러올 수 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
