import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // 채팅 시작
  startChat(projectPath: string) {
    this.socket?.emit('chat:start', { projectPath });
  }

  // 메시지 전송
  sendMessage(message: string, sessionId: string) {
    this.socket?.emit('chat:message', { message, sessionId });
  }

  // 채팅 종료
  stopChat() {
    this.socket?.emit('chat:stop');
  }

  // 이벤트 리스너 등록
  onChatResponse(callback: (data: any) => void) {
    this.socket?.on('chat:response', callback);
  }

  onChatStream(callback: (data: any) => void) {
    this.socket?.on('chat:stream', callback);
  }

  onSystemError(callback: (data: any) => void) {
    this.socket?.on('system:error', callback);
  }

  onSystemStatus(callback: (data: any) => void) {
    this.socket?.on('system:status', callback);
  }

  // 이벤트 리스너 제거
  offChatResponse() {
    this.socket?.off('chat:response');
  }

  offChatStream() {
    this.socket?.off('chat:stream');
  }

  offSystemError() {
    this.socket?.off('system:error');
  }

  offSystemStatus() {
    this.socket?.off('system:status');
  }
}

export const websocketService = new WebSocketService();
