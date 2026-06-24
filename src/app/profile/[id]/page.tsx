'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FloatingButtons from '@/components/profile/FloatingButtons'
import AskPanel from '@/components/profile/AskPanel'
import FaqPanel from '@/components/profile/FaqPanel'
import DeleteDialog from '@/components/profile/DeleteDialog'
import WriteStep from '@/components/upload/WriteStep'
import { PdfViewer } from '@/components/portfolio/PdfViewer'
import { deletePortfolio, getPortfolioPdfUrl } from '@/lib/api/portfolioApi'

type Panel = 'ask' | 'faq' | null

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>(null)
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    getPortfolioPdfUrl(id).then(setPdfUrl).catch(() => {})
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
      <div className="mx-auto flex w-full max-w-[1840px] flex-col items-center gap-6 px-8 py-8 pb-32">
        <PdfViewer pdfUrl={pdfUrl} />
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
