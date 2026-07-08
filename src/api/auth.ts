import { mockCurrentUser } from '../mock/users'
import type { LoginFormValues, RegisterFormValues, User } from '../types/user'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) return mockCurrentUser

  return request<User>('/api/me')
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

  return request<User>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
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

  return request<User>('/api/register', {
    method: 'POST',
    body: JSON.stringify({ nickname, password, inviteCode }),
  })
}
