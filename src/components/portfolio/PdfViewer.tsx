'use client'

import { useEffect, useRef, useState } from 'react'

interface PdfViewerProps {
  pdfUrl: string | null
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [canvases, setCanvases] = useState<string[]>([])
  const renderedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!pdfUrl || pdfUrl === renderedUrl.current) return

    renderedUrl.current = pdfUrl
    setCanvases([])

    async function render() {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString()

      const pdf = await pdfjsLib.getDocument(pdfUrl!).promise
      const urls: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, canvas, viewport }).promise
        urls.push(canvas.toDataURL())
      }

      setCanvases(urls)
    }

    render().catch(() => {})
  }, [pdfUrl])

  if (!pdfUrl) {
    return (
      <div className='w-full flex items-center justify-center py-20 text-white/50'>
        PDF를 불러오는 중입니다…
      </div>
    )
  }

  if (canvases.length === 0) {
    return (
      <div className='w-full flex items-center justify-center py-20 text-white/50'>
        페이지를 렌더링하는 중입니다…
      </div>
    )
  }

  return (
    <>
      {canvases.map((src, i) => (
        <div key={i} className='w-full'>
          <div className='relative w-full overflow-hidden border border-white/20'>
            <img
              src={src}
              alt={`포트폴리오 페이지 ${i + 1}`}
              className='w-full object-cover'
            />
          </div>
        </div>
      ))}
    </>
  )
}
