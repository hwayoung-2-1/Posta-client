'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getQuestionInsights,
  getQuestionInsightDetail,
  updateQuestionInsightStatus,
} from '@/lib/api/questionInsightApi'
import type { QuestionInsightStatus } from '@/types/questionInsight'

const STATUS_LABELS: Record<QuestionInsightStatus, string> = {
  OPEN: '미확인',
  REVIEWED: '검토 중',
  RESOLVED: '해결됨',
  IGNORED: '무시',
}

const STATUS_COLORS: Record<QuestionInsightStatus, string> = {
  OPEN: '#60a5fa',
  REVIEWED: '#fbbf24',
  RESOLVED: '#4ade80',
  IGNORED: '#6b7280',
}

export default function InsightsPage() {
  const { id: portfolioId } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<QuestionInsightStatus | undefined>()

  const { data, isLoading } = useQuery({
    queryKey: ['question-insights', portfolioId, statusFilter],
    queryFn: () => getQuestionInsights(portfolioId, { status: statusFilter }),
  })

  const { data: detail } = useQuery({
    queryKey: ['question-insight-detail', portfolioId, selectedClusterId],
    queryFn: () => getQuestionInsightDetail(portfolioId, selectedClusterId!),
    enabled: !!selectedClusterId,
  })

  const statusMutation = useMutation({
    mutationFn: ({ clusterId, status }: { clusterId: string; status: QuestionInsightStatus }) =>
      updateQuestionInsightStatus(portfolioId, clusterId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-insights', portfolioId] })
      queryClient.invalidateQueries({ queryKey: ['question-insight-detail', portfolioId, selectedClusterId] })
    },
  })

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* 목록 패널 */}
      <div
        className='flex w-[360px] shrink-0 flex-col border-r'
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className='border-b px-6 py-5' style={{ borderColor: 'var(--color-border)' }}>
          <h1 className='text-base font-medium text-white'>질문 인사이트</h1>
          {data && (
            <p className='mt-1 text-xs text-white/40'>총 {data.totalQuestions}개 질문</p>
          )}

          <div className='mt-3 flex flex-wrap gap-1'>
            {([undefined, 'OPEN', 'REVIEWED', 'RESOLVED', 'IGNORED'] as (QuestionInsightStatus | undefined)[]).map((s) => (
              <button
                key={String(s)}
                onClick={() => setStatusFilter(s)}
                className='rounded-full border px-2.5 py-0.5 text-xs transition-colors'
                style={{
                  borderColor: statusFilter === s ? 'var(--color-primary)' : 'var(--color-border)',
                  color: statusFilter === s ? 'var(--color-primary)' : 'var(--color-fg)',
                }}
              >
                {s ? STATUS_LABELS[s] : '전체'}
              </button>
            ))}
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {isLoading && (
            <p className='px-6 py-4 text-sm text-white/40'>불러오는 중...</p>
          )}
          {data?.clusters.map((cluster) => (
            <button
              key={cluster.clusterId}
              onClick={() => setSelectedClusterId(cluster.clusterId)}
              className='w-full border-b px-6 py-4 text-left transition-colors hover:bg-white/5'
              style={{
                borderColor: 'var(--color-border)',
                background: selectedClusterId === cluster.clusterId ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <div className='mb-1 flex items-center justify-between gap-2'>
                <p className='truncate text-sm font-medium text-white'>{cluster.title}</p>
                <span
                  className='shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-black'
                  style={{ background: STATUS_COLORS[cluster.status as QuestionInsightStatus] ?? '#6b7280' }}
                >
                  {STATUS_LABELS[cluster.status as QuestionInsightStatus] ?? cluster.status}
                </span>
              </div>
              <p className='line-clamp-2 text-xs text-white/50'>{cluster.summary}</p>
              <p className='mt-1 text-xs text-white/30'>
                {cluster.questionCount}개 질문 · {cluster.category}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 상세 패널 */}
      <div className='flex-1 overflow-y-auto px-8 py-6'>
        {!selectedClusterId && (
          <div className='flex h-full items-center justify-center'>
            <p className='text-sm text-white/30'>클러스터를 선택하면 상세 내용을 볼 수 있습니다.</p>
          </div>
        )}

        {detail && (
          <div>
            <div className='mb-6 flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-lg font-medium text-white'>{detail.title}</h2>
                <p className='mt-1 text-sm text-white/50'>{detail.summary}</p>
                {detail.recommendedAction && (
                  <p className='mt-2 text-xs text-white/40'>권장 액션: {detail.recommendedAction}</p>
                )}
              </div>

              <div className='flex shrink-0 flex-col gap-1'>
                <p className='text-xs text-white/30'>상태 변경</p>
                <div className='flex flex-col gap-1'>
                  {(Object.keys(STATUS_LABELS) as QuestionInsightStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => statusMutation.mutate({ clusterId: detail.clusterId, status: s })}
                      disabled={statusMutation.isPending || detail.status === s}
                      className='rounded px-3 py-1 text-xs font-medium text-black transition-opacity disabled:opacity-40'
                      style={{ background: STATUS_COLORS[s] }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <h3 className='text-sm font-medium text-white/70'>질문 목록 ({detail.questionCount})</h3>
              {detail.questions.map((q) => (
                <div
                  key={q.messageId}
                  className='rounded-[8px] border px-4 py-3'
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                >
                  <p className='text-sm text-white'>{q.content}</p>
                  <p className='mt-1 text-xs text-white/30'>
                    {new Date(q.askedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
