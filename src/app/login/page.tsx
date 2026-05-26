'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const setToken = useAuthStore((s) => s.setToken)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await login({ email, password })
      setToken(res.accessToken)
      router.push('/portfolio')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className='flex min-h-screen items-center justify-center'
      style={{ background: 'var(--color-bg)' }}
    >
      <div className='w-full max-w-[400px] px-6'>
        <div className='mb-10 flex justify-center'>
          <Image src='/logo.svg' alt='Posta' width={48} height={46} />
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/70'>이메일</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email@example.com'
              required
              className='h-11 rounded-[8px] border bg-[var(--color-surface)] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/70'>비밀번호</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='비밀번호'
              required
              className='h-11 rounded-[8px] border bg-[var(--color-surface)] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {error && <p className='text-sm text-red-400'>{error}</p>}

          <button
            type='submit'
            disabled={isLoading}
            className='mt-2 h-11 rounded-[8px] text-sm font-medium text-black transition-opacity disabled:opacity-50'
            style={{ background: 'var(--color-primary)' }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-white/50'>
          계정이 없으신가요?{' '}
          <Link href='/signup' className='text-white underline underline-offset-2'>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
