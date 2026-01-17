'use client';

import { useState } from 'react';
import { FileNode } from '@/types';

interface FileTreeNodeProps {
  node: FileNode;
  level?: number;
  onSelect?: (node: FileNode) => void;
}

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
        className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer group"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {/* 폴더 확장 아이콘 */}
        {isFolder && (
          <span className="text-zinc-400 dark:text-zinc-600 text-xs w-4">
            {hasChildren ? (isExpanded ? '▼' : '▶') : ''}
          </span>
        )}
        {!isFolder && <span className="w-4"></span>}

        {/* 파일/폴더 아이콘 */}
        <span className="text-sm">
          {isFolder ? '📁' : '📄'}
        </span>

        {/* 파일/폴더 이름 */}
        <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
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
