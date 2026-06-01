import apiClient from '@/lib/apiClient'
import type { UserMeResponse, UpdateUserRequest, UpdateUserResponse } from '@/types/user'

export async function getMe(): Promise<UserMeResponse> {
  const { data } = await apiClient.get<UserMeResponse>('/api/v1/users/me')
  return data
}

export async function updateMe(body: UpdateUserRequest): Promise<UpdateUserResponse> {
  const { data } = await apiClient.patch<UpdateUserResponse>('/api/v1/users/me', body)
  return data
}
