"use client";

import Button from "./Button";
import UploadCard from "./UploadCard";

export type UploadFormat = "file" | "link";

interface FormatStepProps {
  selected: UploadFormat;
  onSelect: (format: UploadFormat) => void;
  onNext: () => void;
}

// 314-1043 · 형식 선택(파일/링크)
export default function FormatStep({ selected, onSelect, onNext }: FormatStepProps) {
  return (
    <UploadCard title="포트폴리오 형식을 선택해주세요">
      <div className="flex w-full items-start justify-end gap-6">
        <FormatOption
          label="파일 업로드"
          caption="PDF 파일"
          active={selected === "file"}
          onClick={() => onSelect("file")}
        />
        <FormatOption
          label="링크 입력"
          caption="Notion, Linkedin, 개인 사이트, ..."
          active={selected === "link"}
          onClick={() => onSelect("link")}
        />
      </div>
      <div className="flex w-full flex-col items-end">
        <Button onClick={onNext}>다음</Button>
      </div>
    </UploadCard>
  );
}

interface FormatOptionProps {
  label: string;
  caption: string;
  active: boolean;
  onClick: () => void;
}

function FormatOption({ label, caption, active, onClick }: FormatOptionProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={`flex h-20 w-full cursor-pointer items-center justify-center rounded-[6px] px-5 text-[16px] font-semibold leading-6 transition-colors ${
          active
            ? "bg-[var(--color-primary)] text-[var(--color-ink)]"
            : "border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-fg)]"
        }`}
      >
        {label}
      </button>
      <p className="text-center text-[16px] font-medium leading-6 text-[var(--color-fg)]">
        {caption}
      </p>
    </div>
  );
}
