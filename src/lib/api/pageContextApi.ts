import apiClient from '@/lib/apiClient'
import type {
  PageContextResponse,
  PageContextsResponse,
  UpsertPageContextRequest,
  BulkUpsertPageContextRequest,
  BulkUpsertPageContextResponse,
} from '@/types/pageContext'

export async function getPageContexts(portfolioId: string): Promise<PageContextsResponse> {
  const { data } = await apiClient.get<PageContextsResponse>(`/api/v1/portfolios/${portfolioId}/pages/contexts`)
  return data
}

export async function upsertPageContext(
  portfolioId: string,
  pageNumber: number,
  body: UpsertPageContextRequest
): Promise<PageContextResponse> {
  const { data } = await apiClient.put<PageContextResponse>(
    `/api/v1/portfolios/${portfolioId}/pages/${pageNumber}/context`,
    body
  )
  return data
}

export async function deletePageContext(portfolioId: string, pageNumber: number): Promise<void> {
  await apiClient.delete(`/api/v1/portfolios/${portfolioId}/pages/${pageNumber}/context`)
}

export async function bulkUpsertPageContexts(
  portfolioId: string,
  body: BulkUpsertPageContextRequest
): Promise<BulkUpsertPageContextResponse> {
  const { data } = await apiClient.put<BulkUpsertPageContextResponse>(
    `/api/v1/portfolios/${portfolioId}/pages/contexts`,
    body
  )
  return data
}
