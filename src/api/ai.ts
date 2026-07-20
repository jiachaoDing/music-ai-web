import { request } from './request'

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
}

export function generateLyrics(input: string | LyricsRequestInput) {
  return request<LyricsResult>('/api/ai/lyrics', {
    method: 'POST',
    body: JSON.stringify(typeof input === 'string' ? { prompt: input } : input),
  })
}

export function generateLyricsWithFallback(input: LyricsRequestInput) {
  return request<LyricsResult>('/api/lyrics', {
    method: 'POST',
    body: JSON.stringify(input),
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
