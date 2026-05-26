'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useChatStore } from '@/store/chatStore'
import { getSuggestedQuestions } from '@/lib/api/portfolioApi'

interface ChatPanelProps {
  portfolioId: string
}

export default function ChatPanel({ portfolioId }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading, initSession, sendMessage, clearSession } = useChatStore()

  const { data: suggestedData } = useQuery({
    queryKey: ['suggested-questions', portfolioId],
    queryFn: () => getSuggestedQuestions(portfolioId),
    staleTime: Infinity,
  })

  useEffect(() => {
    initSession(portfolioId)
    return () => clearSession()
  }, [portfolioId])

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

  const handleSuggestedClick = async (question: string) => {
    if (isLoading) return
    await sendMessage(question)
  }

  const showSuggestions = messages.length === 0 && !isLoading && (suggestedData?.questions?.length ?? 0) > 0

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='fixed right-0 top-8 z-20 flex size-9 cursor-pointer items-center justify-center rounded-l-[6px]'
        style={{ background: 'var(--color-primary)' }}
      >
        <Image src='/chevrons-right.svg' alt='패널 열기' width={12} height={11} className='rotate-180' />
      </button>
    )
  }

  return (
    <div
      className='fixed right-0 top-0 z-20 flex h-screen w-[496px] flex-col border-l'
      style={{ background: '#2a2a29', borderColor: 'var(--color-border)' }}
    >
      <button
        onClick={() => setIsOpen(false)}
        className='absolute left-[31px] top-8 flex size-9 cursor-pointer items-center justify-center rounded-[6px]'
        style={{ background: 'var(--color-primary)' }}
      >
        <Image src='/chevrons-right.svg' alt='패널 닫기' width={12} height={11} />
      </button>

      <div className='flex flex-1 flex-col overflow-y-auto overscroll-contain pt-20'>
        <div className='flex-1' />
        <div className='flex flex-col gap-4 p-6 pb-0'>

          {/* 추천 질문 — 대화 전에만 표시 */}
          {showSuggestions && (
            <div className='flex flex-col gap-2'>
              <p className='px-1 text-xs text-white/30'>추천 질문</p>
              {suggestedData!.questions.map((q) => (
                <button
                  key={q.questionId}
                  onClick={() => handleSuggestedClick(q.question)}
                  className='rounded-xl border px-4 py-3 text-left text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white'
                  style={{ borderColor: 'var(--color-border)', background: '#1e1e1d' }}
                >
                  {q.question}
                </button>
              ))}
            </div>
          )}

          {messages.length === 0 && !isLoading && !showSuggestions && (
            <p className='px-4 text-sm text-white/30'>질문을 입력해 포트폴리오에 대해 물어보세요.</p>
          )}

          {messages.map((msg) => (
            <div key={msg.messageId} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div
                  className='max-w-[448px] rounded-2xl px-4 py-4 text-white'
                  style={{ background: '#181817' }}
                >
                  <p className='text-base leading-6'>{msg.content}</p>
                </div>
              ) : (
                <div className='max-w-[448px] px-4 py-4'>
                  <p className='text-base leading-6 text-white whitespace-pre-wrap'>{msg.content}</p>
                  {msg.answerable === false && (
                    <p className='mt-1 text-xs text-white/40'>포트폴리오에서 관련 정보를 찾을 수 없습니다.</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start px-4 py-4'>
              <p className='text-sm text-white/40'>답변 생성 중...</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className='p-6 pt-4'>
        <div
          className='flex h-12 items-center rounded-2xl px-5'
          style={{ background: '#464645' }}
        >
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='무엇이든 물어보세요...'
            disabled={isLoading}
            className='flex-1 bg-transparent text-base leading-6 text-white outline-none placeholder:text-[#a8a8a6] disabled:opacity-50'
          />
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='ml-2 disabled:opacity-30'
          >
            <Image src='/search.svg' alt='전송' width={16} height={16} className='opacity-60' />
          </button>
        </div>
      </form>
    </div>
  )
}
