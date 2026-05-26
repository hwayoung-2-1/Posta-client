'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getMe } from '@/lib/api/userApi'
import { updateMe } from '@/lib/api/userApi'

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  const [name, setName] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setProfileImageUrl(user.profileImageUrl ?? '')
    }
  }, [user])

  const mutation = useMutation({
    mutationFn: () => updateMe({
      name: name.trim() || undefined,
      profileImageUrl: profileImageUrl.trim() || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    },
  })

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-sm text-white/40'>불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className='px-8 py-8'>
      <h1 className='mb-8 text-xl font-medium text-white'>설정</h1>

      <div className='max-w-[480px]'>
        <h2 className='mb-4 text-sm font-medium text-white/70'>프로필</h2>

        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/50'>이름</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='h-11 rounded-[8px] border bg-[var(--color-surface)] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/50'>프로필 이미지 URL</label>
            <input
              type='url'
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder='https://...'
              className='h-11 rounded-[8px] border bg-[var(--color-surface)] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className='mt-2 flex items-center gap-3'>
            <button
              type='submit'
              disabled={mutation.isPending}
              className='h-10 rounded-[8px] px-6 text-sm font-medium text-black transition-opacity disabled:opacity-50'
              style={{ background: 'var(--color-primary)' }}
            >
              {mutation.isPending ? '저장 중...' : '저장'}
            </button>
            {success && <p className='text-sm text-green-400'>저장됐습니다.</p>}
            {mutation.isError && <p className='text-sm text-red-400'>저장에 실패했습니다.</p>}
          </div>
        </form>

        <div
          className='mt-8 border-t pt-6'
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className='text-xs text-white/30'>이메일: {user?.email}</p>
        </div>
      </div>
    </div>
  )
}
