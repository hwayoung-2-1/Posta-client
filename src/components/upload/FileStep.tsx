"use client";

import Image from "next/image";
import { useRef } from "react";
import Button from "./Button";
import UploadCard from "./UploadCard";

export type FileState = "empty" | "uploading" | "uploaded";

interface FileStepProps {
  state: FileState;
  fileName: string;
  progress: number; // 0 ~ 100
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onPrev: () => void;
  onNext: () => void;
}

// 184-321 / 413-1956 / 330-1461 · 파일 업로드 (빈/진행/완료)
export default function FileStep({
  state,
  fileName,
  progress,
  onFileSelect,
  onRemoveFile,
  onPrev,
  onNext,
}: FileStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }
  const isUploading = state === "uploading";
  const isUploaded = state === "uploaded";

  return (
    <UploadCard title="업로드할 포트폴리오를 선택해주세요">
      <div className="flex flex-col items-end gap-6">
        {/* 드롭존 */}
        <div className="flex h-60 w-[720px] max-w-full flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-[var(--color-border-strong)] px-6">
          {isUploading ? (
            <>
              <div className="flex items-center gap-4">
                <Image
                  src="/upload/icon-loader.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="animate-spin"
                />
                <p className="text-[16px] font-medium leading-6 text-white">
                  파일 업로드중입니다...
                </p>
              </div>
              <div className="h-2 w-[400px] max-w-full overflow-hidden rounded-[4px] bg-[var(--color-track)]">
                <div
                  className="h-2 rounded-[4px] bg-[var(--color-primary)] transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleInputChange}
              />
              <Button withUploadIcon onClick={() => inputRef.current?.click()}>
                파일 업로드
              </Button>
              <div className="flex w-[265px] flex-col items-center gap-2">
                <p className="w-full text-[16px] font-medium leading-6 text-[var(--color-fg)]">
                  파일을 선택하거나 드래그 &amp; 드롭 해주세요
                </p>
                <p className="w-full text-center text-[14px] font-medium leading-[21px] text-[var(--color-border-strong)]">
                  최대 파일 크기 ---MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* 업로드된 파일 / 안내 */}
        <div className="flex h-20 w-[720px] max-w-full flex-col items-center justify-center">
          {isUploaded ? (
            <div className="flex w-full items-center justify-between rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
              <p className="truncate text-[16px] font-medium leading-6 text-[var(--color-fg)]">
                {fileName}
              </p>
              <button
                type="button"
                onClick={onRemoveFile}
                aria-label="파일 삭제"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[6px] hover:bg-white/5"
              >
                <Image src="/upload/icon-x.svg" alt="" width={20} height={20} />
              </button>
            </div>
          ) : (
            <p className="text-[16px] font-medium leading-6 text-[var(--color-fg)]">
              아직 업로드된 파일이 없습니다.
            </p>
          )}
        </div>

        {/* 액션 */}
        <div className="flex items-start gap-4">
          <Button variant="secondary" onClick={onPrev}>
            이전
          </Button>
          <Button onClick={onNext} disabled={!isUploaded}>
            다음
          </Button>
        </div>
      </div>
    </UploadCard>
  );
}
