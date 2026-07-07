export type UserRole = 'user' | 'admin'

export type User = {
  id: string
  nickname: string
  avatarUrl?: string
  color?: string
  role: UserRole
  echoPoints: number
  inviteCodes?: string[]
  createdAt: string
}
