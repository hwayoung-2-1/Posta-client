import apiClient from '@/lib/apiClient'
import type {
  CreateChatSessionResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
  ChatMessagesResponse,
} from '@/types/chat'

export async function createChatSession(portfolioId: string): Promise<CreateChatSessionResponse> {
  const { data } = await apiClient.post<CreateChatSessionResponse>(
    `/api/v1/portfolios/${portfolioId}/chat-sessions`
  )
  return data
}

export async function getChatMessages(chatSessionId: string): Promise<ChatMessagesResponse> {
  const { data } = await apiClient.get<ChatMessagesResponse>(
    `/api/v1/chat-sessions/${chatSessionId}/messages`
  )
  return data
}

export async function sendChatMessage(
  chatSessionId: string,
  body: SendChatMessageRequest
): Promise<SendChatMessageResponse> {
  const { data } = await apiClient.post<SendChatMessageResponse>(
    `/api/v1/chat-sessions/${chatSessionId}/messages`,
    body
  )
  return data
}
