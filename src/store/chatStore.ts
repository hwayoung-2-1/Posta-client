'use client'

import { create } from 'zustand'
import { createChatSession, sendChatMessage, getChatMessages } from '@/lib/api/chatApi'
import type { ChatMessageItemResponse } from '@/types/chat'

const sessionKey = (portfolioId: string) => `posta_chat_session_${portfolioId}`

interface ChatStore {
  sessionId: string | null
  activePortfolioId: string | null
  messages: ChatMessageItemResponse[]
  isLoading: boolean
  initSession: (portfolioId: string) => Promise<void>
  sendMessage: (text: string, currentPage?: number) => Promise<void>
  clearSession: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessionId: null,
  activePortfolioId: null,
  messages: [],
  isLoading: false,

  initSession: async (portfolioId: string) => {
    const current = get()
    if (current.activePortfolioId === portfolioId && current.sessionId) return

    // 포트폴리오가 다르면 메모리 초기화 후 재시작
    set({ sessionId: null, activePortfolioId: portfolioId, messages: [], isLoading: false })

    const stored = localStorage.getItem(sessionKey(portfolioId))

    if (stored) {
      set({ sessionId: stored })
      try {
        const res = await getChatMessages(stored)
        set({ messages: res.messages })
      } catch {
        localStorage.removeItem(sessionKey(portfolioId))
        set({ sessionId: null })
        await get().initSession(portfolioId)
      }
    } else {
      try {
        const res = await createChatSession(portfolioId)
        localStorage.setItem(sessionKey(portfolioId), res.chatSessionId)
        set({ sessionId: res.chatSessionId, messages: [] })
      } catch {
        // 비로그인 상태 등
      }
    }
  },

  sendMessage: async (text: string, currentPage?: number) => {
    const { sessionId } = get()
    if (!sessionId || !text.trim()) return

    const userMsg: ChatMessageItemResponse = {
      messageId: crypto.randomUUID(),
      role: 'user',
      content: text,
      answerable: null,
      sources: [],
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }))

    try {
      const res = await sendChatMessage(sessionId, { message: text, currentPage })
      const aiMsg: ChatMessageItemResponse = {
        messageId: res.answerMessageId,
        role: 'assistant',
        content: res.answer,
        answerable: res.answerable,
        sources: res.sources,
        createdAt: new Date().toISOString(),
      }
      set((s) => ({ messages: [...s.messages, aiMsg] }))
    } catch {
      const errMsg: ChatMessageItemResponse = {
        messageId: crypto.randomUUID(),
        role: 'assistant',
        content: '응답을 가져오는 중 오류가 발생했습니다.',
        answerable: false,
        sources: [],
        createdAt: new Date().toISOString(),
      }
      set((s) => ({ messages: [...s.messages, errMsg] }))
    } finally {
      set({ isLoading: false })
    }
  },

  clearSession: () => set({ sessionId: null, activePortfolioId: null, messages: [], isLoading: false }),
}))
