"use client";

import Image from "next/image";
import Button from "./Button";
import UploadCard from "./UploadCard";

interface LinkStepProps {
  value: string;
  onChange: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

// 330-1513 / 332-1615 · 링크 입력 (빈/미리보기)
export default function LinkStep({ value, onChange, onPrev, onNext }: LinkStepProps) {
  const hasLink = value.trim().length > 0;

  return (
    <UploadCard title="업로드할 포트폴리오 링크를 입력해주세요">
      <div className="flex w-full flex-col items-end gap-6">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Placeholder for portfolio link."
          className="h-12 w-full rounded-[8px] border border-[var(--color-border)] px-2 py-[10px] text-[16px] font-medium leading-6 text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-border-strong)]"
        />

        {hasLink ? (
          <div className="relative h-80 w-full overflow-hidden rounded-[8px] border border-[var(--color-border)]">
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
        ) : (
          <div className="flex h-20 w-[720px] max-w-full items-center justify-center">
            <p className="text-[16px] font-medium leading-6 text-[var(--color-fg)]">
              포트폴리오 링크를 입력해주세요
            </p>
          </div>
        )}

        <div className="flex items-start gap-4">
          <Button variant="secondary" onClick={onPrev}>
            이전
          </Button>
          <Button onClick={onNext} disabled={!hasLink}>
            다음
          </Button>
        </div>
      </div>
    </UploadCard>
  );
}
