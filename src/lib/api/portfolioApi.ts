import apiClient from '@/lib/apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Portfolio, PortfolioListItem } from '@/types/portfolio'

export interface GetPortfoliosParams {
  page?: number
  size?: number
}

export async function getPortfolios(params: GetPortfoliosParams = {}) {
  const { data } = await apiClient.get<PaginatedResponse<PortfolioListItem>>('/portfolios', {
    params: { page: params.page ?? 0, size: params.size ?? 20 },
  })
  return data
}

export async function getPortfolioById(id: number) {
  const { data } = await apiClient.get<ApiResponse<Portfolio>>(`/portfolios/${id}`)
  return data.data
}

export async function likePortfolio(id: number) {
  const { data } = await apiClient.post<ApiResponse<null>>(`/portfolios/${id}/like`)
  return data
}

export async function unlikePortfolio(id: number) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/portfolios/${id}/like`)
  return data
}

export async function bookmarkPortfolio(id: number) {
  const { data } = await apiClient.post<ApiResponse<null>>(`/portfolios/${id}/bookmark`)
  return data
}

export async function unbookmarkPortfolio(id: number) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/portfolios/${id}/bookmark`)
  return data
}
