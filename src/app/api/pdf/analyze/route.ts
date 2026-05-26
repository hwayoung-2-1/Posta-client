import { NextRequest, NextResponse } from 'next/server'
import { getPdfPageSizes, getPdfPageSizesFromUrl } from '@/lib/utils/pdfAnalyzer'

// POST /api/pdf/analyze — 업로드된 PDF 파일의 페이지 크기 분석
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file')

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: 'PDF 파일이 필요합니다' }, { status: 400 })
      }

      const buffer = await file.arrayBuffer()
      const pageSizes = await getPdfPageSizes(buffer)

      return NextResponse.json({ pageSizes, pageCount: pageSizes.length })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'url 또는 파일이 필요합니다' }, { status: 400 })
    }

    const pageSizes = await getPdfPageSizesFromUrl(url)
    return NextResponse.json({ pageSizes, pageCount: pageSizes.length })
  } catch (error) {
    console.error('PDF 분석 실패:', error)
    return NextResponse.json({ error: 'PDF 분석 중 오류가 발생했습니다' }, { status: 500 })
  }
}
