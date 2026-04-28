import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

const portfolioRows = [
  [
    { src: "/portfolio-1.png", flex: 880, id: 1 },
    { src: "/portfolio-2.png", flex: 960, id: 2 },
  ],
  [
    { src: "/portfolio-3.png", flex: 514, id: 3 },
    { src: "/portfolio-4.png", flex: 715, id: 4 },
    { src: "/portfolio-5.png", flex: 611, id: 5 },
  ],
  [
    { src: "/portfolio-6.png", flex: 960, id: 6 },
    { src: "/portfolio-7.png", flex: 880, id: 7 },
  ],
];

export default function PortfolioPage() {
  return (
    <>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <div className="flex flex-col">
        {portfolioRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex h-[460px]">
            {row.map(({ src, flex, id }) => (
              <Link
                key={id}
                href={`/portfolio/${id}`}
                className="relative overflow-hidden"
                style={{ flex }}
              >
                <Image
                  src={src}
                  alt={`포트폴리오 ${id}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 1920px) 50vw"
                />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
