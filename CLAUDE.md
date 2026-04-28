# CLAUDE.md — Posta Frontend

## 프로젝트 개요

**포스타(Posta)** 는 챗봇 기반 대화형 포트폴리오 서비스다.
지원자가 등록한 Q&A를 바탕으로 인사담당자의 질문에 실시간 응답한다.

- **팀명:** 0(영)
- **기간:** 2026.04.14 ~ 2026.06.12
- **담당:** 프론트엔드

---

## 기술 스택

| 역할          | 기술                    |
| ------------- | ----------------------- |
| 프레임워크    | Next.js 14 (App Router) |
| 스타일링      | Tailwind CSS            |
| 상태관리      | Zustand                 |
| 언어          | TypeScript              |
| 패키지 매니저 | pnpm                    |

---

## 디렉토리 구조

```
src/
├── app/                  # Next.js App Router 페이지
│   ├── (auth)/           # 로그인, 회원가입
│   ├── feed/             # 포트폴리오 피드
│   ├── portfolio/
│   │   └── [id]/         # 포트폴리오 상세 + 챗봇
│   └── layout.tsx
├── components/
│   ├── chat/             # 챗봇 UI 컴포넌트
│   ├── feed/             # 피드 카드, 그리드/스크롤 뷰
│   └── ui/               # 공통 컴포넌트 (Button, Input 등)
├── store/                # Zustand 스토어
│   ├── chatStore.ts
│   └── portfolioStore.ts
├── hooks/                # 커스텀 훅
├── lib/                  # API 클라이언트, 유틸
└── types/                # 공통 타입 정의
```

---

## 상태관리 (Zustand)

스토어는 `src/store/`에 기능 단위로 분리한다.

```ts
// 예시: chatStore.ts
interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}
```

- 서버 상태(fetch/캐싱)는 Zustand가 아닌 Next.js `fetch` + `cache`로 처리한다.
- 클라이언트 전용 UI 상태(모달 열림 여부, 선택된 뷰 모드 등)만 Zustand에 둔다.
- `persist` 미들웨어는 명시적으로 필요한 경우에만 사용한다.

---

## 스타일 규칙 (Tailwind CSS)

- 인라인 클래스 우선, 별도 CSS 파일은 꼭 필요한 경우만 작성한다.
- 반응형은 모바일 우선(`sm:` → `md:` → `lg:`) 으로 작성한다.
- 색상·간격 등 디자인 토큰은 `tailwind.config.ts`의 `theme.extend`에 정의한다.
- `cn()` 유틸(clsx + tailwind-merge)을 사용해 조건부 클래스를 처리한다.

```ts
// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 컴포넌트 작성 규칙

- 모든 컴포넌트는 named export로 작성한다. (`export default` 금지)
- Props 타입은 컴포넌트 파일 상단에 `interface`로 정의한다.
- 서버 컴포넌트가 기본값이며, 클라이언트 상태가 필요한 경우에만 `'use client'`를 선언한다.
- 컴포넌트 파일 하나에 하나의 컴포넌트만 둔다.

```tsx
// 올바른 예시
interface PortfolioCardProps {
  id: string
  name: string
  summary: string
}

export function PortfolioCard({ id, name, summary }: PortfolioCardProps) {
  return (...)
}
```

---

## API 통신

- 백엔드 API base URL은 환경변수 `NEXT_PUBLIC_API_URL`로 관리한다.
- 서버 컴포넌트에서는 Next.js `fetch`를 직접 사용한다.
- 클라이언트 컴포넌트에서는 `src/lib/api.ts`의 공통 클라이언트를 사용한다.
- 에러는 반드시 처리하고, 로딩 상태는 Zustand 또는 `useTransition`으로 관리한다.

---

## 환경변수

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_CLAUDE_API_URL=...   # 챗봇 API 엔드포인트
```

`.env.local`은 커밋하지 않는다. `.env.example`만 레포에 포함한다.

---

## 코드 스타일

- 들여쓰기: 스페이스 2칸
- 따옴표: 작은따옴표(`'`)
- 세미콜론: 없음
- 포매터: Prettier, 린터: ESLint (Next.js 기본 설정)
- 커밋 전 `pnpm lint && pnpm build` 통과 확인

---

## 주요 페이지 & 기능

### 포트폴리오 피드 (`/feed`)

- 그리드 뷰 / 스크롤 뷰 전환 (Zustand로 뷰 모드 관리)
- 무한 스크롤 또는 페이지네이션

### 포트폴리오 상세 + 챗봇 (`/portfolio/[id]`)

- 포트폴리오 정보 표시
- 챗봇 인터페이스: 메시지 입력 → Claude API 응답 스트리밍
- 대화 히스토리는 세션 단위로 유지 (chatStore)

---

## 브랜치 전략

```
main         # 배포 브랜치
dev          # 통합 개발 브랜치
feat/[이름]  # 기능 개발
fix/[이름]   # 버그 수정
```

- PR은 반드시 `dev`로 올리고, 팀원 1명 이상 리뷰 후 머지한다.
