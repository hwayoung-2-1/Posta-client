import apiClient from '@/lib/apiClient'
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '@/types/auth'

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', body)
  return data
}

export async function signup(body: SignupRequest): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>('/api/v1/auth/signup', body)
  return data
}
