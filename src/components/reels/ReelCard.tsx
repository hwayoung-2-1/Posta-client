'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { savePortfolio, unsavePortfolio } from '@/lib/api/portfolioApi'

interface ReelCardProps {
  portfolioId: string
  ownerName: string
  thumbnailUrl?: string | null
  totalPages?: number
  isSaved?: boolean
  onFocus?: () => void
}

export default function ReelCard({ portfolioId, ownerName, thumbnailUrl, totalPages = 1, isSaved = false, onFocus }: ReelCardProps) {
  const [page, setPage] = useState(1)
  const [saved, setSaved] = useState(isSaved)

  const prev = () => setPage((p) => Math.max(1, p - 1))
  const next = () => setPage((p) => Math.min(totalPages, p + 1))

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await unsavePortfolio(portfolioId)
      } else {
        await savePortfolio(portfolioId)
      }
      setSaved((v) => !v)
    } catch {
      // silent
    }
  }

  return (
    <div className="flex w-full flex-col items-end gap-4" onClick={onFocus}>
      <Link
        href={`/portfolio/${portfolioId}`}
        aria-label={`${ownerName} 포트폴리오 자세히 보기`}
        className="group block w-full border border-[var(--color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-white bg-white">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`${ownerName} 포트폴리오 ${page}페이지`}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-white/40">
              썸네일이 없습니다.
            </div>
          )}
        </div>
      </Link>

      <div className="flex w-full items-center justify-between gap-2">
        <Link href={`/portfolio/${portfolioId}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="size-9 shrink-0 overflow-hidden rounded-full sm:size-10">
            <Image src="/dummyProfile.png" alt={ownerName} width={40} height={40} className="size-full object-cover" />
          </div>
          <span className="truncate text-[14px] font-medium text-white sm:text-[16px]">{ownerName}</span>
        </Link>

        <div className="flex shrink-0 items-center justify-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={page === 1}
            aria-label="이전 페이지"
            className="flex size-11 items-center justify-center text-white transition-opacity disabled:opacity-30"
          >
            <Chevron dir="left" />
          </button>
          <span className="min-w-12 text-center text-[14px] font-medium text-white sm:text-[16px]">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={page === totalPages}
            aria-label="다음 페이지"
            className="flex size-11 items-center justify-center text-white transition-opacity disabled:opacity-30"
          >
            <Chevron dir="right" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-4">
          <button
            type="button"
            aria-label={saved ? '저장 취소' : '저장'}
            onClick={handleToggleSave}
            className="flex size-11 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image
              src="/bookmark.svg"
              alt=""
              width={14}
              height={17}
              style={saved ? { filter: 'brightness(0) invert(1)' } : undefined}
            />
          </button>
          <button
            type="button"
            aria-label="좋아요"
            className="flex size-11 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/heart.svg" alt="" width={19} height={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}
