import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { MainLayout } from '@/components/MainLayout'

export const metadata: Metadata = {
  title: 'Posta',
  description: '포트폴리오 공유 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css'
        />
      </head>
      <body className='antialiased'>
        <QueryProvider>
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  )
}
