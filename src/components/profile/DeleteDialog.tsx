"use client";

interface DeleteDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma 561-11948 · 포트폴리오 삭제 확인 다이얼로그
export default function DeleteDialog({ onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[480px] max-w-full flex-col items-center gap-8 rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-10 py-12"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[var(--color-fg)]">
            포트폴리오를 삭제하시겠습니까?
          </h2>
          <p className="text-[16px] font-medium text-[var(--color-muted)]">
            작성한 포트폴리오의 내용은 복구할 수 없습니다.
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 flex-1 items-center justify-center rounded-[6px] bg-[var(--color-primary)] px-5 text-[14px] font-medium text-[var(--color-ink)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-10 flex-1 items-center justify-center rounded-[6px] bg-[#e5484d] px-5 text-[14px] font-medium text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
