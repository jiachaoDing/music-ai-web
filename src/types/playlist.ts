import type { Song } from './song'

export type Playlist = {
  id: string
  name: string
  color?: string
  type: 'liked' | 'custom'
  isSystem: boolean
  songCount: number
  songs?: Song[]
  createdAt: string
}
