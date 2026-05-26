import ChatPanel from '@/components/ChatPanel'
import { PdfViewer } from '@/components/portfolio/PdfViewer'
import { SaveButton } from '@/components/portfolio/SaveButton'
import { getPortfolio, getPageDetail } from '@/lib/api/portfolioApi'
import type { PdfPageInfo } from '@/types/portfolio'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params
  const portfolio = await getPortfolio(id)

  const pageInfos: PdfPageInfo[] = await Promise.all(
    Array.from({ length: portfolio.pageCount }, (_, i) =>
      getPageDetail(id, i + 1).then((page) => ({
        pageNumber: page.pageNumber,
        imageUrl: page.pageImageUrl ?? '',
        size: { width: 1, height: 1.414, aspectRatio: 1 / 1.414 },
      }))
    )
  )

  return (
    <>
      <div className='mr-[496px] flex flex-col items-center gap-6 px-8 py-8'>
        <div className='flex w-full items-start justify-between gap-4'>
          <div>
            <h1 className='mb-1 text-xl font-medium text-white'>{portfolio.title}</h1>
            {portfolio.description && (
              <p className='text-sm text-white/50'>{portfolio.description}</p>
            )}
          </div>
          <SaveButton portfolioId={id} />
        </div>

        <PdfViewer pages={pageInfos} />
      </div>

      <ChatPanel portfolioId={id} />
    </>
  )
}
