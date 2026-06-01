"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "./Button";

type Selection = "intro" | number;

interface WriteStepProps {
  mode: "file" | "link";
  totalPages?: number; // 링크 모드 표기용 (예: 31)
  onComplete: () => void;
  /** 프로필 "포트폴리오 수정" 모드 — 삭제하기 버튼 노출 (Figma 550-9258/550-9292) */
  editable?: boolean;
  onDelete?: () => void;
}

const filePages = [
  { n: 1, src: "/upload/page-1.png" },
  { n: 2, src: "/upload/page-2.png" },
  { n: 3, src: "/upload/page-3.png" },
  { n: 4, src: "/upload/page-4.png" },
  { n: 5, src: "/upload/page-5.png" },
];

const introPreview = [
  "작성된 포트폴리오 소개글입니다.",
  "작성된 포트폴리오 소개글입니다.",
  "작성된 포트폴리오 소개글입니다.",
  "작성된 포트폴리오 소개글입니다.",
];

// 333-1696 / 423-2299 / 361-1825 · 포트폴리오 소개 · 페이지별 상세 작성
export default function WriteStep({
  mode,
  totalPages = 31,
  onComplete,
  editable = false,
  onDelete,
}: WriteStepProps) {
  const [selected, setSelected] = useState<Selection>(mode === "link" ? 1 : "intro");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const key = mode === "link" ? "link" : String(selected);
  const isIntro = mode === "file" && selected === "intro";

  const title = isIntro ? "포트폴리오 소개" : `Page ${mode === "link" ? 1 : selected}/${totalPages}`;
  const subtitle = isIntro
    ? "포트폴리오에 대한 간단한 소개를 작성해주세요."
    : "해당 페이지에 대한 세부적인 내용을 작성해주세요.";
  const placeholder = isIntro ? "포트폴리오 소개, 슬로건, 등..." : "프로젝트 세부 설명, 뒷이야기, 등...";

  return (
    <div className="flex min-h-full justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div className="flex w-full max-w-[1336px] flex-col items-stretch gap-6 lg:flex-row lg:items-start">
        {/* 왼쪽: 페이지 리스트 (파일) / 임베드 미리보기 (링크) */}
        {mode === "file" ? (
          <div className="flex w-full flex-col items-end gap-5 lg:w-[536px] lg:shrink-0">
            <DescriptionCard
              active={isIntro}
              onClick={() => setSelected("intro")}
            />
            {filePages.map((page) => (
              <PageThumb
                key={page.n}
                n={page.n}
                src={page.src}
                active={selected === page.n}
                onClick={() => setSelected(page.n)}
              />
            ))}
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full max-w-[960px] shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-border)] lg:h-[540px] lg:aspect-auto">
            <div className="absolute left-1/2 top-[calc(50%+36px)] h-[456px] w-[720px] max-w-none -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/upload/notion-embed.png"
                alt="포트폴리오 링크 미리보기"
                fill
                className="object-cover"
                sizes="720px"
              />
            </div>
          </div>
        )}

        {/* 오른쪽: 작성 에디터 */}
        <div className="flex min-h-[420px] w-full flex-1 flex-col items-end gap-6 lg:h-[952px] lg:min-h-0 lg:w-[776px] lg:flex-none">
          <div className="flex w-full flex-col items-start gap-2 text-white">
            <h2 className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px]">
              {title}
            </h2>
            <p className="text-[16px] font-normal leading-6">{subtitle}</p>
          </div>
          <textarea
            value={drafts[key] ?? ""}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full flex-1 resize-none rounded-[8px] border border-[var(--color-border)] p-[10px] text-[16px] font-medium leading-6 text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-border-strong)]"
          />
          <div className="flex items-center gap-4">
            {editable && (
              <button
                type="button"
                onClick={onDelete}
                className="flex h-10 w-[200px] items-center justify-center rounded-[6px] bg-[#e5484d] px-5 text-[14px] font-medium text-white"
              >
                삭제하기
              </button>
            )}
            <Button onClick={onComplete}>작성 완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DescriptionCardProps {
  active: boolean;
  onClick: () => void;
}

function DescriptionCard({ active, onClick }: DescriptionCardProps) {
  return (
    <div className="w-full pl-14">
      <button
        type="button"
        onClick={onClick}
        className={`flex aspect-[480/270] w-full max-w-[480px] cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-[8px] bg-[var(--color-ink)] p-8 text-left text-white sm:p-16 ${
          active
            ? "border-8 border-[var(--color-accent)]"
            : "border border-[var(--color-border)]"
        }`}
      >
        <p className="w-full text-[20px] font-semibold leading-6">포트폴리오 소개</p>
        <div className="w-full overflow-hidden">
          {introPreview.map((line, i) => (
            <p key={i} className="text-[16px] font-medium leading-6">
              {line}
            </p>
          ))}
        </div>
      </button>
    </div>
  );
}

interface PageThumbProps {
  n: number;
  src: string;
  active: boolean;
  onClick: () => void;
}

function PageThumb({ n, src, active, onClick }: PageThumbProps) {
  return (
    <div className="flex w-full items-center gap-4">
      <p className="w-10 shrink-0 truncate text-[20px] font-semibold leading-6 text-white">
        {n}
      </p>
      <button
        type="button"
        onClick={onClick}
        className={`relative aspect-[480/270] w-full max-w-[480px] cursor-pointer overflow-hidden rounded-[8px] bg-white ${
          active
            ? "border-8 border-[var(--color-accent)]"
            : "border border-[var(--color-border)]"
        }`}
      >
        <Image src={src} alt={`포트폴리오 페이지 ${n}`} fill className="object-cover" sizes="480px" />
      </button>
    </div>
  );
}
