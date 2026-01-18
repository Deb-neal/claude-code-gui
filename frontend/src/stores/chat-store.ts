import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamingMessageId: string | null;
  sessionId: string | null;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  appendToMessage: (id: string, chunk: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setCurrentStreamingMessageId: (id: string | null) => void;
  setSessionId: (sessionId: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  currentStreamingMessageId: null,
  sessionId: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    })),

  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + chunk } : msg
      ),
    })),

  setStreaming: (isStreaming) => set({ isStreaming }),

  setCurrentStreamingMessageId: (id) => set({ currentStreamingMessageId: id }),

  setSessionId: (sessionId) => set({ sessionId }),

  clearMessages: () => set({
    messages: [],
    currentStreamingMessageId: null,
    sessionId: null
  }),
}));
