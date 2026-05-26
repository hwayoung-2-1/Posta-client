'use client'

import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRoles, getSkills } from '@/lib/api/taxonomyApi'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '')
  const [showFilter, setShowFilter] = useState(false)

  const activeRole = searchParams.get('role') ?? ''
  const activeSkill = searchParams.get('skill') ?? ''

  useEffect(() => {
    setKeyword(searchParams.get('keyword') ?? '')
  }, [searchParams])

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: Infinity,
  })

  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: Infinity,
  })

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('keyword', keyword.trim())
  }

  const hasFilter = !!activeRole || !!activeSkill

  return (
    <div style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <header
        className='flex h-16 items-center justify-center border-b'
        style={{ borderColor: 'var(--color-border)' }}
      >
        <form onSubmit={handleSearch} className='flex w-[640px] items-center gap-2'>
          <div className='flex flex-1 items-center'>
            <input
              type='text'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder='직군, 기술, 유저 이름으로 검색...'
              className='h-10 flex-1 rounded-l-[8px] border border-r-0 bg-[var(--color-bg)] px-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg)]/50 outline-none'
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button
              type='submit'
              className='flex size-10 shrink-0 items-center justify-center rounded-r-[6px] border border-l-0'
              style={{ background: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
            >
              <Image src='/search.svg' alt='검색' width={17} height={17} />
            </button>
          </div>

          <button
            type='button'
            onClick={() => setShowFilter((v) => !v)}
            className='flex h-10 items-center gap-1 rounded-[8px] border px-3 text-sm transition-colors'
            style={{
              borderColor: hasFilter ? 'var(--color-primary)' : 'var(--color-border)',
              color: hasFilter ? 'var(--color-primary)' : 'var(--color-fg)',
              background: 'var(--color-bg)',
            }}
          >
            필터{hasFilter && ' •'}
          </button>
        </form>
      </header>

      {showFilter && (
        <div
          className='border-b px-8 py-4'
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className='flex flex-col gap-4'>
            <div>
              <p className='mb-2 text-xs text-white/40'>직군</p>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => updateParam('role', '')}
                  className='rounded-full border px-3 py-1 text-xs transition-colors'
                  style={{
                    borderColor: !activeRole ? 'var(--color-primary)' : 'var(--color-border)',
                    color: !activeRole ? 'var(--color-primary)' : 'var(--color-fg)',
                  }}
                >
                  전체
                </button>
                {rolesData?.roles.map((r) => (
                  <button
                    key={r.roleId}
                    onClick={() => updateParam('role', activeRole === r.name ? '' : r.name)}
                    className='rounded-full border px-3 py-1 text-xs transition-colors'
                    style={{
                      borderColor: activeRole === r.name ? 'var(--color-primary)' : 'var(--color-border)',
                      color: activeRole === r.name ? 'var(--color-primary)' : 'var(--color-fg)',
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className='mb-2 text-xs text-white/40'>기술</p>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => updateParam('skill', '')}
                  className='rounded-full border px-3 py-1 text-xs transition-colors'
                  style={{
                    borderColor: !activeSkill ? 'var(--color-primary)' : 'var(--color-border)',
                    color: !activeSkill ? 'var(--color-primary)' : 'var(--color-fg)',
                  }}
                >
                  전체
                </button>
                {skillsData?.skills.map((s) => (
                  <button
                    key={s.skillId}
                    onClick={() => updateParam('skill', activeSkill === s.name ? '' : s.name)}
                    className='rounded-full border px-3 py-1 text-xs transition-colors'
                    style={{
                      borderColor: activeSkill === s.name ? 'var(--color-primary)' : 'var(--color-border)',
                      color: activeSkill === s.name ? 'var(--color-primary)' : 'var(--color-fg)',
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
