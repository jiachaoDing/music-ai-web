import { mockSongs } from '../mock/songs'
import type { Song } from '../types/song'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export type FeedTab = 'resonance' | 'recommend' | 'hot'

export async function getFeed(tab: FeedTab = 'resonance'): Promise<Song[]> {
  if (USE_MOCK) {
    const publishedSongs = mockSongs.filter((song) => song.published)

    if (tab === 'hot') {
      return [...publishedSongs].sort((a, b) => b.playCount + b.likeCount - (a.playCount + a.likeCount))
    }

    if (tab === 'recommend') {
      return [...publishedSongs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }

    return publishedSongs
  }

  if (tab === 'resonance') return request<Song[]>('/api/resonance')

  return request<Song[]>(`/api/feed?sort=${tab === 'hot' ? 'hot' : 'new'}`)
}

export async function getMySongs(): Promise<Song[]> {
  if (USE_MOCK) return mockSongs

  return request<Song[]>('/api/me/songs')
}
