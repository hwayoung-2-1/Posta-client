'use client'

import Image from 'next/image'
import { useState } from 'react'
import { savePortfolio, unsavePortfolio } from '@/lib/api/portfolioApi'

interface SaveButtonProps {
  portfolioId: string
  initialSaved?: boolean
}

export function SaveButton({ portfolioId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    if (isPending) return
    setIsPending(true)
    const next = !saved
    setSaved(next) // 낙관적 업데이트
    try {
      if (next) {
        await savePortfolio(portfolioId)
      } else {
        await unsavePortfolio(portfolioId)
      }
    } catch {
      setSaved(!next) // 실패 시 롤백
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={saved ? '저장 취소' : '저장'}
      className='flex size-10 items-center justify-center rounded-[6px] transition-opacity disabled:opacity-50'
      style={{ background: saved ? 'var(--color-primary)' : 'transparent', border: '1px solid var(--color-border)' }}
    >
      <Image
        src='/bookmark.svg'
        alt='저장'
        width={14}
        height={17}
        style={{ filter: saved ? 'brightness(0)' : 'brightness(0) invert(1)' }}
      />
    </button>
  )
}
