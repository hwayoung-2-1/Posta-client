interface NotionViewerProps {
  url: string
}

export function NotionViewer({ url }: NotionViewerProps) {
  return (
    <div className='w-full min-h-screen rounded-lg overflow-hidden border border-white/20'>
      <iframe
        src={url}
        className='w-full min-h-screen'
        title='Notion 포트폴리오'
        allowFullScreen
      />
    </div>
  )
}
