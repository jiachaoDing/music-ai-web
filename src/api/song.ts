import { mockSongs } from '../mock/songs'
import type { Song } from '../types/song'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export type FeedTab = 'resonance' | 'recommend' | 'hot'

export type GenerateSongInput = {
  title: string
  style: string
  lyrics: string
  mode?: Song['mode']
  prompt?: string
  isInstrumental?: boolean
  originId?: string | null
  forWho?: string
}

export type GenerateTask = {
  taskId: string
}

export type GenerateTaskStatus = {
  taskId?: string
  id?: string
  status: 'queued' | 'running' | 'done' | 'error' | 'failed'
  stage?: string
  progress?: number
  result?: {
    song?: Song
  }
  error?: string | { message?: string } | null
}

export type RemixSongInput = {
  style: string
  prompt: string
  lyrics?: string
}

export type PublishSongInput = {
  published?: boolean
  copyrightConfirmed?: boolean
}

export type UpdateSongInput = {
  title?: string
  description?: string
  lyrics?: string
  tags?: string[]
  coverUrl?: string
}

type ResonanceFeedResponse = {
  intro?: string
  moodTags?: string[]
  list?: Song[]
}

type SongListResponse = {
  list?: Song[]
  items?: Song[]
}

function getMockFeed(tab: FeedTab = 'resonance'): Song[] {
  const publishedSongs = mockSongs.filter((song) => song.published)

  if (tab === 'hot') {
    return [...publishedSongs].sort((a, b) => b.playCount + b.likeCount - (a.playCount + a.likeCount))
  }

  if (tab === 'recommend') {
    return [...publishedSongs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  return publishedSongs
}

function ensureSongArray(value: unknown): Song[] {
  return Array.isArray(value) ? (value as Song[]) : []
}

export async function getFeed(tab: FeedTab = 'resonance'): Promise<Song[]> {
  if (USE_MOCK) return getMockFeed(tab)

  try {
    if (tab === 'resonance') {
      const result = await request<ResonanceFeedResponse | Song[]>('/api/resonance')
      return Array.isArray(result) ? result : ensureSongArray(result.list)
    }

    const result = await request<SongListResponse | Song[]>(`/api/feed?sort=${tab === 'hot' ? 'hot' : 'new'}`)
    if (Array.isArray(result)) return result
    return ensureSongArray(result.list ?? result.items)
  } catch (error) {
    console.warn('Feed API unavailable, fallback to mock feed.', error)
    return getMockFeed(tab)
  }
}

export async function getMySongs(): Promise<Song[]> {
  if (USE_MOCK) return mockSongs

  try {
    const result = await request<SongListResponse | Song[]>('/api/me/songs')
    if (Array.isArray(result)) return result
    return ensureSongArray(result.list ?? result.items)
  } catch (error) {
    console.warn('My songs API unavailable, fallback to mock songs.', error)
    return mockSongs
  }
}

export async function generateSong(input: GenerateSongInput): Promise<Song> {
  return request<Song>('/api/songs/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function submitGenerateTask(input: GenerateSongInput) {
  return request<GenerateTask>('/api/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getGenerateTaskStatus(taskId: string) {
  return request<GenerateTaskStatus>(`/api/task/${encodeURIComponent(taskId)}`)
}

export function submitRemixTask(songId: string, input: RemixSongInput) {
  return request<GenerateTask>(`/api/song/${encodeURIComponent(songId)}/remix`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function getSongDetail(songId: string): Promise<Song> {
  const result = await request<{ song: Song }>(`/api/song/${songId}`)
  return result.song
}

export async function publishSong(songId: string, input: PublishSongInput): Promise<Song> {
  const result = await request<{ song: Song }>(`/api/publish/${songId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return result.song
}

export async function updateSong(songId: string, input: UpdateSongInput): Promise<Song> {
  const result = await request<{ song: Song }>(`/api/song/${songId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
  return result.song
}

export async function recordSongPlay(songId: string): Promise<number> {
  const result = await request<{ playCount: number }>(`/api/play/${songId}`, {
    method: 'POST',
  })
  return result.playCount
}

export async function likeSong(songId: string) {
  return request<{ liked: boolean; likeCount: number; unlocked?: boolean }>(`/api/like/${songId}`, {
    method: 'POST',
  })
}

export async function collectSong(songId: string, playlistId?: string) {
  return request<{ collected: boolean; collectCount: number }>(`/api/collect/${songId}`, {
    method: 'POST',
    body: JSON.stringify({ playlistId }),
  })
}
