export type QuestionInsightStatus = 'OPEN' | 'REVIEWED' | 'RESOLVED' | 'IGNORED'

export interface QuestionInsightItemResponse {
  clusterId: string
  title: string
  summary: string
  category: string
  questionCount: number
  status: QuestionInsightStatus
  sampleQuestions: string[]
  firstAskedAt: string
  lastAskedAt: string
}

export interface QuestionInsightsResponse {
  portfolioId: string
  totalQuestions: number
  clusters: QuestionInsightItemResponse[]
  page: number
  size: number
  totalElements: number
}

export interface GetQuestionInsightsParams {
  status?: QuestionInsightStatus
  page?: number
  size?: number
}

export interface QuestionInsightQuestionResponse {
  messageId: string
  content: string
  askedAt: string
}

export interface QuestionInsightDetailResponse {
  clusterId: string
  title: string
  summary: string
  category: string
  questionCount: number
  status: QuestionInsightStatus
  questions: QuestionInsightQuestionResponse[]
  recommendedAction: string | null
}

export interface UpdateQuestionInsightStatusRequest {
  status: QuestionInsightStatus
}

export interface UpdateQuestionInsightStatusResponse {
  clusterId: string
  status: QuestionInsightStatus
}
