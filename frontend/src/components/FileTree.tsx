'use client';

import { FileNode } from '@/types';
import { FileTreeNode } from './FileTreeNode';

interface FileTreeProps {
  files: FileNode[];
  onFileSelect?: (node: FileNode) => void;
}

export function FileTree({ files, onFileSelect }: FileTreeProps) {
  if (files.length === 0) {
    return (
      <div className="text-sm text-zinc-400 dark:text-zinc-600 p-2">
        파일이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {files.map((file, index) => (
        <FileTreeNode
          key={`${file.path}-${index}`}
          node={file}
          onSelect={onFileSelect}
        />
      ))}
    </div>
  );
}
