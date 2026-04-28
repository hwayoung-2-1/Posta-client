import Image from "next/image";
import ChatPanel from "@/components/ChatPanel";

const portfolioImages = ["/pdf-1.png", "/pdf-2.png", "/pdf-3.png"];

export default function PortfolioDetailPage() {
  return (
    <>
      <div className="mr-[496px] flex flex-col items-center gap-6 px-8 py-8">
        {portfolioImages.map((src, i) => (
          <div key={i} className="w-full">
            <div className="relative w-full overflow-hidden border border-white" style={{ aspectRatio: "16/9" }}>
              <Image
                src={src}
                alt={`포트폴리오 페이지 ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1920px) 80vw"
              />
            </div>
            {i === portfolioImages.length - 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 overflow-hidden rounded-full shrink-0">
                    <Image
                      src="/dummyProfile.png"
                      alt="프로필"
                      width={40}
                      height={40}
                      className="object-cover size-full"
                    />
                  </div>
                  <span className="text-base leading-6 text-white">iamnot_tyler_1999</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex size-10 items-center justify-center rounded-[6px]"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <Image src="/heart.svg" alt="좋아요" width={19} height={17} />
                  </button>
                  <button
                    className="flex size-10 items-center justify-center rounded-[6px]"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <Image
                      src="/bookmark.svg"
                      alt="북마크"
                      width={14}
                      height={17}
                      style={{ filter: "brightness(0)" }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ChatPanel />
    </>
  );
}
