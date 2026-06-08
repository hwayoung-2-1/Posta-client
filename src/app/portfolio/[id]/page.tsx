'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ChatPanel from '@/components/ChatPanel'
import { PdfViewer } from '@/components/portfolio/PdfViewer'
import { getPortfolio, getPageDetail, savePortfolio, unsavePortfolio } from '@/lib/api/portfolioApi'
import type { PortfolioDetailResponse, PdfPageInfo } from '@/types/portfolio'

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<PortfolioDetailResponse | null>(null)
  const [pages, setPages] = useState<PdfPageInfo[]>([])
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    getPortfolio(id)
      .then(async (p) => {
        setPortfolio(p)
        const details = await Promise.all(
          Array.from({ length: p.pageCount }, (_, i) => getPageDetail(id, i + 1))
        )
        setPages(
          details
            .filter((d) => d.pageImageUrl)
            .map((d) => ({
              pageNumber: d.pageNumber,
              imageUrl: d.pageImageUrl!,
              size: { width: 210, height: 297, aspectRatio: 210 / 297 },
            }))
        )
      })
      .catch(() => {})
  }, [id])

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await unsavePortfolio(id)
      } else {
        await savePortfolio(id)
      }
      setIsSaved((v) => !v)
    } catch {
      // silent
    }
  }

  return (
    <>
      <div className="mr-[496px] flex flex-col items-center gap-6 px-8 py-8">
        <PdfViewer pages={pages} />

        {portfolio && (
          <div className="w-full mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 overflow-hidden rounded-full shrink-0">
                <Image src="/dummyProfile.png" alt="프로필" width={40} height={40} className="object-cover size-full" />
              </div>
              <span className="text-base leading-6 text-white">{portfolio.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSave}
                className="flex size-10 items-center justify-center rounded-[6px]"
                style={{ background: 'var(--color-primary)' }}
              >
                <Image
                  src="/bookmark.svg"
                  alt="북마크"
                  width={14}
                  height={17}
                  style={isSaved ? { filter: 'brightness(0) invert(1)' } : { filter: 'brightness(0)' }}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <ChatPanel portfolioId={id} />
    </>
  )
}
