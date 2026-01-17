# Claude Code GUI

Claude Code의 CLI 인터페이스를 GUI로 래핑한 로컬 웹 애플리케이션

## 프로젝트 개요

Claude Code는 강력한 agentic coding 도구이지만, 터미널 기반 인터페이스로 인해 시각적 확인이 불편합니다. 이 프로젝트는 Claude Code의 모든 기능을 직관적인 웹 인터페이스로 제공하여 개발자 경험을 향상시킵니다.

### Next.js를 선택한 이유
- **App Router**: 최신 React 패턴과 서버 컴포넌트 활용
- **빠른 개발 경험**: Hot Module Replacement, Fast Refresh
- **TypeScript 지원**: 기본 제공되는 강력한 타입 시스템
- **최적화**: 자동 이미지 최적화, 코드 스플리팅
- **확장 가능**: 필요시 Electron으로 쉽게 패키징 가능

## 주요 기능

### Phase 1 - MVP (Basic Features)
- [ ] 로컬 프로젝트 폴더 선택 및 관리
- [ ] Claude Code CLI 백엔드 통합
- [ ] 실시간 채팅 인터페이스
- [ ] 코드 변경사항 Diff 시각화
- [ ] 변경사항 승인/거부 기능
- [ ] 파일 트리 뷰어
- [ ] 대화 히스토리 저장

### Phase 2 - Advanced Features (Future)
- [ ] MCP (Model Context Protocol) 연동
- [ ] 여러 프로젝트 동시 관리
- [ ] 프롬프트 템플릿/프리셋
- [ ] 작업 히스토리 및 롤백
- [ ] VS Code 확장 통합

## 기술 스택

### Backend
- **NestJS** - TypeScript 기반 백엔드 프레임워크
- **WebSocket** - 실시간 통신
- **Child Process** - Claude Code CLI 실행

### Frontend
- **Next.js 14+** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링
- **React Query (TanStack Query)** - 서버 상태 관리
- **Monaco Editor** - 코드 에디터 (Diff 뷰)
- **Zustand** - 클라이언트 상태 관리

### 추후 고려사항
- **Electron** - 데스크톱 앱 패키징 (Optional)

## 프로젝트 구조

```
claude-code-gui/
├── backend/                 # NestJS 백엔드
│   ├── src/
│   │   ├── claude/         # Claude Code CLI 통합 모듈
│   │   ├── project/        # 프로젝트 관리 모듈
│   │   ├── chat/           # 채팅 WebSocket 모듈
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # App Router (Next.js 14+)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── project/
│   │   ├── components/    # React 컴포넌트
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # 유틸리티 함수
│   │   ├── services/      # API 서비스
│   │   ├── stores/        # Zustand 스토어
│   │   └── types/         # TypeScript 타입
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
└── README.md
```

## 핵심 기능 명세

### 1. 프로젝트 선택
- 사용자가 로컬 파일 시스템에서 프로젝트 폴더 선택
- 선택한 프로젝트의 파일 트리 표시
- 여러 프로젝트 북마크 기능

### 2. Claude Code 통신
- NestJS 백엔드에서 Claude Code CLI를 child process로 실행
- stdin/stdout을 통한 양방향 통신
- WebSocket으로 프론트엔드와 실시간 메시지 전달

### 3. 채팅 인터페이스
- 사용자 메시지 입력
- Claude의 응답 스트리밍 표시
- 코드 블록 하이라이팅
- 대화 히스토리 저장 및 불러오기

### 4. 코드 변경사항 관리
- Claude가 제안한 코드 변경사항 Diff 뷰로 표시
- 파일별 변경사항 탭
- 승인/거부 버튼
- 승인 시 실제 파일에 반영

### 5. 파일 시스템 뷰어
- 프로젝트 파일 트리
- 파일 클릭 시 내용 미리보기
- 검색 기능

## API 설계 (Backend)

### REST Endpoints
```
POST   /api/projects/select          # 프로젝트 폴더 선택
GET    /api/projects/:id/files       # 파일 트리 조회
GET    /api/projects/:id/file        # 특정 파일 내용 조회
POST   /api/chat/sessions            # 채팅 세션 생성
GET    /api/chat/sessions/:id        # 채팅 히스토리 조회
```

### WebSocket Events
```
Client -> Server:
- chat:message              # 사용자 메시지 전송
- code:approve              # 코드 변경 승인
- code:reject               # 코드 변경 거부

Server -> Client:
- chat:response             # Claude 응답 (스트리밍)
- code:change               # 코드 변경사항 제안
- system:error              # 에러 메시지
- system:status             # 상태 업데이트
```

## 개발 환경 설정

### 사전 요구사항
- Node.js 18+
- npm or yarn
- Claude Code CLI 설치

### 설치 및 실행

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

## 구현 우선순위

### Sprint 1 (1-2주)
1. NestJS 프로젝트 초기 세팅
2. 프로젝트 폴더 선택 API
3. 파일 트리 조회 기능
4. Next.js 프론트엔드 초기 세팅 (App Router)
5. 기본 레이아웃 및 페이지 구성

### Sprint 2 (1-2주)
1. Claude Code CLI 통합
2. WebSocket 통신 구현
3. 채팅 인터페이스 구현
4. 메시지 주고받기 기능

### Sprint 3 (1-2주)
1. 코드 변경사항 파싱
2. Diff 뷰어 구현 (Monaco Editor)
3. 승인/거부 기능
4. 실제 파일 반영 로직

### Sprint 4 (1주)
1. 히스토리 저장
2. 에러 핸들링
3. UI/UX 개선
4. 테스트 및 버그 수정

## 기술적 고려사항

### Claude Code CLI 통신
- Node.js의 `child_process.spawn`으로 CLI 실행
- stdin으로 명령어 전달, stdout으로 응답 수신
- 스트리밍 응답 처리를 위한 버퍼링 전략 필요

### 파일 시스템 접근
- 보안을 위해 특정 디렉토리만 접근 허용
- 민감한 파일(.env, .git 등) 필터링
- 대용량 파일 처리 최적화

### 실시간 통신
- WebSocket 재연결 로직
- 메시지 큐잉 및 순서 보장
- 타임아웃 처리

### 상태 관리
- 프론트엔드: React Query (서버 상태) + Zustand (클라이언트 상태)
- 백엔드: In-memory 세션 관리 (추후 Redis 고려)

## 보안 고려사항
- 파일 시스템 접근 권한 제한
- 입력 값 검증 및 sanitization
- CORS 설정
- 로컬 실행 전제이므로 인증은 Phase 2에서 고려

## 라이선스
MIT

## 기여
이슈 및 PR을 환영합니다.

## 연락처
개발자: MINSU
