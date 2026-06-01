"use client";

import Image from "next/image";

interface FaqRow {
  question: string;
  ratio: string;
  count: string;
  answered: "성공" | "실패";
  reason: string;
}

// Figma 557-11354 표 데이터
const FAQ_ROWS: FaqRow[] = [
  { question: "자세한 역할", ratio: "40%", count: "16회", answered: "성공", reason: "X" },
  { question: "트러블 슈팅 해결과정", ratio: "30%", count: "6회", answered: "성공", reason: "X" },
  { question: "프로젝트 경과 및 통계", ratio: "20%", count: "8회", answered: "실패", reason: "해당 정보 부족" },
  { question: "협업 과정", ratio: "5%", count: "2회", answered: "성공", reason: "X" },
  { question: "팀원 간의 갈등", ratio: "5%", count: "2회", answered: "실패", reason: "해당 정보 부족" },
  { question: "그 외...", ratio: "n%", count: "n회", answered: "성공", reason: "X" },
  { question: "그 외...", ratio: "n%", count: "n회", answered: "성공", reason: "X" },
];

interface FaqPanelProps {
  onClose: () => void;
}

// Figma 551-10963 (빈) / 557-11354 (표) · 자주 들어온 질문 바텀시트
export default function FaqPanel({ onClose }: FaqPanelProps) {
  const rows = FAQ_ROWS;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-[520px] flex-col border-t border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <div className="flex items-center justify-between px-8 pb-4 pt-8">
        <h2 className="text-[24px] font-semibold tracking-[-1px] text-white">
          자주 들어온 질문
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex size-9 items-center justify-center rounded-[6px] hover:bg-white/5"
        >
          <Image src="/upload/icon-x.svg" alt="" width={20} height={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-8 sm:px-8">
        {rows.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-[8px] border border-[var(--color-border)]">
            <p className="text-[16px] text-[var(--color-muted)]">
              아직 AI를 이용한 질문이 없습니다.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[14px] text-[var(--color-muted)]">
                <th className="py-3 pr-4 font-medium">질문</th>
                <th className="py-3 pr-4 font-medium">비율</th>
                <th className="py-3 pr-4 font-medium">횟수</th>
                <th className="py-3 pr-4 font-medium">답변 여부</th>
                <th className="py-3 font-medium">답변 실패 원인</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--color-border)] text-[14px] text-white"
                >
                  <td className="py-3 pr-4">{row.question}</td>
                  <td className="py-3 pr-4">{row.ratio}</td>
                  <td className="py-3 pr-4">{row.count}</td>
                  <td className="py-3 pr-4">{row.answered}</td>
                  <td className="py-3 text-[var(--color-muted)]">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
