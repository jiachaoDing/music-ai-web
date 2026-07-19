export type SongMode =
  | 'song'
  | 'meme'
  | 'emotion'
  | 'photo'
  | 'foryou'
  | 'radio'
  | 'remix'
  | 'fortune'
  | 'album'

export type SongStatus = 'generating' | 'draft' | 'published' | 'private' | 'failed'

export type Song = {
  id: string
  title: string
  description?: string
  mode: SongMode
  style: string
  tags: string[]
  lyrics?: string
  audioUrl?: string
  coverUrl?: string
  duration?: number
  status: SongStatus
  published: boolean
  isInstrumental: boolean
  originId?: string | null
  challengeId?: string | null
  aiReview?: string
  author: {
    id: string
    nickname: string
    avatarUrl?: string
    color?: string
  }
  likeCount: number
  collectCount: number
  commentCount: number
  playCount: number
  remixCount: number
  createdAt: string
  publishedAt?: string | null
}
