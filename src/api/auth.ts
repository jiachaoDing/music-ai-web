import { mockCurrentUser } from '../mock/users'
import type { LoginFormValues, RegisterFormValues, User } from '../types/user'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
export const TOKEN_STORAGE_KEY = 'echo_token'

type BackendUser = {
  id: string
  name: string
  avatarUrl?: string | null
  color?: string | null
  role: 'user' | 'admin'
  points: number
  invitedBy?: string | null
  lastCheckin?: string | null
  streak: number
  createdAt: string
}

type AuthResponse = {
  token: string
  user: BackendUser
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    nickname: user.name,
    avatarUrl: user.avatarUrl ?? undefined,
    color: user.color ?? undefined,
    role: user.role,
    echoPoints: user.points,
    invitedBy: user.invitedBy ?? undefined,
    lastCheckin: user.lastCheckin ?? undefined,
    streak: user.streak,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  }
}

function persistToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) return mockCurrentUser

  const user = await request<BackendUser>('/api/auth/me')
  return mapUser(user)
}

export async function signIn({ identifier, password }: LoginFormValues): Promise<User> {
  if (USE_MOCK) {
    if (!identifier.trim() || !password.trim()) throw new Error('请输入昵称和密码')

    if (password.trim().length < 4) {
      throw new Error('密码至少 4 位')
    }

    return {
      ...mockCurrentUser,
      nickname: identifier.trim(),
      updatedAt: new Date().toISOString(),
    }
  }

  const result = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name: identifier.trim(), password }),
  })

  persistToken(result.token)
  return mapUser(result.user)
}

export async function signUp({ nickname, password, inviteCode }: RegisterFormValues): Promise<User> {
  if (USE_MOCK) {
    if (!nickname.trim() || !password.trim() || !inviteCode?.trim()) {
      throw new Error('请完整填写昵称、密码和邀请码')
    }

    if (password.trim().length < 4) {
      throw new Error('密码至少 4 位')
    }

    const now = new Date().toISOString()

    return {
      ...mockCurrentUser,
      id: `user_${Date.now()}`,
      nickname: nickname.trim(),
      echoPoints: 0,
      invitedBy: inviteCode?.trim() ? 'user_001' : undefined,
      lastCheckin: undefined,
      streak: 0,
      stats: {
        songCount: 0,
        likedCount: 0,
        playCount: 0,
        followerCount: 0,
        followingCount: 0,
      },
      createdAt: now,
      updatedAt: now,
    }
  }

  const result = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: nickname.trim(), password, inviteCode }),
  })

  persistToken(result.token)
  return mapUser(result.user)
}
