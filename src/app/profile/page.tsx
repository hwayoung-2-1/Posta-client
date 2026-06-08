'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import SavedCard from '@/components/bookmark/SavedCard'
import { getMe } from '@/lib/api/userApi'
import { getPortfolios, getSavedPortfolios } from '@/lib/api/portfolioApi'
import type { UserMeResponse } from '@/types/user'
import type { PortfolioListItemResponse } from '@/types/portfolio'

export default function ProfilePage() {
  const [user, setUser] = useState<UserMeResponse | null>(null)
  const [portfolios, setPortfolios] = useState<PortfolioListItemResponse[]>([])
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    getMe()
      .then((me) => {
        setUser(me)
        getPortfolios({ name: me.name }).then((res) => setPortfolios(res.content)).catch(() => {})
      })
      .catch(() => {})
    getSavedPortfolios().then((res) => setSavedCount(res.totalElements)).catch(() => {})
  }, [])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/50">불러오는 중...</div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1100px] px-5 py-8 sm:px-12 sm:py-12">
      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-4 sm:gap-6">
        <div className="size-16 shrink-0 overflow-hidden rounded-full sm:size-[88px]">
          <Image
            src={user.profileImageUrl ?? '/dummyProfile.png'}
            alt={user.name}
            width={88}
            height={88}
            className="size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-[22px] font-semibold tracking-[-1px] text-white sm:text-[30px]">
            {user.name}
          </h1>
          <p className="text-[14px] text-[var(--color-muted)]">{user.email}</p>
        </div>
      </div>

      {/* 통계 */}
      <h2 className="mb-4 text-[20px] font-semibold text-white">통계</h2>
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="공개한 포트폴리오" value={`${user.portfolioCount}개`} icon="upload" />
        <StatCard label="저장된 포트폴리오" value={`${savedCount}개`} icon="bookmark" />
      </div>

      {/* 포트폴리오 */}
      <h2 className="mb-4 text-[20px] font-semibold text-white">포트폴리오</h2>
      {portfolios.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-[12px] border border-[var(--color-border)]">
          <p className="text-[16px] text-[var(--color-muted)]">업로드된 포트폴리오가 없습니다.</p>
        </div>
      ) : (
        <div className="columns-1 gap-6 xl:columns-2">
          {portfolios.map((pf) => (
            <SavedCard
              key={pf.portfolioId}
              portfolioId={pf.portfolioId}
              ownerName={pf.ownerName}
              thumbnailUrl={pf.thumbnailUrl}
              href={`/profile/${pf.portfolioId}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: 'upload' | 'bookmark' }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[var(--color-border)] p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[14px] text-[var(--color-muted)]">{label}</p>
        <p className="text-[24px] font-semibold text-white">{value}</p>
      </div>
      <StatIcon name={icon} />
    </div>
  )
}

function StatIcon({ name }: { name: 'upload' | 'bookmark' }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'var(--color-border-strong)',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'upload') {
    return (
      <svg {...common}>
        <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
