"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingButtons from "@/components/profile/FloatingButtons";
import AskPanel from "@/components/profile/AskPanel";
import FaqPanel from "@/components/profile/FaqPanel";
import DeleteDialog from "@/components/profile/DeleteDialog";
import WriteStep from "@/components/upload/WriteStep";

type Panel = "ask" | "faq" | null;

// Figma 550-9398 외 · 내 포트폴리오 상세 (프로필에서 포트폴리오 선택 시 진입)
export default function PortfolioDetailPage() {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // 포트폴리오 수정 모드 (550-9258 / 550-9292) + 삭제 다이얼로그 (561-11948)
  if (editing) {
    return (
      <>
        <WriteStep
          mode="file"
          editable
          onComplete={() => setEditing(false)}
          onDelete={() => setShowDelete(true)}
        />
        {showDelete && (
          <DeleteDialog
            onCancel={() => setShowDelete(false)}
            onConfirm={() => {
              setShowDelete(false);
              setEditing(false);
              router.push("/profile");
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* 포트폴리오 본문 (디자인 이미지) */}
      <div className="mx-auto w-full max-w-[1840px]">
        <Image
          src="/profile/portfolio-full.png"
          alt="포트폴리오"
          width={1840}
          height={3680}
          className="h-auto w-full"
          priority
        />
      </div>

      {/* 우측 플로팅 버튼 */}
      <FloatingButtons
        onEdit={() => setEditing(true)}
        onFaq={() => setPanel("faq")}
        onAsk={() => setPanel("ask")}
      />

      {/* 바텀시트 패널 */}
      {panel === "ask" && <AskPanel onClose={() => setPanel(null)} />}
      {panel === "faq" && <FaqPanel onClose={() => setPanel(null)} />}
    </div>
  );
}
