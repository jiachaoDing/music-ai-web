import { request } from './request'

export type RadioThemeDto = {
  id: string
  emoji: string
  name: string
  prompt: string
  isNowRecommend?: boolean
}

export type RadioData = {
  greeting: string
  live: boolean
  current: RadioThemeDto
  themes: RadioThemeDto[]
  timeSlots?: Record<string, string>
}

export type DjBroadcast = {
  text: string
  audioUrl: string
}

export function getRadioData() {
  return request<RadioData>('/api/radio')
}

export function generateDjBroadcast(songId: string) {
  return request<DjBroadcast>(`/api/dj/${encodeURIComponent(songId)}`, { method: 'POST' })
}
