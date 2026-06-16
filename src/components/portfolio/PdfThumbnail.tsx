'use client'

import { useEffect, useRef, useState } from 'react'
import { getPortfolioPdfUrl } from '@/lib/api/portfolioApi'

interface PdfThumbnailProps {
  portfolioId: string
  alt?: string
  className?: string
}

export function PdfThumbnail({ portfolioId, alt = '포트폴리오 썸네일', className }: PdfThumbnailProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const renderedId = useRef<string | null>(null)

  useEffect(() => {
    if (renderedId.current === portfolioId) return
    renderedId.current = portfolioId

    async function render() {
      const pdfUrl = await getPortfolioPdfUrl(portfolioId)
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString()

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, canvas, viewport }).promise
      setDataUrl(canvas.toDataURL())
      URL.revokeObjectURL(pdfUrl)
    }

    render().catch(() => {})
  }, [portfolioId])

  if (!dataUrl) {
    return (
      <div className={`flex items-center justify-center bg-white/5 text-sm text-white/40 ${className ?? ''}`}>
        불러오는 중…
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt={alt} className={className} />
  )
}
