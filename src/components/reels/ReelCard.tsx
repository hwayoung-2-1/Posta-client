"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReelCardProps {
  id: number;
  username: string;
  totalPages?: number;
}

// Figma 410-1720 · 포폴 릴스 카드 (포트폴리오 + 하단바 + 페이지 네비)
export default function ReelCard({ id, username, totalPages = 24 }: ReelCardProps) {
  const [page, setPage] = useState(1);

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex w-full flex-col items-end gap-4">
      {/* 포트폴리오 카드 (16:9) → 클릭 시 상세 보기 */}
      <Link
        href={`/portfolio/${id}`}
        aria-label={`${username} 포트폴리오 자세히 보기`}
        className="group block w-full border border-[var(--color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-white bg-white">
          <Image
            src="/bookmark/saved-portfolio.png"
            alt={`${username} 포트폴리오 ${page}페이지`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </Link>

      {/* 하단 바 */}
      <div className="flex w-full items-center justify-between gap-2">
        {/* 작성자 */}
        <Link
          href={`/profile/${id}`}
          className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
        >
          <div className="size-9 shrink-0 overflow-hidden rounded-full sm:size-10">
            <Image
              src="/dummyProfile.png"
              alt={username}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
          <span className="truncate text-[14px] font-medium text-white sm:text-[16px]">
            {username}
          </span>
        </Link>

        {/* 페이지 네비게이션 */}
        <div className="flex shrink-0 items-center justify-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={page === 1}
            aria-label="이전 페이지"
            className="flex size-11 items-center justify-center text-white transition-opacity disabled:opacity-30"
          >
            <Chevron dir="left" />
          </button>
          <span className="min-w-12 text-center text-[14px] font-medium text-white sm:text-[16px]">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={page === totalPages}
            aria-label="다음 페이지"
            className="flex size-11 items-center justify-center text-white transition-opacity disabled:opacity-30"
          >
            <Chevron dir="right" />
          </button>
        </div>

        {/* 북마크 / 좋아요 */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-4">
          <button
            type="button"
            aria-label="북마크"
            className="flex size-11 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/bookmark.svg" alt="" width={14} height={17} />
          </button>
          <button
            type="button"
            aria-label="좋아요"
            className="flex size-11 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/heart.svg" alt="" width={19} height={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}
