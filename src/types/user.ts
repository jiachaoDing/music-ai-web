export type UserRole = 'user' | 'admin'

export type UserStats = {
  songCount: number
  likedCount: number
  playCount: number
  followerCount?: number
  followingCount?: number
}

export type User = {
  id: string
  nickname: string
  avatarUrl?: string
  color?: string
  role: UserRole
  echoPoints: number
  invitedBy?: string
  lastCheckin?: string
  streak: number
  stats?: UserStats
  createdAt: string
  updatedAt: string
}

export type InviteCodeStatus = 'unused' | 'used' | 'disabled'

export type InviteCode = {
  id: string
  code: string
  createdBy: string
  usedBy?: string
  usedAt?: string
  status: InviteCodeStatus
  createdAt: string
  updatedAt: string
}

export type AuthUser = User

export type LoginFormValues = {
  identifier: string
  password: string
}

export type RegisterFormValues = {
  nickname: string
  password: string
  inviteCode?: string
}
