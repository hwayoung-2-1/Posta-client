import Image from "next/image";

export default function Header() {
  return (
    <header
      className="fixed left-20 right-0 top-0 z-20 flex h-16 items-center justify-center border-b"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex w-[640px] items-center">
        <input
          type="text"
          placeholder="직군, 기술, 유저 이름으로 검색..."
          className="h-10 flex-1 rounded-l-[8px] border border-r-0 bg-[var(--color-bg)] px-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg)]/50 outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-r-[6px] border border-l-0"
          style={{ background: "var(--color-primary)", borderColor: "var(--color-border)" }}
        >
          <Image src="/search.svg" alt="검색" width={17} height={17} />
        </button>
      </div>
    </header>
  );
}
