'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from '@/components/search/SearchBar'
import { EMPTY_FILTERS, type SearchFilters } from '@/components/search/filterOptions'
import { getPortfolios, getPortfolio } from '@/lib/api/portfolioApi'
import { PdfThumbnail } from '@/components/portfolio/PdfThumbnail'
import type { PortfolioListItemResponse } from '@/types/portfolio'

const FLEX_CYCLE = [880, 960, 514, 715, 611, 960, 880]

export default function PortfolioPage() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [portfolios, setPortfolios] = useState<PortfolioListItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async (f: SearchFilters) => {
    setIsLoading(true)
    try {
      const res = await getPortfolios({
        keyword: f.keyword || undefined,
        role: f.jobs[0] || undefined,
        skill: f.techs[0] || undefined,
      })
      setPortfolios(res.content)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load(filters)
  }, [filters, load])

  const rows: PortfolioListItemResponse[][] = []
  for (let i = 0; i < portfolios.length; i += 2) {
    rows.push(portfolios.slice(i, i + 2))
  }

  return (
    <>
      <div className="sticky top-0 z-20">
        <SearchBar filters={filters} onChange={setFilters} showTabs />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32 text-white/50">불러오는 중...</div>
      ) : portfolios.length === 0 ? (
        <div className="flex items-center justify-center py-32 text-white/50">포트폴리오가 없습니다.</div>
      ) : (
        <div className="flex flex-col">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex h-[180px] sm:h-[300px] lg:h-[460px]">
              {row.map(({ portfolioId, title, ownerName }, colIdx) => {
                const flex = FLEX_CYCLE[(rowIdx * 2 + colIdx) % FLEX_CYCLE.length]
                return (
                  <PortfolioCard
                    key={portfolioId}
                    portfolioId={portfolioId}
                    title={title}
                    ownerName={ownerName}
                    flex={flex}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

interface PortfolioCardProps {
  portfolioId: string
  title: string
  ownerName: string
  flex: number
}

function PortfolioCard({ portfolioId, title, ownerName, flex }: PortfolioCardProps) {
  const [hovered, setHovered] = useState(false)
  const [description, setDescription] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  const handleMouseEnter = async () => {
    setHovered(true)
    if (fetchedRef.current) return
    fetchedRef.current = true
    try {
      const detail = await getPortfolio(portfolioId)
      setDescription(detail.description)
    } catch {
      // silent
    }
  }

  return (
    <Link
      href={`/portfolio/${portfolioId}`}
      className="group relative overflow-hidden"
      style={{ flex }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <PdfThumbnail
        portfolioId={portfolioId}
        alt={title}
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-black/60 p-4 transition-opacity duration-200 sm:p-6 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="line-clamp-1 text-[13px] font-medium text-white/60 sm:text-[14px]">{ownerName}</p>
        <p className="mt-1 line-clamp-1 text-[16px] font-semibold text-white sm:text-[20px]">{title}</p>
        {description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-white/80 sm:text-[14px]">{description}</p>
        )}
      </div>
    </Link>
  )
}
