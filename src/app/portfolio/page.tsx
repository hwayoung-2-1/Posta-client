'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from '@/components/Header'
import { getPortfolios } from '@/lib/api/portfolioApi'

function PortfolioGrid() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') ?? undefined
  const role = searchParams.get('role') ?? undefined
  const skill = searchParams.get('skill') ?? undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: ['portfolios', { keyword, role, skill }],
    queryFn: () => getPortfolios({ keyword, role, skill, size: 20 }),
  })

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <p className='text-white/40'>포트폴리오를 불러오는 중...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <p className='text-white/40'>포트폴리오를 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (data.content.length === 0) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <p className='text-white/40'>검색 결과가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-4'>
      {data.content.map((portfolio) => (
        <Link
          key={portfolio.portfolioId}
          href={`/portfolio/${portfolio.portfolioId}`}
          className='group relative aspect-[3/4] overflow-hidden bg-white/5'
        >
          {portfolio.thumbnailUrl ? (
            <Image
              src={portfolio.thumbnailUrl}
              alt={portfolio.title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <Image src='/film.svg' alt='' width={32} height={32} className='opacity-20' />
            </div>
          )}

          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <p className='truncate text-sm font-medium text-white'>{portfolio.title}</p>
            <p className='truncate text-xs text-white/60'>{portfolio.ownerName}</p>
            {portfolio.roles.length > 0 && (
              <p className='mt-1 truncate text-xs text-white/40'>{portfolio.roles.join(' · ')}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <>
      <div className='sticky top-0 z-10'>
        <Header />
      </div>
      <Suspense
        fallback={
          <div className='flex h-[60vh] items-center justify-center'>
            <p className='text-white/40'>불러오는 중...</p>
          </div>
        }
      >
        <PortfolioGrid />
      </Suspense>
    </>
  )
}
