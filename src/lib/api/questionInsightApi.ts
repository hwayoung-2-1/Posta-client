import apiClient from '@/lib/apiClient'
import type {
  GetQuestionInsightsParams,
  QuestionInsightsResponse,
  QuestionInsightDetailResponse,
  UpdateQuestionInsightStatusRequest,
  UpdateQuestionInsightStatusResponse,
} from '@/types/questionInsight'
import type { ReindexResponse } from '@/types/portfolio'

export async function getQuestionInsights(
  portfolioId: string,
  params: GetQuestionInsightsParams = {}
): Promise<QuestionInsightsResponse> {
  const { data } = await apiClient.get<QuestionInsightsResponse>(
    `/api/v1/portfolios/${portfolioId}/question-insights`,
    { params }
  )
  return data
}

export async function getQuestionInsightDetail(
  portfolioId: string,
  clusterId: string
): Promise<QuestionInsightDetailResponse> {
  const { data } = await apiClient.get<QuestionInsightDetailResponse>(
    `/api/v1/portfolios/${portfolioId}/question-insights/${clusterId}`
  )
  return data
}

export async function updateQuestionInsightStatus(
  portfolioId: string,
  clusterId: string,
  body: UpdateQuestionInsightStatusRequest
): Promise<UpdateQuestionInsightStatusResponse> {
  const { data } = await apiClient.patch<UpdateQuestionInsightStatusResponse>(
    `/api/v1/portfolios/${portfolioId}/question-insights/${clusterId}`,
    body
  )
  return data
}

export async function rebuildQuestionInsights(portfolioId: string): Promise<ReindexResponse> {
  const { data } = await apiClient.post<ReindexResponse>(
    `/api/v1/portfolios/${portfolioId}/question-insights/rebuild`
  )
  return data
}
