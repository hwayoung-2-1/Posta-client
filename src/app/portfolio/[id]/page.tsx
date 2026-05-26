import Image from 'next/image'
import ChatPanel from '@/components/ChatPanel'
import { getPortfolioById } from '@/lib/api/portfolioApi'
import { NotionViewer } from '@/components/portfolio/NotionViewer'
import { PdfViewer } from '@/components/portfolio/PdfViewer'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params
  const portfolio = await getPortfolioById(Number(id))

  return (
    <>
      <div className='mr-[496px] flex flex-col items-center gap-6 px-8 py-8'>
        {portfolio.type === 'notion' && portfolio.notionUrl ? (
          <NotionViewer url={portfolio.notionUrl} />
        ) : (
          <PdfViewer pages={portfolio.pdfPages ?? []} />
        )}

        <div className='w-full mt-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='size-10 overflow-hidden rounded-full shrink-0'>
              <Image
                src={portfolio.authorProfileUrl}
                alt='프로필'
                width={40}
                height={40}
                className='object-cover size-full'
              />
            </div>
            <span className='text-base leading-6 text-white'>{portfolio.authorName}</span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='flex size-10 items-center justify-center rounded-[6px]'
              style={{ background: 'var(--color-primary)' }}
            >
              <Image src='/heart.svg' alt='좋아요' width={19} height={17} />
            </button>
            <button
              className='flex size-10 items-center justify-center rounded-[6px]'
              style={{ background: 'var(--color-primary)' }}
            >
              <Image
                src='/bookmark.svg'
                alt='북마크'
                width={14}
                height={17}
                style={{ filter: 'brightness(0)' }}
              />
            </button>
          </div>
        </div>
      </div>

      <ChatPanel />
    </>
  )
}
