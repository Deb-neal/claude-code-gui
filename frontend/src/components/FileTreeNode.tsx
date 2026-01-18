'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import {
  VscChevronRight,
  VscChevronDown,
  VscFolder,
  VscFolderOpened,
  VscFile,
  VscFileCode,
} from 'react-icons/vsc';
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
} from 'react-icons/si';

interface FileTreeNodeProps {
  node: FileNode;
  level?: number;
  onSelect?: (node: FileNode) => void;
}

// 파일 확장자별 아이콘 매핑
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconClass = 'text-sm';

  switch (ext) {
    case 'ts':
    case 'tsx':
      return <SiTypescript className={`${iconClass} text-[#3178c6]`} />;
    case 'js':
    case 'jsx':
      return <SiJavascript className={`${iconClass} text-[#f7df1e]`} />;
    case 'json':
      return <SiJson className={`${iconClass} text-[#858585]`} />;
    case 'html':
      return <SiHtml5 className={`${iconClass} text-[#e34c26]`} />;
    case 'css':
    case 'scss':
    case 'sass':
      return <SiCss3 className={`${iconClass} text-[#1572b6]`} />;
    case 'md':
    case 'markdown':
      return <SiMarkdown className={`${iconClass} text-[#858585]`} />;
    default:
      return <VscFile className={`${iconClass} text-[#858585]`} />;
  }
};

export function FileTreeNode({ node, level = 0, onSelect }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFolder = node.type === 'directory';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    }
    onSelect?.(node);
  };

  return (
    <div>
      <div
        className="flex items-center gap-1 px-1 py-0.5 hover:bg-[#2a2d2e] cursor-pointer group text-[#cccccc] select-none"
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={handleClick}
      >
        {/* 폴더 확장 아이콘 */}
        {isFolder ? (
          <span className="text-[#cccccc] flex-shrink-0">
            {hasChildren ? (
              isExpanded ? (
                <VscChevronDown size={16} />
              ) : (
                <VscChevronRight size={16} />
              )
            ) : (
              <span className="w-4 inline-block"></span>
            )}
          </span>
        ) : (
          <span className="w-4 inline-block flex-shrink-0"></span>
        )}

        {/* 파일/폴더 아이콘 */}
        <span className="flex-shrink-0">
          {isFolder ? (
            isExpanded ? (
              <VscFolderOpened className="text-[#dcb67a]" size={16} />
            ) : (
              <VscFolder className="text-[#dcb67a]" size={16} />
            )
          ) : (
            getFileIcon(node.name)
          )}
        </span>

        {/* 파일/폴더 이름 */}
        <span className="text-[13px] text-[#cccccc] truncate font-[var(--font-geist-mono)]">
          {node.name}
        </span>
      </div>

      {/* 하위 항목 */}
      {isFolder && isExpanded && hasChildren && (
        <div>
          {node.children?.map((child, index) => (
            <FileTreeNode
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
