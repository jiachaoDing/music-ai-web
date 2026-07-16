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

export function generateLyrics(input: string | LyricsRequestInput) {
  return request<LyricsResult>('/api/ai/lyrics', {
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
