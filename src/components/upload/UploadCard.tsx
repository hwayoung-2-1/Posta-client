interface UploadCardProps {
  title: string;
  children: React.ReactNode;
  /** 비활성(딤) 상태 — 링크 입력 전 와이어프레임 */
  dimmed?: boolean;
}

// 디자인: 중앙 모달 카드 (bg neatural-800, border-5, rounded-32, px-40 py-64, gap-64, w-800)
export default function UploadCard({ title, children, dimmed = false }: UploadCardProps) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div
        className={`flex w-[800px] max-w-full flex-col items-center gap-10 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-10 sm:gap-16 sm:rounded-[32px] sm:px-10 sm:py-16 ${
          dimmed ? "opacity-50" : ""
        }`}
      >
        <h1 className="text-center text-[22px] font-semibold leading-tight tracking-[-1px] text-[var(--color-fg)] sm:text-[30px] sm:leading-[30px]">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
