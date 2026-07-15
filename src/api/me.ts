import type { Playlist } from '../types/playlist'
import type { InviteCode, User } from '../types/user'
import { request } from './request'

type BackendUser = {
  id: string
  nickname: string
  avatarUrl?: string | null
  color?: string | null
  role: 'user' | 'admin'
  echoPoints: number
  invitedBy?: string | null
  lastCheckin?: string | null
  streak: number
  createdAt: string
}

type BackendInviteCode = {
  id: string
  code: string
  status: InviteCode['status']
  usedBy?: string | null
  usedAt?: string | null
}

type MeProfileResponse = {
  user: BackendUser
  echoPoints: number
  inviteCodes: BackendInviteCode[]
  playlists: Playlist[]
}

type CreatePlaylistResponse = {
  playlist: Playlist
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl ?? undefined,
    color: user.color ?? undefined,
    role: user.role,
    echoPoints: user.echoPoints,
    invitedBy: user.invitedBy ?? undefined,
    lastCheckin: user.lastCheckin ?? undefined,
    streak: user.streak,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  }
}

function mapInviteCode(inviteCode: BackendInviteCode): InviteCode {
  return {
    id: inviteCode.id,
    code: inviteCode.code,
    createdBy: '',
    usedBy: inviteCode.usedBy ?? undefined,
    usedAt: inviteCode.usedAt ?? undefined,
    status: inviteCode.status,
    createdAt: '',
    updatedAt: '',
  }
}

export async function getMeProfile() {
  const result = await request<MeProfileResponse>('/api/me')

  return {
    user: mapUser(result.user),
    echoPoints: result.echoPoints,
    inviteCodes: result.inviteCodes.map(mapInviteCode),
    playlists: result.playlists,
  }
}

export async function createPlaylist(name: string, color?: string) {
  const result = await request<CreatePlaylistResponse>('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
  })

  return result.playlist
}
