"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const AI_REPLY =
  "답변입니다. 새롭고 놀랍습니다. 숨겨진 사실이 있었습니다. 그걸 말해보고자 합니다. 답변입니다. 새롭고 놀랍습니다. 숨겨진 사실이 있었습니다. 그걸 말해보고자 합니다.";

interface AskPanelProps {
  onClose: () => void;
}

// Figma 550-9214 (빈) / 551-9972 (대화) · AI에게 질문하기 바텀시트
export default function AskPanel({ onClose }: AskPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }, { role: "ai", text: AI_REPLY }]);
    setInput("");
  };

  const hasChat = messages.length > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-[520px] flex-col border-t border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-[6px] hover:bg-white/5"
      >
        <Image src="/upload/icon-x.svg" alt="" width={20} height={20} />
      </button>

      {hasChat ? (
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-4 pt-16">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[448px] rounded-2xl bg-[var(--color-ink)] px-4 py-4 text-white">
                    <p className="text-[16px] leading-6">{m.text}</p>
                  </div>
                ) : (
                  <p className="max-w-[448px] whitespace-pre-wrap px-4 py-4 text-[16px] leading-6 text-white">
                    {m.text}
                  </p>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <Image src="/profile/icon-chat.svg" alt="" width={32} height={32} />
          <p className="text-[24px] font-semibold text-white">
            포트폴리오에서 궁금한 부분을 물어보세요
          </p>
          <p className="text-[16px] text-[var(--color-muted)]">
            자세한 역할, 트러블 슈팅, 기여도 ...
          </p>
        </div>
      )}

      {/* 입력 바 */}
      <div className="px-6 pb-8 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex h-12 w-full max-w-[1000px] items-center gap-2 rounded-2xl bg-[#464645] px-5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="무엇이든 물어보세요..."
            className="h-full flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#a8a8a6]"
          />
          <button
            type="submit"
            aria-label="전송"
            className="flex size-8 items-center justify-center rounded-full"
          >
            <Image src="/profile/icon-send.svg" alt="" width={18} height={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
