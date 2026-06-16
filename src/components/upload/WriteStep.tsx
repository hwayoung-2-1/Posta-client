'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from './Button'
import { getPortfolioPdfUrl, updatePortfolio, saveOwnerNote } from '@/lib/api/portfolioApi'

type Selection = 'intro' | number

interface WriteStepProps {
  mode: 'file' | 'link'
  portfolioId?: string
  pageCount?: number
  totalPages?: number
  onComplete: () => void
  editable?: boolean
  onDelete?: () => void
}

export function WriteStep({
  mode,
  portfolioId,
  pageCount,
  totalPages = 31,
  onComplete,
  editable = false,
  onDelete,
}: WriteStepProps) {
  const [selected, setSelected] = useState<Selection>(mode === 'link' ? 1 : 'intro')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [pageImages, setPageImages] = useState<Record<number, string | null>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!portfolioId || mode !== 'file') return

    const renderPages = async () => {
      const pdfUrl = await getPortfolioPdfUrl(portfolioId)
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString()

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      const images: Record<number, string> = {}

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, canvas, viewport }).promise
        images[i] = canvas.toDataURL()
      }

      URL.revokeObjectURL(pdfUrl)
      setPageImages(images)
    }

    renderPages().catch(() => {})
  }, [portfolioId, mode])

  const handleComplete = async () => {
    if (!portfolioId) {
      onComplete()
      return
    }

    setIsSaving(true)
    try {
      if (drafts['intro']) {
        await updatePortfolio(portfolioId, { description: drafts['intro'] })
      }

      const pageNoteEntries = Object.entries(drafts).filter(
        ([key, value]) => key !== 'intro' && key !== 'link' && value.trim()
      )
      await Promise.allSettled(
        pageNoteEntries.map(([key, content]) =>
          saveOwnerNote(portfolioId, Number(key), content)
        )
      )
    } finally {
      setIsSaving(false)
      onComplete()
    }
  }

  const key = mode === 'link' ? 'link' : String(selected)
  const isIntro = mode === 'file' && selected === 'intro'
  const displayPageCount = mode === 'file' ? (Object.keys(pageImages).length || pageCount || 0) : totalPages

  const title = isIntro ? '포트폴리오 소개' : `Page ${mode === 'link' ? 1 : selected}/${displayPageCount}`
  const subtitle = isIntro
    ? '포트폴리오에 대한 간단한 소개를 작성해주세요.'
    : '해당 페이지에 대한 세부적인 내용을 작성해주세요.'
  const placeholder = isIntro ? '포트폴리오 소개, 슬로건, 등...' : '프로젝트 세부 설명, 뒷이야기, 등...'

  return (
    <div className="flex min-h-full justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div className="flex w-full max-w-[1336px] flex-col items-stretch gap-6 lg:flex-row lg:items-start">
        {mode === 'file' ? (
          <div className="flex w-full flex-col items-end gap-5 lg:w-[536px] lg:shrink-0">
            <DescriptionCard
              active={isIntro}
              introText={drafts['intro'] ?? ''}
              onClick={() => setSelected('intro')}
            />
            {Object.keys(pageImages).map(Number).sort((a, b) => a - b).map((n) => (
              <PageThumb
                key={n}
                n={n}
                src={pageImages[n] ?? null}
                active={selected === n}
                onClick={() => setSelected(n)}
              />
            ))}
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full max-w-[960px] shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-border)] lg:h-[540px] lg:aspect-auto">
            <div className="absolute left-1/2 top-[calc(50%+36px)] h-[456px] w-[720px] max-w-none -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/upload/notion-embed.png"
                alt="포트폴리오 링크 미리보기"
                fill
                className="object-cover"
                sizes="720px"
              />
            </div>
          </div>
        )}

        <div className="flex min-h-[420px] w-full flex-1 flex-col items-end gap-6 lg:h-[952px] lg:min-h-0 lg:w-[776px] lg:flex-none">
          <div className="flex w-full flex-col items-start gap-2 text-white">
            <h2 className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px]">
              {title}
            </h2>
            <p className="text-[16px] font-normal leading-6">{subtitle}</p>
          </div>
          <textarea
            value={drafts[key] ?? ''}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full flex-1 resize-none rounded-[8px] border border-[var(--color-border)] p-[10px] text-[16px] font-medium leading-6 text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-border-strong)]"
          />
          <div className="flex items-center gap-4">
            {editable && (
              <button
                type="button"
                onClick={onDelete}
                className="flex h-10 w-[200px] items-center justify-center rounded-[6px] bg-[#e5484d] px-5 text-[14px] font-medium text-white"
              >
                삭제하기
              </button>
            )}
            <Button onClick={handleComplete} disabled={isSaving}>
              {isSaving ? '저장 중...' : '작성 완료'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteStep

interface DescriptionCardProps {
  active: boolean
  introText: string
  onClick: () => void
}

function DescriptionCard({ active, introText, onClick }: DescriptionCardProps) {
  return (
    <div className="w-full pl-14">
      <button
        type="button"
        onClick={onClick}
        className={`flex aspect-[480/270] w-full max-w-[480px] cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-[8px] bg-[var(--color-ink)] p-8 text-left text-white sm:p-16 ${
          active
            ? 'border-8 border-[var(--color-accent)]'
            : 'border border-[var(--color-border)]'
        }`}
      >
        <p className="w-full text-[20px] font-semibold leading-6">포트폴리오 소개</p>
        <p className="w-full overflow-hidden text-[16px] font-medium leading-6 text-[var(--color-muted)] line-clamp-4">
          {introText || '포트폴리오 소개, 슬로건, 등...'}
        </p>
      </button>
    </div>
  )
}

interface PageThumbProps {
  n: number
  src: string | null
  active: boolean
  onClick: () => void
}

function PageThumb({ n, src, active, onClick }: PageThumbProps) {
  return (
    <div className="flex w-full items-center gap-4">
      <p className="w-10 shrink-0 truncate text-[20px] font-semibold leading-6 text-white">
        {n}
      </p>
      <button
        type="button"
        onClick={onClick}
        className={`relative aspect-[480/270] w-full max-w-[480px] cursor-pointer overflow-hidden rounded-[8px] bg-[var(--color-ink)] ${
          active
            ? 'border-8 border-[var(--color-accent)]'
            : 'border border-[var(--color-border)]'
        }`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`포트폴리오 페이지 ${n}`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] text-[var(--color-muted)]">
            {n}p
          </div>
        )}
      </button>
    </div>
  )
}
