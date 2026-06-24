'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { login } from '@/lib/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const setToken = useAuthStore((s) => s.setToken)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<'password' | 'account' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)
    try {
      const { accessToken } = await login({ email, password })
      setToken(accessToken)
      router.push('/portfolio')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        setError('password')
      } else {
        setError('account')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.trim() !== '' && password.trim() !== ''

  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center">
      {/* 배경 이미지 */}
      <Image
        src="/background.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
        priority
      />

      {/* 카드 */}
      <div className="relative z-10 flex w-[480px] flex-col items-center gap-12 rounded-3xl border border-[#5e5e5d] bg-white/10 px-6 py-12">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-[#5e5e5d] bg-[#242423]">
            <Image src="/logo.svg" alt="Posta" width={24} height={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-[-1px] text-white">Posta 로그인</h1>
          <p className="text-xs text-white/80">로그인하기 위해 정보를 입력해주세요</p>
        </div>

        {/* 입력 필드 */}
        <div className="flex w-full flex-col gap-6">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            className="h-12 w-full rounded-lg border border-[#5e5e5d] bg-[#242423] px-3 text-sm text-[#f4f4f3] outline-none transition-colors placeholder:text-[#5e5e5d] focus:border-[#a8a8a6]"
          />
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12 w-full rounded-lg border border-[#5e5e5d] bg-[#242423] px-3 text-sm text-[#f4f4f3] outline-none transition-colors placeholder:text-[#5e5e5d] focus:border-[#a8a8a6]"
            />
            <div className="flex items-center justify-between">
              {error === 'password' && (
                <span className="text-sm text-red-400">비밀번호가 일치하지 않습니다.</span>
              )}
              {error === 'account' && (
                <span className="text-sm text-red-400">계정이 존재하지 않습니다.</span>
              )}
              <button
                type="button"
                className="ml-auto cursor-pointer text-sm text-white/70 hover:text-white"
              >
                비밀번호가 기억나지 않나요?
              </button>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex w-full flex-col gap-6">
          <button
            onClick={handleLogin}
            disabled={loading || !isFormValid}
            className="h-12 w-full rounded-md bg-white text-sm font-medium text-[#181817] transition-opacity disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="h-12 w-full rounded-md border border-[#a8a8a6] bg-[#242423] text-sm font-medium text-[#f4f4f3] transition-opacity hover:opacity-80"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
