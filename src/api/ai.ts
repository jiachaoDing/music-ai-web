import { request } from './request'

export type LyricsResult = {
  title: string
  style: string
  lyrics: string
  rawText?: string
}

export function generateLyrics(prompt: string) {
  return request<LyricsResult>('/api/ai/lyrics', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}
