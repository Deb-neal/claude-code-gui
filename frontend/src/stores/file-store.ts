import { create } from 'zustand';
import { FileNode } from '@/types';

interface FileState {
  selectedFile: FileNode | null;
  fileContent: string | null;
  isLoadingContent: boolean;
  setSelectedFile: (file: FileNode | null) => void;
  setFileContent: (content: string | null) => void;
  setLoadingContent: (isLoading: boolean) => void;
}

export const useFileStore = create<FileState>((set) => ({
  selectedFile: null,
  fileContent: null,
  isLoadingContent: false,

  setSelectedFile: (file) => set({ selectedFile: file }),
  setFileContent: (content) => set({ fileContent: content }),
  setLoadingContent: (isLoading) => set({ isLoadingContent: isLoading }),
}));
