import type { BattleRecord, ChallengeRecord, ChallengeSongRef, FortuneRecord } from './types'

export const currentUserId = 'user_001'

export const initialChallenges: ChallengeRecord[] = [
  {
    id: 'challenge_001',
    title: '把夏天唱成一封信',
    desc: '写下你最想留住的夏日片段，可以是操场、海风、毕业照，或某个没说出口的夜晚。',
    emoji: '夏',
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
    emoji: '诗',
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
    emoji: '光',
    color: '#60a5fa',
    createdBy: 'user_admin',
    status: 'active',
    active: true,
    createdAt: '2026-07-05T09:00:00.000Z',
    updatedAt: '2026-07-05T09:00:00.000Z',
  },
  {
    id: 'challenge_004',
    title: '把城市夜风写成节拍',
    desc: '用霓虹、地铁、晚归和便利店写一首夜间循环歌。',
    emoji: '夜',
    color: '#8b5cf6',
    createdBy: 'user_admin',
    status: 'active',
    active: true,
    createdAt: '2026-07-06T09:00:00.000Z',
    updatedAt: '2026-07-06T09:00:00.000Z',
  },
]

export const initialChallengeSongRefs: ChallengeSongRef[] = [
  { id: 'challenge_song_001', challengeId: 'challenge_001', songId: 'song_001', note: '像毕业相册翻到最后一页。', rank: 1 },
  { id: 'challenge_song_002', challengeId: 'challenge_001', songId: 'song_005', note: '雨后的操场很适合慢慢唱。', rank: 2 },
  { id: 'challenge_song_003', challengeId: 'challenge_002', songId: 'song_006', note: '把早八焦虑变成了轻快梗歌。', rank: 1 },
  { id: 'challenge_song_004', challengeId: 'challenge_003', songId: 'song_009', note: '副歌很容易跟唱。', rank: 1 },
  { id: 'challenge_song_005', challengeId: 'challenge_004', songId: 'song_002', note: '晚高峰和电子鼓点很贴。', rank: 1 },
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
  {
    id: 'battle_003',
    topic: '雨后散步更适合哪首歌？',
    aId: 'song_005',
    bId: 'song_007',
    aVotes: 39,
    bVotes: 42,
    createdBy: 'user_003',
    status: 'active',
    createdAt: '2026-07-07T10:20:00.000Z',
    updatedAt: '2026-07-07T10:20:00.000Z',
  },
  {
    id: 'battle_004',
    topic: '哪首更像送给朋友的礼物？',
    aId: 'song_003',
    bId: 'song_009',
    aVotes: 18,
    bVotes: 27,
    createdBy: 'user_004',
    status: 'active',
    createdAt: '2026-07-07T16:40:00.000Z',
    updatedAt: '2026-07-07T16:40:00.000Z',
  },
]

const fortuneKeywords = [
  '松弛', '回声', '微光', '靠近', '晴后', '专注', '重启', '慢热',
  '轻盈', '冒泡', '柔软', '准点', '转弯', '留白', '起风', '醒来',
]

const fortuneMoods = [
  '晴后微光', '城市夜风', '慢速充电', '海盐汽水', '云层留白',
  '黄昏散步', '玻璃温室', '清晨回弹', '雨后低频', '柔和推进',
]

const fortuneColors = [
  { name: '玫瑰粉', hex: '#ea4c89' },
  { name: '薄荷绿', hex: '#23c9a9' },
  { name: '琥珀黄', hex: '#f59e0b' },
  { name: '晴空蓝', hex: '#60a5fa' },
  { name: '紫藤色', hex: '#8b5cf6' },
  { name: '森林绿', hex: '#10b981' },
  { name: '珊瑚粉', hex: '#fb7185' },
  { name: '雾灰蓝', hex: '#64748b' },
  { name: '莓果紫', hex: '#a855f7' },
]

const fortuneDos = [
  '听一首轻快的歌',
  '整理一个待完成的小任务',
  '给作品补一句副歌',
  '把灵感写进备忘录',
  '散步十分钟',
  '听完一首歌再做决定',
]

const fortuneDonts = [
  '反复推翻已经完成的想法',
  '临时改掉全部计划',
  '同时打开太多任务',
  '只看结果不听过程',
  '在疲惫时做大修改',
  '让草稿停在第一句',
]

export const initialFortunes: FortuneRecord[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  const keyword = fortuneKeywords[(index * 5 + 3) % fortuneKeywords.length]
  const luckyColor = fortuneColors[(index * 4 + 2) % fortuneColors.length]
  const moodName = fortuneMoods[(index * 7 + 1) % fortuneMoods.length]
  const firstDo = fortuneDos[(index * 2 + 1) % fortuneDos.length]
  const secondDo = fortuneDos[(index * 3 + 4) % fortuneDos.length]
  const firstDont = fortuneDonts[(index * 5 + 2) % fortuneDonts.length]
  const secondDont = fortuneDonts[(index * 4 + 5) % fortuneDonts.length]

  return {
    id: `fortune_2026_07_${String(day).padStart(2, '0')}`,
    userId: currentUserId,
    date: `2026-07-${String(day).padStart(2, '0')}`,
    keyword,
    mood: {
      emoji: 'glow',
      name: moodName,
      color: luckyColor.hex,
    },
    battery: 52 + ((index * 17 + 11) % 45),
    luckyColor,
    luckyNumber: ((day * 7 + index) % 9) + 1,
    peak: `${String(18 + (index % 5)).padStart(2, '0')}:00-${String(20 + (index % 4)).padStart(2, '0')}:30`,
    encourage: `今天适合用“${keyword}”做开头，把灵感推进一小步。`,
    action: `写下一句关于${moodName}的歌词。`,
    dos: firstDo === secondDo ? [firstDo, '留出十五分钟整理旋律'] : [firstDo, secondDo],
    donts: firstDont === secondDont ? [firstDont, '把所有想法一次性推翻'] : [firstDont, secondDont],
    recharge: ['散步十分钟', '喝一杯温水', '整理桌面', '听一段纯音乐'][index % 4],
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
