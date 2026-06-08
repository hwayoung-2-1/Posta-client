'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FloatingButtons from '@/components/profile/FloatingButtons'
import AskPanel from '@/components/profile/AskPanel'
import FaqPanel from '@/components/profile/FaqPanel'
import DeleteDialog from '@/components/profile/DeleteDialog'
import WriteStep from '@/components/upload/WriteStep'
import { getPortfolio, deletePortfolio, getPdfViewUrl } from '@/lib/api/portfolioApi'
import type { PortfolioDetailResponse } from '@/types/portfolio'

type Panel = 'ask' | 'faq' | null

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>(null)
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioDetailResponse | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    getPortfolio(id).then(setPortfolio).catch(() => {})
    getPdfViewUrl(id).then((r) => setPdfUrl(r.url)).catch(() => {})
  }, [id])

  const handleConfirmDelete = async () => {
    try {
      await deletePortfolio(id)
    } catch {
      // silent
    }
    setShowDelete(false)
    setEditing(false)
    router.push('/profile')
  }

  if (editing) {
    return (
      <>
        <WriteStep
          mode="file"
          editable
          onComplete={() => setEditing(false)}
          onDelete={() => setShowDelete(true)}
        />
        {showDelete && (
          <DeleteDialog
            onCancel={() => setShowDelete(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto w-full max-w-[1840px]">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="h-[80vh] w-full border-0" title={portfolio?.title ?? '포트폴리오'} />
        ) : (
          <Image
            src="/profile/portfolio-full.png"
            alt="포트폴리오"
            width={1840}
            height={3680}
            className="h-auto w-full"
            priority
          />
        )}
      </div>

      <FloatingButtons
        onEdit={() => setEditing(true)}
        onFaq={() => setPanel('faq')}
        onAsk={() => setPanel('ask')}
      />

      {panel === 'ask' && <AskPanel onClose={() => setPanel(null)} />}
      {panel === 'faq' && <FaqPanel onClose={() => setPanel(null)} />}
    </div>
  )
}
