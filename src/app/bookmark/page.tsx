'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getSavedPortfolios } from '@/lib/api/portfolioApi'

export default function BookmarkPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['saved-portfolios'],
    queryFn: () => getSavedPortfolios({ size: 50 }),
  })

  return (
    <div className='px-8 py-8'>
      <h1 className='mb-6 text-xl font-medium text-white'>저장한 포트폴리오</h1>

      {isLoading && (
        <p className='text-sm text-white/40'>불러오는 중...</p>
      )}

      {isError && (
        <p className='text-sm text-white/40'>목록을 불러올 수 없습니다.</p>
      )}

      {data?.content.length === 0 && (
        <p className='text-sm text-white/40'>저장한 포트폴리오가 없습니다.</p>
      )}

      {data && data.content.length > 0 && (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {data.content.map((item) => (
            <Link
              key={item.portfolioId}
              href={`/portfolio/${item.portfolioId}`}
              className='group flex flex-col gap-2'
            >
              <div className='relative aspect-[3/4] overflow-hidden rounded-[8px] bg-white/5'>
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 50vw, 25vw'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <Image src='/film.svg' alt='' width={28} height={28} className='opacity-20' />
                  </div>
                )}
              </div>
              <div>
                <p className='truncate text-sm font-medium text-white'>{item.title}</p>
                <p className='truncate text-xs text-white/50'>{item.ownerName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
