import { request } from './request'
import type { Song } from '../types/song'

export type LyricsResult = {
  title: string
  style: string
  lyrics: string
  rawText?: string
}

export type LyricsRequestInput = {
  prompt: string
  mode?: string
  styles?: string[]
  forWho?: string
  image?: string
}

export type CoverResult = {
  status: string
  imageUrl: string | null
  providerResponse?: unknown
}

export type DjBroadcastResult = {
  text?: string
  audioUrl?: string | null
  djText?: string
  djUrl?: string | null
  data?: {
    text?: string
    audioUrl?: string | null
    djText?: string
    djUrl?: string | null
  }
}

export type SongReviewResult = {
  text?: string
  review?: string
  aiReview?: string
  song?: Song
  data?: {
    text?: string
    review?: string
    aiReview?: string
    song?: Song
  }
}

export function generateLyrics(input: string | LyricsRequestInput) {
  return request<LyricsResult>('/api/lyrics', {
    method: 'POST',
    body: JSON.stringify(typeof input === 'string' ? { prompt: input } : input),
  })
}

export function generateCover(input: { title?: string; style?: string; prompt?: string }) {
  return request<CoverResult>('/api/ai/cover', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function generateDjBroadcast(songId: string) {
  return request<DjBroadcastResult>(`/api/dj/${encodeURIComponent(songId)}`, {
    method: 'POST',
  })
}

export function generateSongReview(songId: string) {
  return request<SongReviewResult>(`/api/song/${encodeURIComponent(songId)}/review`, {
    method: 'POST',
  })
}
