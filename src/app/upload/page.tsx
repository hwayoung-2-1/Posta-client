'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { uploadPdfPortfolio, getProcessingStatus } from '@/lib/api/portfolioApi'
import type { ProcessingStatusResponse } from '@/types/portfolio'

type UploadStep = 'form' | 'processing' | 'done' | 'error'

const STEP_LABELS: Record<string, string> = {
  PDF_PARSE: 'PDF 파싱',
  IMAGE_EXTRACT: '이미지 추출',
  TEXT_EXTRACT: '텍스트 추출',
  EMBEDDING: '임베딩 생성',
  INDEX: '인덱싱',
}

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<UploadStep>('form')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatusResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await getProcessingStatus(id)
        setStatus(res)
        if (res.status === 'READY' || res.status === 'PUBLISHED') {
          clearInterval(interval)
          setStep('done')
        } else if (res.status === 'FAILED') {
          clearInterval(interval)
          setErrorMsg(res.failureReason ?? '처리 중 오류가 발생했습니다.')
          setStep('error')
        }
      } catch {
        clearInterval(interval)
        setErrorMsg('상태를 확인할 수 없습니다.')
        setStep('error')
      }
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return

    setStep('processing')
    try {
      const res = await uploadPdfPortfolio(file, {
        title: title.trim(),
        description: description.trim() || undefined,
      })
      setPortfolioId(res.id)
      await pollStatus(res.id)
    } catch {
      setErrorMsg('업로드에 실패했습니다.')
      setStep('error')
    }
  }

  if (step === 'processing' || step === 'done') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center px-6'>
        <div className='w-full max-w-[480px]'>
          <h1 className='mb-2 text-xl font-medium text-white'>
            {step === 'done' ? '처리 완료!' : '포트폴리오 처리 중...'}
          </h1>
          <p className='mb-8 text-sm text-white/50'>
            {step === 'done'
              ? '포트폴리오가 준비됐습니다.'
              : 'PDF를 분석하고 있습니다. 잠시 기다려주세요.'}
          </p>

          {status && (
            <div className='flex flex-col gap-3'>
              {status.steps.map((s) => (
                <div key={s.type} className='flex items-center gap-3'>
                  <div
                    className='size-2 shrink-0 rounded-full'
                    style={{
                      background:
                        s.status === 'DONE'
                          ? 'var(--color-primary)'
                          : s.status === 'RUNNING'
                            ? '#60a5fa'
                            : s.status === 'FAILED'
                              ? '#f87171'
                              : 'var(--color-border)',
                    }}
                  />
                  <span className='text-sm text-white/70'>
                    {STEP_LABELS[s.type] ?? s.type}
                  </span>
                  <span className='ml-auto text-xs text-white/30'>{s.status}</span>
                </div>
              ))}
            </div>
          )}

          {step === 'done' && portfolioId && (
            <button
              onClick={() => router.push(`/portfolio/${portfolioId}`)}
              className='mt-8 h-11 w-full rounded-[8px] text-sm font-medium text-black'
              style={{ background: 'var(--color-primary)' }}
            >
              포트폴리오 보러 가기
            </button>
          )}
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center px-6'>
        <div className='w-full max-w-[480px]'>
          <h1 className='mb-2 text-xl font-medium text-white'>오류가 발생했습니다</h1>
          <p className='mb-8 text-sm text-white/50'>{errorMsg}</p>
          <button
            onClick={() => { setStep('form'); setErrorMsg(null) }}
            className='h-11 w-full rounded-[8px] text-sm font-medium text-black'
            style={{ background: 'var(--color-primary)' }}
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-[480px]'>
        <h1 className='mb-8 text-xl font-medium text-white'>포트폴리오 업로드</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/70'>제목 *</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='포트폴리오 제목'
              required
              className='h-11 rounded-[8px] border bg-[var(--color-surface)] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/70'>설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='포트폴리오에 대한 간단한 설명'
              rows={3}
              className='rounded-[8px] border bg-[var(--color-surface)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40 resize-none'
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm text-white/70'>PDF 파일 *</label>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed transition-colors hover:border-white/40'
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <span className='text-sm text-white/50'>
                {file ? file.name : 'PDF 파일을 선택하세요'}
              </span>
              {!file && <span className='text-xs text-white/30'>클릭해서 업로드</span>}
            </button>
            <input
              ref={fileRef}
              type='file'
              accept='application/pdf'
              onChange={handleFileChange}
              className='hidden'
            />
          </div>

          <button
            type='submit'
            disabled={!file || !title.trim()}
            className='mt-2 h-11 rounded-[8px] text-sm font-medium text-black transition-opacity disabled:opacity-40'
            style={{ background: 'var(--color-primary)' }}
          >
            업로드
          </button>
        </form>
      </div>
    </div>
  )
}
