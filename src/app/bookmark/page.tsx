'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/search/SearchBar'
import SavedCard from '@/components/bookmark/SavedCard'
import { EMPTY_FILTERS, summarizeFilters, type SearchFilters } from '@/components/search/filterOptions'
import { getSavedPortfolios } from '@/lib/api/portfolioApi'
import type { SavedPortfolioListItemResponse } from '@/types/portfolio'

export default function BookmarkPage() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [portfolios, setPortfolios] = useState<SavedPortfolioListItemResponse[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSavedPortfolios()
      .then((res) => {
        setPortfolios(res.content)
        setTotal(res.totalElements)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const summary = summarizeFilters(filters)

  const filtered = portfolios.filter((p) => {
    const kw = filters.keyword.toLowerCase()
    if (!kw) return true
    return p.title.toLowerCase().includes(kw) || p.ownerName.toLowerCase().includes(kw)
  })

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20">
        <SearchBar filters={filters} onChange={setFilters} />
      </div>

      <div className="px-5 py-8 sm:px-16 sm:py-12">
        <div className="mb-8 flex flex-col gap-1">
          {summary ? (
            <p className="text-[16px] font-medium text-[var(--color-fg)]">
              저장된 포트폴리오: <span className="text-white">{summary}</span> 검색결과
            </p>
          ) : (
            <p className="text-[16px] font-medium text-[var(--color-fg)]">저장된 포트폴리오</p>
          )}
          <h1 className="text-[32px] font-semibold leading-tight tracking-[-1px] text-white sm:text-[48px]">
            {total}개
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32 text-white/50">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-32 text-white/50">저장된 포트폴리오가 없습니다.</div>
        ) : (
          <div className="mx-auto max-w-[1680px] columns-1 gap-8 xl:columns-2">
            {filtered.map((p) => (
              <SavedCard
                key={p.portfolioId}
                portfolioId={p.portfolioId}
                ownerName={p.ownerName}
                thumbnailUrl={p.thumbnailUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
