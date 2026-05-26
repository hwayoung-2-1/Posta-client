export type PortfolioType = 'pdf' | 'notion'

export interface PageSize {
  width: number
  height: number
  aspectRatio: number
}

export interface PdfPageInfo {
  pageNumber: number
  imageUrl: string
  size: PageSize
}

export interface Portfolio {
  id: number
  title: string
  authorName: string
  authorProfileUrl: string
  thumbnailUrl: string
  type: PortfolioType
  notionUrl?: string
  pdfPages?: PdfPageInfo[]
  likeCount: number
  isLiked: boolean
  isBookmarked: boolean
  createdAt: string
}

export interface PortfolioListItem {
  id: number
  authorName: string
  authorProfileUrl: string
  thumbnailUrl: string
  type: PortfolioType
  likeCount: number
}
