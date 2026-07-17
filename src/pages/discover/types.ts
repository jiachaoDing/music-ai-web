import type { Song } from '../../types/song'

export type DiscoverView = 'home' | 'challenge' | 'battles' | 'battleNew' | 'fortune'
export type VoteSide = 'A' | 'B'
export type BattleStatus = 'active' | 'closed' | 'hidden'
export type ChallengeStatus = 'active' | 'closed' | 'hidden'

export type ChallengeRecord = {
  id: string
  title: string
  desc?: string
  prompt?: string
  style?: string
  emoji?: string
  color?: string
  createdBy?: string
  status: ChallengeStatus
  active: boolean
  createdAt: string
  updatedAt: string
}

export type BattleRecord = {
  id: string
  topic: string
  aId: string
  bId: string
  aVotes: number
  bVotes: number
  createdBy: string
  status: BattleStatus
  createdAt: string
  updatedAt: string
  votedSide?: VoteSide
}

export type BattleVoteRecord = {
  id: string
  battleId: string
  userId: string
  side: VoteSide
  createdAt: string
}

export type FortuneRecord = {
  id: string
  userId: string
  date: string
  keyword: string
  mood: {
    emoji: string
    name: string
    color: string
  }
  battery: number
  luckyColor: {
    name: string
    hex: string
  }
  luckyNumber: number
  peak?: string
  encourage?: string
  action?: string
  dos?: string[]
  donts?: string[]
  recharge?: string
  img?: string
  imgGenerating: boolean
  streak: number
  streakBadge?: {
    name: string
    level: number
  }
  songId?: string
  songTitle?: string
  createdAt: string
  updatedAt: string
}

export type ChallengeSongRef = {
  id: string
  challengeId: string
  songId: string
  note: string
  rank: number
}

export type FortuneSongDraft = {
  song: Song
  fortuneDate: string
}
