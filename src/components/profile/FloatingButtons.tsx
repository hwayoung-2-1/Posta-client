"use client";

import Image from "next/image";

interface FloatingButtonsProps {
  onEdit: () => void;
  onFaq: () => void;
  onAsk: () => void;
}

const items = [
  { key: "edit", label: "포트폴리오 수정", icon: "/profile/icon-pencil.svg" },
  { key: "faq", label: "자주 들어온 질문", icon: "/profile/icon-question.svg" },
  { key: "ask", label: "AI에게 질문하기", icon: "/profile/icon-sparkles.svg" },
];

// Figma 550-9398 · 우측 플로팅 액션 버튼 3개
export default function FloatingButtons({ onEdit, onFaq, onAsk }: FloatingButtonsProps) {
  const handlers: Record<string, () => void> = { edit: onEdit, faq: onFaq, ask: onAsk };

  return (
    <div className="fixed right-10 top-1/2 z-30 flex w-60 -translate-y-1/2 flex-col gap-6">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={handlers[item.key]}
          className="flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-2 border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 shadow-lg transition-colors hover:bg-white/5"
        >
          <Image src={item.icon} alt="" width={20} height={20} />
          <span className="text-[16px] font-semibold text-[var(--color-fg)]">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
