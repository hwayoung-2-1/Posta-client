'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/components/search/SearchBar'
import { EMPTY_FILTERS, type SearchFilters } from '@/components/search/filterOptions'
import { getPortfolios } from '@/lib/api/portfolioApi'
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
              {row.map(({ portfolioId, thumbnailUrl, title }, colIdx) => {
                const flex = FLEX_CYCLE[(rowIdx * 2 + colIdx) % FLEX_CYCLE.length]
                return (
                  <Link
                    key={portfolioId}
                    href={`/portfolio/${portfolioId}`}
                    className="relative overflow-hidden"
                    style={{ flex }}
                  >
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 1920px) 50vw"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-white/5 text-sm text-white/40">
                        썸네일이 없습니다.
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
