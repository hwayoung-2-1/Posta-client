import { PDFDocument } from 'pdf-lib'
import type { PageSize } from '@/types/portfolio'

export async function getPdfPageSizes(pdfBuffer: ArrayBuffer): Promise<PageSize[]> {
  const pdfDoc = await PDFDocument.load(pdfBuffer)
  return pdfDoc.getPages().map((page) => {
    const { width, height } = page.getSize()
    return { width, height, aspectRatio: width / height }
  })
}

export async function getPdfPageSizesFromUrl(url: string): Promise<PageSize[]> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return getPdfPageSizes(buffer)
}

export async function getPdfPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const pdfDoc = await PDFDocument.load(pdfBuffer)
  return pdfDoc.getPageCount()
}
