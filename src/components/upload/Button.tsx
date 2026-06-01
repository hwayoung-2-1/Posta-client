import Image from "next/image";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  /** 36px 높이 + 아이콘이 있는 드롭존용 업로드 버튼 */
  withUploadIcon?: boolean;
  type?: "button" | "submit";
}

// 디자인: 다음/작성완료/이전 등 액션 버튼 (h-40, rounded-6, px-20, text-14/500)
export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  withUploadIcon = false,
  type = "button",
}: ButtonProps) {
  const base =
    "flex items-center justify-center gap-2 rounded-[6px] whitespace-nowrap text-[14px] font-medium leading-[21px] transition-opacity";
  const size = withUploadIcon ? "h-9 px-4 py-[7.5px]" : "h-10 px-5 py-[9.5px]";
  const skin =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-[var(--color-ink)]"
      : "border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-fg)]";
  const state = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${size} ${skin} ${state}`}
    >
      {withUploadIcon && (
        <Image src="/upload/icon-upload.svg" alt="" width={20} height={20} />
      )}
      {children}
    </button>
  );
}
