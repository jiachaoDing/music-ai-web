import { mockSongs } from '../mock/songs'
import type { Comment } from '../types/comment'
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
  challengeId?: string
}

export type GenerateTask = {
  taskId: string
  status?: 'queued' | 'running'
  queuePos?: number
  queueAhead?: number
  active?: number
  concurrency?: number
  maxConcurrency?: number
}

export type AlbumSummary = {
  id: string
  title: string
  name?: string
  description?: string
  intro?: string
  coverUrl?: string | null
  author?: string
  trackCount?: number
  total?: number
  createdAt?: string
}

export type GenerateTaskStatus = {
  taskId?: string
  id?: string
  status: 'queued' | 'running' | 'done' | 'error' | 'failed'
  stage?: string
  progress?: number
  queuePos?: number
  queueAhead?: number
  active?: number
  concurrency?: number
  maxConcurrency?: number
  album?: AlbumSummary | null
  result?: {
    song?: Song
    album?: AlbumSummary
    tracks?: Song[]
    songs?: Song[]
  }
  error?: string | { message?: string } | null
}

export type RemixSongInput = {
  title?: string
  style: string
  prompt: string
  lyrics?: string
}

export type SongTreeNode = {
  id: string
  title: string
  coverUrl?: string | null
  author: {
    id: string
    nickname: string
    avatarUrl?: string | null
  } | null
  mode: string
  createdAt: string
  children: SongTreeNode[]
}

export type SongTreeResponse = {
  root: SongTreeNode
  remixes: SongTreeNode[]
  currentId: string
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

export type ResonanceFeedResponse = {
  mood?: {
    title: string
    style?: string
    tags?: string[]
  }
  moodLabel?: string
  note?: string
  intro?: string
  moodTags?: string[]
  list?: Song[]
  songs?: Song[]
  total?: number
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
      const result = await getResonanceFeed()
      return result.list
    }

    const result = await request<SongListResponse | Song[]>(`/api/feed?sort=${tab === 'hot' ? 'hot' : 'new'}`)
    if (Array.isArray(result)) return result
    return ensureSongArray(result.list ?? result.items)
  } catch (error) {
    console.warn('Feed API unavailable, fallback to mock feed.', error)
    return getMockFeed(tab)
  }
}

export async function getResonanceFeed(name?: string): Promise<ResonanceFeedResponse & { list: Song[] }> {
  if (USE_MOCK) {
    return {
      mood: { title: '松弛', style: 'lo-fi, chill, bedroom pop', tags: ['松弛', '夜晚', '治愈'] },
      moodLabel: '同「松弛」频',
      note: '今天和你同频的人，都在听一些慢下来的声音。',
      intro: '今天和你同频的人，都在听一些慢下来的声音。',
      moodTags: ['松弛', '夜晚', '治愈'],
      list: getMockFeed('resonance'),
    }
  }

  const query = name ? `?name=${encodeURIComponent(name)}` : ''
  const result = await request<ResonanceFeedResponse | Song[]>(`/api/resonance${query}`)
  if (Array.isArray(result)) return { list: result }
  return {
    ...result,
    list: ensureSongArray(result.list ?? result.songs),
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

export function submitAlbumTask(input: { theme: string; trackCount: number }) {
  return request<GenerateTask>('/api/album', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getGenerateTaskStatus(taskId: string, signal?: AbortSignal) {
  return request<GenerateTaskStatus>(`/api/task/${encodeURIComponent(taskId)}`, { signal })
}

export function submitRemixTask(songId: string, input: RemixSongInput) {
  return request<GenerateTask>(`/api/song/${encodeURIComponent(songId)}/remix`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getSongTree(songId: string) {
  return request<SongTreeResponse>(`/api/tree/${encodeURIComponent(songId)}`)
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

export async function deleteSong(songId: string) {
  return request<{ deleted: boolean; songId: string }>(`/api/song/${songId}`, {
    method: 'DELETE',
  })
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

export async function getSongComments(songId: string): Promise<Comment[]> {
  const result = await request<{ list?: Comment[] } | Comment[]>(`/api/comments/${songId}`)
  if (Array.isArray(result)) return result
  return Array.isArray(result.list) ? result.list : []
}

export async function addSongComment(songId: string, input: { text: string; anon?: boolean }) {
  return request<{ comment: Comment }>(`/api/comments/${songId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
