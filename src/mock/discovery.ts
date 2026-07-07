import type { Battle, Challenge, Fortune } from '../types/discovery'

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge_001',
    title: '把夏天唱成一封信',
    description: '用一首歌写下你最想留住的夏日片段。',
    emoji: '☀',
    color: '#f59e0b',
    participantCount: 42,
  },
  {
    id: 'challenge_002',
    title: '三行情绪炼歌',
    description: '写三行今天的心情，让 AI 变成旋律。',
    emoji: '♪',
    color: '#10b981',
    participantCount: 27,
  },
]

export const mockBattles: Battle[] = [
  {
    id: 'battle_001',
    topic: '哪首更适合毕业晚会？',
    songAId: 'song_001',
    songBId: 'song_002',
    votesA: 64,
    votesB: 51,
  },
]

export const mockFortune: Fortune = {
  id: 'fortune_001',
  date: '2026-07-06',
  keyword: '回声',
  battery: 82,
  luckyNumber: 7,
  encourage: '今天适合把没说出口的话唱出来。',
  songId: 'song_001',
}
