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

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null
  const fromStorage = localStorage.getItem('accessToken')
  if (fromStorage) {
    setAuthCookie(fromStorage)
    return fromStorage
  }
  const fromCookie = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/)?.[1] ?? null
  if (fromCookie) {
    localStorage.setItem('accessToken', fromCookie)
  }
  return fromCookie
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialToken = getInitialToken()

  return {
    token: initialToken,
    user: null,

    setToken: (token) => {
      localStorage.setItem('accessToken', token)
      setAuthCookie(token)
      set({ token })
    },

    setUser: (user) => set({ user }),

    logout: () => {
      localStorage.removeItem('accessToken')
      Object.keys(localStorage)
        .filter((k) => k.startsWith('posta_chat_session_'))
        .forEach((k) => localStorage.removeItem(k))
      clearAuthCookie()
      set({ token: null, user: null })
    },

    isLoggedIn: () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : get().token
      return !!token
    },
  }
})
