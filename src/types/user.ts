export interface UserMeResponse {
  userId: string
  email: string
  name: string
  profileImageUrl: string | null
  portfolioCount: number
}

export interface UpdateUserRequest {
  name?: string
  profileImageUrl?: string
}

export interface UpdateUserResponse {
  userId: string
  name: string
  profileImageUrl: string | null
}
