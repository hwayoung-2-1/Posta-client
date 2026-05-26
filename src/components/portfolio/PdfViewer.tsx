import Image from 'next/image'
import type { PdfPageInfo } from '@/types/portfolio'

interface PdfViewerProps {
  pages: PdfPageInfo[]
}

export function PdfViewer({ pages }: PdfViewerProps) {
  if (pages.length === 0) {
    return (
      <div className='w-full flex items-center justify-center py-20 text-white/50'>
        페이지를 불러오는 중입니다…
      </div>
    )
  }

  return (
    <>
      {pages.map((page) => (
        <div key={page.pageNumber} className='w-full'>
          <div
            className='relative w-full overflow-hidden border border-white/20'
            style={{ aspectRatio: `${page.size.width} / ${page.size.height}` }}
          >
            <Image
              src={page.imageUrl}
              alt={`포트폴리오 페이지 ${page.pageNumber}`}
              fill
              className='object-cover'
              sizes='(max-width: 1920px) 80vw'
            />
          </div>
        </div>
      ))}
    </>
  )
}
