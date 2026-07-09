import { mockSongs } from '../mock/songs'
import type { Song } from '../types/song'
import { request } from './request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export type FeedTab = 'resonance' | 'recommend' | 'hot'

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

export async function getFeed(tab: FeedTab = 'resonance'): Promise<Song[]> {
  if (USE_MOCK) return getMockFeed(tab)

  try {
    if (tab === 'resonance') return await request<Song[]>('/api/resonance')
    return await request<Song[]>(`/api/feed?sort=${tab === 'hot' ? 'hot' : 'new'}`)
  } catch (error) {
    console.warn('Feed API unavailable, fallback to mock feed.', error)
    return getMockFeed(tab)
  }
}

export async function getMySongs(): Promise<Song[]> {
  if (USE_MOCK) return mockSongs

  try {
    return await request<Song[]>('/api/me/songs')
  } catch (error) {
    console.warn('My songs API unavailable, fallback to mock songs.', error)
    return mockSongs
  }
}
