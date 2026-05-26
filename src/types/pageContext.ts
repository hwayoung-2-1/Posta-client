export interface PageContextResponse {
  id: string
  portfolioId: string
  pageNumber: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface PageContextListItemResponse {
  pageNumber: number
  contextId: string | null
  content: string | null
  hasContent: boolean
  createdAt: string | null
  updatedAt: string | null
}

export interface PageContextsResponse {
  portfolioId: string
  pageCount: number
  pages: PageContextListItemResponse[]
}

export interface UpsertPageContextRequest {
  content: string
}

export interface BulkUpsertPageContextItem {
  pageNumber: number
  content: string
}

export interface BulkUpsertPageContextRequest {
  contexts: BulkUpsertPageContextItem[]
}

export interface BulkUpsertPageContextResponse {
  portfolioId: string
  updatedCount: number
  contexts: PageContextResponse[]
}
