'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signup } from '@/lib/api/authApi'

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSignup = async () => {
    if (!name || !email || !password) return

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(true)
      return
    }

    setLoading(true)
    setApiError(null)
    try {
      await signup({ name, email, password })
      router.push('/login')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        setApiError('이미 사용 중인 이메일입니다.')
      } else {
        setApiError('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim() !== ''

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
          <h1 className="text-2xl font-semibold tracking-[-1px] text-white">회원가입</h1>
          <p className="text-xs text-white/80">계정을 생성하기 위한 정보를 입력해주세요</p>
        </div>

        {/* 입력 필드 */}
        <div className="flex w-full flex-col gap-6">
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => { setName(e.target.value); setApiError(null) }}
            className="h-12 w-full rounded-lg border border-[#5e5e5d] bg-[#242423] px-3 text-sm text-[#f4f4f3] outline-none transition-colors placeholder:text-[#5e5e5d] focus:border-[#a8a8a6]"
          />
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setApiError(null) }}
            className="h-12 w-full rounded-lg border border-[#5e5e5d] bg-[#242423] px-3 text-sm text-[#f4f4f3] outline-none transition-colors placeholder:text-[#5e5e5d] focus:border-[#a8a8a6]"
          />
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
              className={`h-12 w-full rounded-lg border bg-[#242423] px-3 text-sm text-[#f4f4f3] outline-none transition-colors placeholder:text-[#5e5e5d] focus:border-[#a8a8a6] ${passwordError ? 'border-red-400' : 'border-[#5e5e5d]'}`}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#a8a8a6]">최소 8자리, 영문 및 기호 포함</span>
              {passwordError && (
                <span className="text-sm text-red-400">비밀번호 형식을 확인해주세요.</span>
              )}
            </div>
            {apiError && (
              <span className="text-sm text-red-400">{apiError}</span>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex w-full flex-col gap-6">
          <button
            onClick={handleSignup}
            disabled={loading || !isFormValid}
            className="h-12 w-full rounded-md bg-white text-sm font-medium text-[#181817] transition-opacity disabled:opacity-50"
          >
            {loading ? '처리 중...' : '회원가입 완료'}
          </button>
          <button
            onClick={() => router.push('/login')}
            className="h-12 w-full rounded-md border border-[#a8a8a6] bg-[#242423] text-sm font-medium text-[#f4f4f3] transition-opacity hover:opacity-80"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}
