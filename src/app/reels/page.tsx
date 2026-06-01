import ReelCard from "@/components/reels/ReelCard";
import ChatPanel from "@/components/ChatPanel";

// Figma 410-1720 / 222-4581 / 222-3967 · 포폴 릴스 (여러 사람 포트폴리오 세로 나열 + AI 질문 패널)
const reels = [
  { id: 1, username: "USER_NAME_01" },
  { id: 2, username: "iamnot_tyler_1999" },
  { id: 3, username: "Jin_Venus0801" },
  { id: 4, username: "Kevin_Jo" },
];

export default function ReelsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4 py-8 sm:gap-24 sm:px-8 sm:py-16 xl:gap-28 xl:pr-[140px]">
        {reels.map((reel) => (
          <ReelCard key={reel.id} id={reel.id} username={reel.username} />
        ))}
      </div>

      {/* 우측 AI 질문 패널 (포트폴리오 질문하기) */}
      <ChatPanel />
    </div>
  );
}
