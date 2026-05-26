'use client'

import { create } from 'zustand'
import type { UserMeResponse } from '@/types/user'

interface AuthStore {
  token: string | null
  user: UserMeResponse | null
  setToken: (token: string) => void
  setUser: (user: UserMeResponse) => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  user: null,

  setToken: (token) => {
    localStorage.setItem('accessToken', token)
    set({ token })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('accessToken')
    set({ token: null, user: null })
  },

  isLoggedIn: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : get().token
    return !!token
  },
}))
