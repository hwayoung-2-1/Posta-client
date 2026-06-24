'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ChatPanel from '@/components/ChatPanel'
import { PdfViewer } from '@/components/portfolio/PdfViewer'
import { getPortfolio, getPortfolioPdfUrl, savePortfolio, unsavePortfolio } from '@/lib/api/portfolioApi'
import type { PortfolioDetailResponse } from '@/types/portfolio'

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<PortfolioDetailResponse | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    getPortfolio(id).then(setPortfolio).catch(() => {})
    getPortfolioPdfUrl(id).then(setPdfUrl).catch(() => {})
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
      <div className="mr-[496px] flex flex-col items-center gap-6 px-8 py-8 pb-32">
        <PdfViewer pdfUrl={pdfUrl} />

        {portfolio && (
          <div className="fixed bottom-0 left-16 sm:left-20 right-[496px] z-20" style={{ background: 'linear-gradient(to top, rgba(24,24,23,0.95) 0%, rgba(24,24,23,0.6) 50%, transparent 100%)' }}>
            <div className="flex items-center justify-between px-8 py-4 pt-12">
              <div className="flex items-center gap-3">
                <div className="size-10 overflow-hidden rounded-full shrink-0 bg-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/dummyProfile.png" alt="프로필" className="size-full object-cover" />
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
          </div>
        )}
      </div>

      <ChatPanel portfolioId={id} />
    </>
  )
}
