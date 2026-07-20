import { request } from './request'
import type { Song } from '../types/song'

export type HostTopic = {
  id: string
  title: string
  prompt: string
}

export type HostPage = {
  name: string
  avatarUrl?: string | null
  bio: string
  greeting: string
  stats: {
    featuredCount: number
    totalLikes: number
    totalPlays: number
  }
  todayPick: (Song & { quote?: string }) | null
  topics: HostTopic[]
  featuredSongs: Song[]
}

export type HostCuration = {
  hostNote: string
  featuredSong: Song | null
  recommendations: Song[]
}

export function getHostPage() {
  return request<HostPage>('/api/host')
}

export function getCuration() {
  return request<HostCuration>('/api/curation')
}
