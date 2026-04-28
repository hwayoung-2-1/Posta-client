import Image from "next/image";

const portfolioRows = [
  [
    { src: "/portfolio-1.png", flex: 880 },
    { src: "/portfolio-2.png", flex: 960 },
  ],
  [
    { src: "/portfolio-3.png", flex: 514 },
    { src: "/portfolio-4.png", flex: 715 },
    { src: "/portfolio-5.png", flex: 611 },
  ],
  [
    { src: "/portfolio-6.png", flex: 960 },
    { src: "/portfolio-7.png", flex: 880 },
  ],
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col">
      {portfolioRows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex h-[460px]">
          {row.map(({ src, flex }, colIdx) => (
            <div
              key={colIdx}
              className="relative cursor-pointer overflow-hidden"
              style={{ flex }}
            >
              <Image
                src={src}
                alt={`포트폴리오 ${rowIdx * row.length + colIdx + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 1920px) 50vw"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
