'use client';

import { useChatStore } from '@/stores/chat-store';
import { useProjectStore } from '@/stores/project-store';
import { useState, useEffect, useRef } from 'react';
import { websocketService } from '@/services/websocket';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VscSend } from 'react-icons/vsc';

export function ChatInterface() {
  const {
    messages,
    addMessage,
    appendToMessage,
    setStreaming,
    isStreaming,
    sessionId,
    setSessionId,
    currentStreamingMessageId,
    setCurrentStreamingMessageId,
  } = useChatStore();
  const { currentProject } = useProjectStore();
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // WebSocket 연결
    const socket = websocketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    // 채팅 응답 리스너
    websocketService.onChatResponse((data) => {
      if (data.role === 'assistant' && data.isComplete) {
        setStreaming(false);
        setCurrentStreamingMessageId(null);
      }
    });

    // 스트리밍 청크 리스너
    websocketService.onChatStream((data) => {
      if (!currentStreamingMessageId) {
        const messageId = Date.now().toString();
        addMessage({
          id: messageId,
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
        });
        setCurrentStreamingMessageId(messageId);
      } else {
        appendToMessage(currentStreamingMessageId, data.content);
      }
    });

    // 에러 리스너
    websocketService.onSystemError((data) => {
      console.error('WebSocket error:', data.message);
      addMessage({
        id: Date.now().toString(),
        role: 'system',
        content: `Error: ${data.message}`,
        timestamp: Date.now(),
      });
      setStreaming(false);
    });

    // 세션 ID 생성
    if (!sessionId) {
      setSessionId(Date.now().toString());
    }

    // 프로젝트가 선택되면 채팅 시작
    if (currentProject && isConnected) {
      websocketService.startChat(currentProject.path);
    }

    return () => {
      websocketService.offChatResponse();
      websocketService.offChatStream();
      websocketService.offSystemError();
    };
  }, [currentProject, isConnected, sessionId, currentStreamingMessageId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || !sessionId) return;

    // 사용자 메시지 추가
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    });

    // WebSocket으로 메시지 전송
    websocketService.sendMessage(input, sessionId);
    setStreaming(true);
    setInput('');
  };

  return (
    <div className="w-96 flex flex-col bg-[#1e1e1e] border-l border-[#2b2b2b]">
      {/* 헤더 */}
      <header className="px-4 py-3 border-b border-[#2b2b2b] bg-[#252526]">
        <h1 className="text-sm font-medium text-[#cccccc]">
          Claude Chat
        </h1>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <p className="text-xs text-[#858585]">
                메시지를 입력하여 대화를 시작하세요
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-[#0e639c] text-white'
                      : message.role === 'system'
                      ? 'bg-[#f48771] bg-opacity-20 text-[#f48771] border border-[#f48771]'
                      : 'bg-[#252526] text-[#cccccc] border border-[#3c3c3c]'
                  }`}
                >
                  <div className="text-[13px] font-[var(--font-geist-mono)]">
                    {message.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                  margin: '0.5rem 0',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                }}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code
                                {...props}
                                className="bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#ce9178]"
                              >
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-[#cccccc]">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-white">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-[#2b2b2b] bg-[#1e1e1e] p-3">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="메시지 입력..."
              disabled={isStreaming}
              rows={3}
              className="w-full px-3 py-2 rounded border border-[#3c3c3c] bg-[#3c3c3c] text-[#cccccc] placeholder-[#858585] focus:outline-none focus:border-[#0e639c] disabled:opacity-50 resize-none font-[var(--font-geist-mono)] text-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="w-full px-3 py-2 bg-[#0e639c] text-white rounded hover:bg-[#1177bb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <VscSend size={14} />
              <span>전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
