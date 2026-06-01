"use client";

import { useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import SavedCard from "@/components/bookmark/SavedCard";
import { EMPTY_FILTERS, summarizeFilters } from "@/components/search/filterOptions";

// 마소너리 변화를 위한 종횡비 패턴
const RATIOS = ["16 / 9", "4 / 3", "4 / 3", "16 / 9", "16 / 9", "4 / 3", "4 / 3", "16 / 9"];

// Figma 543-6085 / 548-8769 / 548-9037 · 북마크(저장된 포트폴리오) + 필터 검색
export default function BookmarkPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const summary = summarizeFilters(filters);

  return (
    <div className="min-h-screen">
      {/* 헤더 검색 + 필터 */}
      <div className="sticky top-0 z-20">
        <SearchBar filters={filters} onChange={setFilters} />
      </div>

      <div className="px-5 py-8 sm:px-16 sm:py-12">
        {/* 제목 */}
        <div className="mb-8 flex flex-col gap-1">
          {summary ? (
            <p className="text-[16px] font-medium text-[var(--color-fg)]">
              저장된 포트폴리오:{" "}
              <span className="text-white">{summary}</span> 검색결과
            </p>
          ) : (
            <p className="text-[16px] font-medium text-[var(--color-fg)]">
              저장된 포트폴리오
            </p>
          )}
          <h1 className="text-[32px] font-semibold leading-tight tracking-[-1px] text-white sm:text-[48px]">
            64개
          </h1>
        </div>

        {/* 2열 마소너리 그리드 */}
        <div className="mx-auto max-w-[1680px] columns-1 gap-8 xl:columns-2">
          {RATIOS.map((ratio, i) => (
            <SavedCard key={i} username="USER_NAME_01" ratio={ratio} />
          ))}
        </div>
      </div>
    </div>
  );
}
