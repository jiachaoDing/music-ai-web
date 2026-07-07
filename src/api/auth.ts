import { mockCurrentUser } from '../mock/users'
import type { User } from '../types/user'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) return mockCurrentUser

  return request<User>('/api/me')
}
