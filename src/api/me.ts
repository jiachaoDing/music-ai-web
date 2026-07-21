import type { Playlist } from '../types/playlist'
import type { InviteCode, User } from '../types/user'
import { request } from './request'

type BackendUser = {
  id: string
  nickname?: string
  name?: string
  avatarUrl?: string | null
  color?: string | null
  role: 'user' | 'admin'
  echoPoints?: number
  points?: number
  invitedBy?: string | null
  lastCheckin?: string | null
  streak: number
  createdAt: string
  updatedAt?: string
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
  echoPoints?: number
  inviteCodes?: BackendInviteCode[]
  playlists?: Playlist[]
}

type CreatePlaylistResponse = {
  playlist: Playlist
}

type PlaylistListResponse = {
  list: Playlist[]
}

type PlaylistDetailResponse = {
  playlist: Playlist
  songs: Playlist['songs']
}

export type PointsLedgerItem = {
  id: string
  delta: number
  reason: string
  balance: number | null
  createdAt: string
}

type PointsLedgerResponse = {
  list?: PointsLedgerItem[]
  total?: number
  page?: number
  pageSize?: number
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    nickname: user.nickname ?? user.name ?? 'Echo Creator',
    avatarUrl: user.avatarUrl ?? undefined,
    color: user.color ?? undefined,
    role: user.role,
    echoPoints: user.echoPoints ?? user.points ?? 0,
    invitedBy: user.invitedBy ?? undefined,
    lastCheckin: user.lastCheckin ?? undefined,
    streak: user.streak,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt ?? user.createdAt,
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
  const nextUser = mapUser(result.user)

  return {
    user: {
      ...nextUser,
      echoPoints: result.echoPoints ?? nextUser.echoPoints,
    },
    echoPoints: result.echoPoints,
    inviteCodes: (result.inviteCodes ?? []).map(mapInviteCode),
    playlists: result.playlists ?? [],
  }
}

export async function getPointsLedger(pageSize = 6) {
  const result = await request<PointsLedgerResponse>(`/api/me/points-ledger?pageSize=${pageSize}`)
  return result.list ?? []
}

export async function createPlaylist(name: string, color?: string) {
  const result = await request<CreatePlaylistResponse>('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
  })

  return result.playlist
}

export async function getPlaylists() {
  const result = await request<PlaylistListResponse>('/api/playlists')
  return result.list
}

export async function getPlaylistDetail(id: string) {
  const result = await request<PlaylistDetailResponse>(`/api/playlists/${id}`)
  return {
    playlist: result.playlist,
    songs: result.songs ?? [],
  }
}

export async function addSongToPlaylist(playlistId: string, songId: string) {
  await request<{ added: boolean }>(`/api/playlists/${playlistId}/songs/${songId}`, {
    method: 'POST',
  })
}

export async function removeSongFromPlaylist(playlistId: string, songId: string) {
  await request<{ removed: boolean }>(`/api/playlists/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
  })
}
