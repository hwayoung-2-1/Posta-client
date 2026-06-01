export type PortfolioStatus = 'DRAFT' | 'PROCESSING' | 'READY' | 'PUBLISHED' | 'FAILED' | 'DELETED'
export type PortfolioVisibility = 'private' | 'public' | 'link_only'

export interface PdfMetadataResponse {
  originalFilename: string
  contentType: string
  size: number
}

// 피드 목록
export interface PortfolioListItemResponse {
  portfolioId: string
  title: string
  ownerName: string
  thumbnailUrl: string | null
  roles: string[]
  skills: string[]
  saved: boolean
}

export interface PortfolioListResponse {
  content: PortfolioListItemResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface GetPortfoliosParams {
  page?: number
  size?: number
  role?: string
  skill?: string
  name?: string
  keyword?: string
}

// 상세
export interface PortfolioDetailResponse {
  id: string
  ownerId: string
  title: string
  description: string | null
  visibility: PortfolioVisibility
  pageCount: number
  pdf: PdfMetadataResponse | null
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

// 업로드
export interface UploadPortfolioPdfResponse {
  id: string
  title: string
  description: string | null
  visibility: string
  pageCount: number
  pdf: PdfMetadataResponse | null
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface UploadPortfolioResponse {
  portfolioId: string
  status: PortfolioStatus
  fileUrl: string
  processingStatusUrl: string
}

// 수정
export interface UpdatePortfolioRequest {
  title?: string
  description?: string
  visibility?: PortfolioVisibility
  roleIds?: string[]
  skillIds?: string[]
}

export interface UpdatePortfolioResponse {
  portfolioId: string
  title: string
  visibility: PortfolioVisibility
  status: PortfolioStatus
}

// 발행
export interface PublishPortfolioResponse {
  portfolioId: string
  status: PortfolioStatus
  publicSlug: string
  publishedAt: string
}

// 처리 상태
export interface ProcessingStepResponse {
  type: string
  status: string
}

export interface ProcessingStatusResponse {
  portfolioId: string
  status: PortfolioStatus
  steps: ProcessingStepResponse[]
  failureReason: string | null
}

// PDF 뷰 URL
export interface PdfViewUrlResponse {
  portfolioId: string
  url: string
  expiresAt: string
}

// 요약
export interface SummaryResponse {
  portfolioId: string
  summaryType: 'SHORT' | 'DETAILED'
  content: string
}

// 추천 질문
export interface SuggestedQuestionItemResponse {
  questionId: string
  pageNumber: number
  question: string
}

export interface SuggestedQuestionsResponse {
  questions: SuggestedQuestionItemResponse[]
}

// 저장된 포트폴리오
export interface SavedPortfolioListItemResponse {
  portfolioId: string
  title: string
  ownerName: string
  thumbnailUrl: string | null
  savedAt: string
}

export interface SavedPortfolioListResponse {
  content: SavedPortfolioListItemResponse[]
  page: number
  size: number
  totalElements: number
}

// 리인덱스
export interface ReindexResponse {
  portfolioId: string
  jobId: string
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED'
}

// UI 전용 — PDF 뷰어에서 사용
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

// 페이지 상세
export interface PageDetailResponse {
  pageId: string
  portfolioId: string
  pageNumber: number
  pageImageUrl: string | null
  extractedText: string | null
  ownerNote: string | null
}
