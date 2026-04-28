"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const dummyMessages = [
  { role: "user", text: "임마 뭐 할줄아노" },
  {
    role: "ai",
    text: "주요 직무는 UX/UI 디자이너로, Figma가 주요 기술입니다.\n추가로 Adobe Illustrator, Photoshop의 그래픽 디자인 기술도 보유하고 있습니다.\n나열된 프로젝트 A, B, C에 UX/UI 디자이너로 참여했습니다.",
  },
  { role: "user", text: "프론트엔드 안되노?" },
  { role: "ai", text: "Front-End는 주요 직군이 아니지만, 퍼블리싱까지는 가능합니다." },
  { role: "user", text: "자격증이나 수상경력은 없노?" },
  {
    role: "ai",
    text: "자격증으로는 선생님몰래잠자기기능사 자격증을 취득했습니다.\n(자격증번호: 1Q2W3E4R)\n\n수상 경력은 기원전 200년, 동굴벽화협회에서 개최한 벽화예술대회에서 대상을 수상했습니다.",
  },
  { role: "user", text: "프로젝트 뭐 해봄?" },
  {
    role: "ai",
    text: "참여 프로젝트는 다음과 같습니다:\n1. 내계정의문단속\n2. 마이서치\n3. 북한사이버부대 X 마루",
  },
];

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(dummyMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-8 z-20 flex size-9 items-center justify-center rounded-l-[6px]"
        style={{ background: "var(--color-primary)" }}
      >
        <Image
          src="/chevrons-right.svg"
          alt="패널 열기"
          width={12}
          height={11}
          className="rotate-180"
        />
      </button>
    );
  }

  return (
    <div
      className="fixed right-0 top-0 z-20 flex h-screen w-[496px] flex-col border-l"
      style={{ background: "#2a2a29", borderColor: "var(--color-border)" }}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute left-[31px] top-8 flex size-9 items-center justify-center rounded-[6px]"
        style={{ background: "var(--color-primary)" }}
      >
        <Image src="/chevrons-right.svg" alt="패널 닫기" width={12} height={11} />
      </button>

      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain pt-20">
        <div className="flex-1" />
        <div className="flex flex-col gap-4 p-6 pb-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <div
                  className="max-w-[448px] rounded-2xl px-4 py-4 text-white"
                  style={{ background: "#181817" }}
                >
                  <p className="text-base leading-6">{msg.text}</p>
                </div>
              ) : (
                <p className="max-w-[448px] px-4 py-4 text-base leading-6 text-white whitespace-pre-wrap">
                  {msg.text}
                </p>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>


      <form onSubmit={handleSubmit} className="p-6 pt-4">
        <div
          className="flex h-12 items-center rounded-2xl px-5"
          style={{ background: "#464645" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="무엇이든 물어보세요..."
            className="flex-1 bg-transparent text-base leading-6 text-white outline-none placeholder:text-[#a8a8a6]"
          />
        </div>
      </form>
    </div>
  );
}
