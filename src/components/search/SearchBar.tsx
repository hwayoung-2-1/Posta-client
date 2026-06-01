"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  JOB_OPTIONS,
  TECH_OPTIONS,
  SearchFilters,
} from "./filterOptions";

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  /** 홈(피드)에서 포트폴리오/유저 탭 노출 (Figma 219-2240) */
  showTabs?: boolean;
}

// Figma 548-8769 / 219-2240 · 헤더 검색 + 직군/기술 필터 드롭다운
export default function SearchBar({ filters, onChange, showTabs = false }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"portfolio" | "user">("portfolio");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggle = (key: "jobs" | "techs", value: string) => {
    const list = filters[key];
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div ref={rootRef} className="relative">
      {/* 검색 바 */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6">
        <Image src="/search.svg" alt="" width={24} height={24} className="opacity-70" />
        <input
          value={filters.keyword}
          onFocus={() => setOpen(true)}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
          placeholder="제작자, 직군, 기술로 포트폴리오 검색 또는 유저 검색"
          className="h-full flex-1 bg-transparent text-[16px] text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)]"
        />
      </div>

      {/* 필터 드롭다운 */}
      {open && (
        <div className="absolute inset-x-0 top-16 z-30 flex flex-col gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 shadow-lg">
          {showTabs && (
            <div className="flex gap-2">
              {(["portfolio", "user"] as const).map((t) => {
                const active = tab === t;
                const label = t === "portfolio" ? "포트폴리오" : "유저";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex h-9 items-center gap-2 rounded-[6px] px-4 text-[14px] font-medium ${
                      active
                        ? "bg-[var(--color-primary)] text-[var(--color-ink)]"
                        : "border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-fg)]"
                    }`}
                  >
                    {active && (
                      <Image src="/bookmark/icon-check.svg" alt="" width={12} height={12} />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          )}
          <FilterGroup
            label="직군 선택"
            options={JOB_OPTIONS}
            selected={filters.jobs}
            onToggle={(v) => toggle("jobs", v)}
          />
          <FilterGroup
            label="기술 선택"
            options={TECH_OPTIONS}
            selected={filters.techs}
            onToggle={(v) => toggle("techs", v)}
          />
        </div>
      )}
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ label, options, selected, onToggle }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] font-semibold text-[var(--color-muted)]">{label}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className="flex cursor-pointer items-center gap-2"
            >
              <span
                className={`flex size-5 items-center justify-center rounded-[4px] ${
                  checked
                    ? "bg-[var(--color-primary)]"
                    : "border border-[var(--color-border)]"
                }`}
              >
                {checked && (
                  <Image src="/bookmark/icon-check.svg" alt="" width={12} height={12} />
                )}
              </span>
              <span className="text-[14px] text-white">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
