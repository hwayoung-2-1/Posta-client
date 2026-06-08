'use client'

import { useEffect, useState } from 'react'
import ReelCard from '@/components/reels/ReelCard'
import ChatPanel from '@/components/ChatPanel'
import { getPortfolios } from '@/lib/api/portfolioApi'
import type { PortfolioListItemResponse } from '@/types/portfolio'

export default function ReelsPage() {
  const [portfolios, setPortfolios] = useState<PortfolioListItemResponse[]>([])
  const [activePid, setActivePid] = useState<string | null>(null)

  useEffect(() => {
    getPortfolios({ size: 20 }).then((res) => {
      setPortfolios(res.content)
      if (res.content.length > 0) setActivePid(res.content[0].portfolioId)
    }).catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4 py-8 sm:gap-24 sm:px-8 sm:py-16 xl:gap-28 xl:pr-[140px]">
        {portfolios.map((p) => (
          <ReelCard
            key={p.portfolioId}
            portfolioId={p.portfolioId}
            ownerName={p.ownerName}
            thumbnailUrl={p.thumbnailUrl}
            isSaved={p.saved}
            onFocus={() => setActivePid(p.portfolioId)}
          />
        ))}
        {portfolios.length === 0 && (
          <div className="flex items-center justify-center py-32 text-white/50">포트폴리오가 없습니다.</div>
        )}
      </div>

      {activePid && <ChatPanel portfolioId={activePid} />}
    </div>
  )
}
