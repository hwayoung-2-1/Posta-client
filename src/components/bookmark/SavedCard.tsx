'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { savePortfolio, unsavePortfolio } from '@/lib/api/portfolioApi'

interface SavedCardProps {
  portfolioId: string
  ownerName: string
  thumbnailUrl?: string | null
  ratio?: string
  href?: string
  isSaved?: boolean
}

export default function SavedCard({ portfolioId, ownerName, thumbnailUrl, ratio = '16 / 9', href, isSaved = false }: SavedCardProps) {
  const [saved, setSaved] = useState(isSaved)

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

  const target = href ?? `/portfolio/${portfolioId}`

  const image = (
    <div
      className="relative w-full overflow-hidden border-[0.5px] border-white"
      style={{ aspectRatio: ratio }}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={`${ownerName} 포트폴리오`}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          sizes="(max-width: 1280px) 50vw, 824px"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-white/40">
          썸네일이 없습니다.
        </div>
      )}
    </div>
  )

  return (
    <div className="mb-4 flex break-inside-avoid flex-col gap-4">
      <Link href={target}>{image}</Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 overflow-hidden rounded-full">
            <Image src="/dummyProfile.png" alt={ownerName} width={40} height={40} className="size-full object-cover" />
          </div>
          <span className="text-[16px] font-medium text-white">{ownerName}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={saved ? '저장 취소' : '저장'}
            onClick={handleToggleSave}
            className="flex size-9 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
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
            className="flex size-9 items-center justify-center rounded-[6px] transition-colors hover:bg-white/5"
          >
            <Image src="/heart.svg" alt="" width={19} height={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
