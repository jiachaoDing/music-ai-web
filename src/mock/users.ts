import type { InviteCode, User } from '../types/user'

export const mockCurrentUser: User = {
  id: 'user_001',
  nickname: 'Echo Creator',
  avatarUrl: '',
  color: '#ea4c89',
  role: 'user',
  echoPoints: 28,
  invitedBy: undefined,
  lastCheckin: '2026-07-08',
  streak: 3,
  stats: {
    songCount: 6,
    likedCount: 128,
    playCount: 960,
    followerCount: 42,
    followingCount: 18,
  },
  createdAt: '2026-07-01T09:00:00.000Z',
  updatedAt: '2026-07-08T09:30:00.000Z',
}

export const mockInviteCodes: InviteCode[] = [
  {
    id: 'invite_001',
    code: 'ECHO-2026',
    createdBy: 'user_001',
    status: 'unused',
    createdAt: '2026-07-01T09:20:00.000Z',
    updatedAt: '2026-07-01T09:20:00.000Z',
  },
]
