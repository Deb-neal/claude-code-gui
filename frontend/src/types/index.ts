export interface Project {
  id: string;
  name: string;
  path: string;
  createdAt: number;
  lastAccessedAt: number;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface CodeChange {
  id: string;
  filePath: string;
  oldContent: string;
  newContent: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ChatSession {
  id: string;
  projectId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface WebSocketMessage {
  type: 'chat:response' | 'code:change' | 'system:error' | 'system:status';
  payload: any;
}
