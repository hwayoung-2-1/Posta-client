import Image from "next/image";
import Link from "next/link";

interface SavedCardProps {
  username: string;
  /** 카드 이미지 종횡비 (마소너리 변화용) */
  ratio: string;
  /** 카드 클릭 시 이동할 경로 (프로필 → 포트폴리오 상세) */
  href?: string;
}

// Figma 543-6085 · 저장된 포트폴리오 카드
export default function SavedCard({ username, ratio, href }: SavedCardProps) {
  const image = (
    <div
      className="relative w-full overflow-hidden border-[0.5px] border-white"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src="/bookmark/saved-portfolio.png"
        alt="저장된 포트폴리오"
        fill
        className="object-cover transition-transform duration-300 hover:scale-[1.02]"
        sizes="(max-width: 1280px) 50vw, 824px"
      />
    </div>
  );

  return (
    <div className="mb-4 flex break-inside-avoid flex-col gap-4">
      {href ? <Link href={href}>{image}</Link> : image}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 overflow-hidden rounded-full">
            <Image
              src="/dummyProfile.png"
              alt={username}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
          <span className="text-[16px] font-medium text-white">{username}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="북마크"
            className="flex size-9 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/bookmark.svg" alt="" width={14} height={17} />
          </button>
          <button
            type="button"
            aria-label="좋아요"
            className="flex size-9 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/heart.svg" alt="" width={19} height={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
