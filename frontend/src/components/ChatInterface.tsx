'use client';

import { useChatStore } from '@/stores/chat-store';
import { useState } from 'react';

export function ChatInterface() {
  const { messages, addMessage, isStreaming } = useChatStore();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    });

    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900">
      {/* 헤더 */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Claude Code
        </h1>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Claude Code에 오신 것을 환영합니다
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                메시지를 입력하여 대화를 시작하세요
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={isStreaming}
              className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
