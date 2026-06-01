import apiClient from '@/lib/apiClient'
import type { SkillsResponse, RolesResponse } from '@/types/taxonomy'

export async function getSkills(): Promise<SkillsResponse> {
  const { data } = await apiClient.get<SkillsResponse>('/api/v1/skills')
  return data
}

export async function getRoles(): Promise<RolesResponse> {
  const { data } = await apiClient.get<RolesResponse>('/api/v1/roles')
  return data
}
