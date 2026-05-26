export interface CreateChatSessionResponse {
  chatSessionId: string
  portfolioId: string
  viewerUserId: string
  createdAt: string
}

export interface SendChatMessageRequest {
  message: string
  currentPage?: number
}

export interface ChatSourceResponse {
  chunkId: string
  pageNumber: number
  sourceType: string
  snippet: string
  score: number
}

export interface SendChatMessageResponse {
  questionMessageId: string
  answerMessageId: string
  answer: string
  answerable: boolean
  sources: ChatSourceResponse[]
  questionAnalysisStatus: string
}

export interface ChatMessageItemResponse {
  messageId: string
  role: 'user' | 'assistant'
  content: string
  answerable: boolean | null
  sources: ChatSourceResponse[]
  createdAt: string
}

export interface ChatMessagesResponse {
  chatSessionId: string
  messages: ChatMessageItemResponse[]
}
