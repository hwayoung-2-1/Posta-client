'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '@/store/chatStore'

interface ChatPanelProps {
  portfolioId: string
}

export default function ChatPanel({ portfolioId }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const { messages, isLoading, initSession, sendMessage, clearSession } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initSession(portfolioId)
    return () => clearSession()
  }, [portfolioId, initSession, clearSession])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-8 z-20 flex size-9 cursor-pointer items-center justify-center rounded-l-[6px]"
        style={{ background: 'var(--color-primary)' }}
      >
        <Image src="/chevrons-right.svg" alt="패널 열기" width={12} height={11} className="rotate-180" />
      </button>
    )
  }

  return (
    <div
      className="fixed right-0 top-0 z-20 flex h-screen w-full flex-col border-l sm:w-[496px]"
      style={{ background: '#2a2a29', borderColor: 'var(--color-border)' }}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute left-[31px] top-8 flex size-9 cursor-pointer items-center justify-center rounded-[6px]"
        style={{ background: 'var(--color-primary)' }}
      >
        <Image src="/chevrons-right.svg" alt="패널 닫기" width={12} height={11} />
      </button>

      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain pt-20">
        <div className="flex-1" />
        <div className="flex flex-col gap-4 p-6 pb-0">
          {messages.map((msg) => (
            <div key={msg.messageId} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div
                  className="max-w-[448px] rounded-2xl px-4 py-4 text-white"
                  style={{ background: '#181817' }}
                >
                  <p className="text-base leading-6">{msg.content}</p>
                </div>
              ) : (
                <p className="max-w-[448px] px-4 py-4 text-base leading-6 text-white whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <p className="px-4 py-4 text-base leading-6 text-white/50">응답 중...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-4">
        <div
          className="flex h-12 items-center rounded-2xl px-5"
          style={{ background: '#464645' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="무엇이든 물어보세요..."
            className="flex-1 bg-transparent text-base leading-6 text-white outline-none placeholder:text-[#a8a8a6]"
          />
        </div>
      </form>
    </div>
  )
}
