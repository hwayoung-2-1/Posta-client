import apiClient from '@/lib/apiClient'
import type {
  GetPortfoliosParams,
  PortfolioListResponse,
  PortfolioDetailResponse,
  UploadPortfolioPdfResponse,
  UpdatePortfolioRequest,
  UpdatePortfolioResponse,
  PublishPortfolioResponse,
  ProcessingStatusResponse,
  PdfViewUrlResponse,
  SummaryResponse,
  SuggestedQuestionsResponse,
  SavedPortfolioListResponse,
  ReindexResponse,
  PageDetailResponse,
} from '@/types/portfolio'

export async function getPortfolios(params: GetPortfoliosParams = {}): Promise<PortfolioListResponse> {
  const { data } = await apiClient.get<PortfolioListResponse>('/api/v1/portfolios', { params })
  return data
}

export async function getPortfolio(portfolioId: string): Promise<PortfolioDetailResponse> {
  const { data } = await apiClient.get<PortfolioDetailResponse>(`/api/v1/portfolios/${portfolioId}`)
  return data
}

export async function uploadPdfPortfolio(
  file: File,
  params: { title: string; description?: string; visibility?: string }
): Promise<UploadPortfolioPdfResponse> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<UploadPortfolioPdfResponse>('/api/v1/portfolios/pdf', form, {
    params,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updatePortfolio(
  portfolioId: string,
  body: UpdatePortfolioRequest
): Promise<UpdatePortfolioResponse> {
  const { data } = await apiClient.patch<UpdatePortfolioResponse>(`/api/v1/portfolios/${portfolioId}`, body)
  return data
}

export async function deletePortfolio(portfolioId: string): Promise<void> {
  await apiClient.delete(`/api/v1/portfolios/${portfolioId}`)
}

export async function publishPortfolio(portfolioId: string): Promise<PublishPortfolioResponse> {
  const { data } = await apiClient.post<PublishPortfolioResponse>(`/api/v1/portfolios/${portfolioId}/publish`)
  return data
}

export async function getProcessingStatus(portfolioId: string): Promise<ProcessingStatusResponse> {
  const { data } = await apiClient.get<ProcessingStatusResponse>(`/api/v1/portfolios/${portfolioId}/processing-status`)
  return data
}

export async function getPdfViewUrl(portfolioId: string): Promise<PdfViewUrlResponse> {
  const { data } = await apiClient.get<PdfViewUrlResponse>(`/api/v1/portfolios/${portfolioId}/pdf/view-url`)
  return data
}

export async function getPortfolioSummary(portfolioId: string): Promise<SummaryResponse> {
  const { data } = await apiClient.get<SummaryResponse>(`/api/v1/portfolios/${portfolioId}/summary`)
  return data
}

export async function getSuggestedQuestions(portfolioId: string): Promise<SuggestedQuestionsResponse> {
  const { data } = await apiClient.get<SuggestedQuestionsResponse>(`/api/v1/portfolios/${portfolioId}/suggested-questions`)
  return data
}

export async function savePortfolio(portfolioId: string): Promise<void> {
  await apiClient.post(`/api/v1/portfolios/${portfolioId}/save`)
}

export async function unsavePortfolio(portfolioId: string): Promise<void> {
  await apiClient.delete(`/api/v1/portfolios/${portfolioId}/save`)
}

export async function getSavedPortfolios(params: { page?: number; size?: number } = {}): Promise<SavedPortfolioListResponse> {
  const { data } = await apiClient.get<SavedPortfolioListResponse>('/api/v1/users/me/saved-portfolios', { params })
  return data
}

export async function reindexPortfolio(portfolioId: string): Promise<ReindexResponse> {
  const { data } = await apiClient.post<ReindexResponse>(`/api/v1/portfolios/${portfolioId}/reindex`)
  return data
}

export async function getPageDetail(portfolioId: string, pageNumber: number): Promise<PageDetailResponse> {
  const { data } = await apiClient.get<PageDetailResponse>(`/api/v1/portfolios/${portfolioId}/pages/${pageNumber}`)
  return data
}

export async function saveOwnerNote(
  portfolioId: string,
  pageNumber: number,
  content: string
): Promise<{ pageId: string; pageNumber: number; ownerNote: string; reindexStatus: string }> {
  const { data } = await apiClient.patch(
    `/api/v1/portfolios/${portfolioId}/pages/${pageNumber}/owner-note`,
    { content }
  )
  return data
}
