'use client'

import { create } from 'zustand'
import type { UserMeResponse } from '@/types/user'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7일

function setAuthCookie(token: string) {
  document.cookie = `accessToken=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = 'accessToken=; path=/; max-age=0'
}

interface AuthStore {
  token: string | null
  user: UserMeResponse | null
  setToken: (token: string) => void
  setUser: (user: UserMeResponse) => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // localStorage → cookie 동기화 (새로고침 시 미들웨어가 쿠키를 읽을 수 있게)
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) setAuthCookie(storedToken)
  }

  return {
    token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    user: null,

    setToken: (token) => {
      localStorage.setItem('accessToken', token)
      setAuthCookie(token)
      set({ token })
    },

    setUser: (user) => set({ user }),

    logout: () => {
      localStorage.removeItem('accessToken')
      clearAuthCookie()
      set({ token: null, user: null })
    },

    isLoggedIn: () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : get().token
      return !!token
    },
  }
})
