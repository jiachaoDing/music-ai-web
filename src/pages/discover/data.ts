import type { BattleRecord, ChallengeRecord, ChallengeSongRef, FortuneRecord } from './types'

export const currentUserId = 'user_001'

export const initialChallenges: ChallengeRecord[] = [
  {
    id: 'challenge_001',
    title: '把夏天唱成一封信',
    desc: '写下你最想留住的夏日片段，可以是操场、海风、毕业照，或某个没说出口的夜晚。',
    emoji: '☀',
    color: '#f59e0b',
    createdBy: 'user_admin',
    status: 'active',
    active: true,
    createdAt: '2026-07-03T10:00:00.000Z',
    updatedAt: '2026-07-03T10:00:00.000Z',
  },
  {
    id: 'challenge_002',
    title: '三行情绪练歌',
    desc: '写三行今天的心情，让 AI 把它变成一首旋律清晰、适合循环的小歌。',
    emoji: '♡',
    color: '#10b981',
    createdBy: 'user_admin',
    status: 'active',
    active: true,
    createdAt: '2026-07-04T09:00:00.000Z',
    updatedAt: '2026-07-04T09:00:00.000Z',
  },
  {
    id: 'challenge_003',
    title: '给未来的自己写副歌',
    desc: '把未来三个月想完成的事写成一个能记住的 Hook，用声音给自己留一个提醒。',
    emoji: '✦',
    color: '#60a5fa',
    createdBy: 'user_admin',
    status: 'active',
    active: true,
    createdAt: '2026-07-05T09:00:00.000Z',
    updatedAt: '2026-07-05T09:00:00.000Z',
  },
]

export const initialChallengeSongRefs: ChallengeSongRef[] = [
  { id: 'challenge_song_001', challengeId: 'challenge_001', songId: 'song_001', note: '像毕业相册翻到最后一页。', rank: 1 },
  { id: 'challenge_song_002', challengeId: 'challenge_001', songId: 'song_005', note: '雨后的操场很适合慢慢唱。', rank: 2 },
  { id: 'challenge_song_003', challengeId: 'challenge_002', songId: 'song_006', note: '把早八焦虑变成了轻快梗歌。', rank: 1 },
  { id: 'challenge_song_004', challengeId: 'challenge_003', songId: 'song_009', note: '副歌很容易跟唱。', rank: 1 },
]

export const initialBattles: BattleRecord[] = [
  {
    id: 'battle_001',
    topic: '哪首更适合毕业晚会收尾？',
    aId: 'song_001',
    bId: 'song_005',
    aVotes: 64,
    bVotes: 51,
    createdBy: 'user_001',
    status: 'active',
    createdAt: '2026-07-06T12:00:00.000Z',
    updatedAt: '2026-07-06T12:00:00.000Z',
  },
  {
    id: 'battle_002',
    topic: '深夜自习时，你会循环哪一首？',
    aId: 'song_008',
    bId: 'song_002',
    aVotes: 88,
    bVotes: 76,
    createdBy: 'user_002',
    status: 'active',
    createdAt: '2026-07-06T18:30:00.000Z',
    updatedAt: '2026-07-06T18:30:00.000Z',
  },
]

export const initialFortunes: FortuneRecord[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  const keywords = ['松弛', '回声', '微光', '靠近', '晴后', '专注', '重启']
  const colors = [
    { name: '玫瑰粉', hex: '#ea4c89' },
    { name: '薄荷绿', hex: '#23c9a9' },
    { name: '琥珀黄', hex: '#f59e0b' },
    { name: '晴空蓝', hex: '#60a5fa' },
    { name: '紫藤色', hex: '#8b5cf6' },
    { name: '森林绿', hex: '#10b981' },
    { name: '珊瑚粉', hex: '#fb7185' },
  ]
  const luckyColor = colors[index % colors.length]

  return {
    id: `fortune_2026_07_${String(day).padStart(2, '0')}`,
    userId: currentUserId,
    date: `2026-07-${String(day).padStart(2, '0')}`,
    keyword: keywords[index % keywords.length],
    mood: {
      emoji: 'glow',
      name: ['晴后微光', '城市夜风', '慢速充电'][index % 3],
      color: luckyColor.hex,
    },
    battery: 56 + ((index * 9) % 39),
    luckyColor,
    luckyNumber: (day % 9) + 1,
    peak: '20:00-22:00',
    encourage: '今天适合整理灵感、慢慢推进创作。',
    action: '写下一句能被唱出来的心情。',
    dos: ['听一首轻快的歌', '整理一个待完成的小任务'],
    donts: ['反复推翻已经完成的好想法', '临时改掉全部计划'],
    recharge: '散步十分钟',
    img: '',
    imgGenerating: false,
    streak: day <= 7 ? day : 7,
    streakBadge: day >= 7 ? { name: '七日回声', level: 1 } : undefined,
    songId: day === 7 ? 'song_001' : undefined,
    songTitle: day === 7 ? '夏夜回声' : undefined,
    createdAt: `2026-07-${String(day).padStart(2, '0')}T08:00:00.000Z`,
    updatedAt: `2026-07-${String(day).padStart(2, '0')}T08:00:00.000Z`,
  }
})
