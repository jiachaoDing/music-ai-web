import type { Song } from '../types/song'
import type { BattleRecord, ChallengeParticipant, ChallengeRecord, ChallengeSongRef, FortuneRecord, VoteSide } from '../pages/discover/types'
import { buildApiUrl, request } from './request'

type UnknownRecord = Record<string, unknown>

type ListResponse<T> = {
  list?: T[]
  items?: T[]
}

export type DayLyricResult = {
  title: string
  style: string
  lyrics: string
}

export type GenerateTaskResult = {
  taskId: string
}

export type GenerateTaskStatus = {
  taskId: string
  status: 'queued' | 'running' | 'done' | 'error'
  stage?: string
  progress?: number
  result?: {
    song?: Song
  }
  error?: string | null
}

const colors = ['#f59e0b', '#10b981', '#60a5fa', '#8b5cf6']

function asRecord(value: unknown): UnknownRecord {
  return typeof value === 'object' && value !== null ? (value as UnknownRecord) : {}
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function getList<T>(result: ListResponse<T> | T[]): T[] {
  if (Array.isArray(result)) return result
  if (Array.isArray(result.list)) return result.list
  if (Array.isArray(result.items)) return result.items
  return []
}

function mapChallenge(value: unknown, index: number): ChallengeRecord {
  const item = asRecord(value)
  const now = new Date().toISOString()
  const status = asString(item.status, asBoolean(item.active, true) ? 'active' : 'closed')

  return {
    id: asString(item.id, `challenge_${index}`),
    title: asString(item.title, '未命名挑战'),
    desc: asString(item.desc ?? item.description ?? item.prompt),
    prompt: asString(item.prompt),
    style: asString(item.style),
    emoji: asString(item.emoji, '音'),
    color: asString(item.color, colors[index % colors.length]),
    createdBy: asString(item.createdBy),
    status: status === 'closed' || status === 'hidden' ? status : 'active',
    active: asBoolean(item.active, status === 'active'),
    createdAt: asString(item.createdAt, now),
    updatedAt: asString(item.updatedAt, now),
    songCount: asNumber(item.songCount ?? item.count ?? asRecord(item._count).songs),
  }
}

function songId(value: unknown): string {
  if (typeof value === 'string') return value
  return asString(asRecord(value).id)
}

function mapBattle(value: unknown, index: number): BattleRecord {
  const item = asRecord(value)
  const now = new Date().toISOString()
  const status = asString(item.status, 'active')

  return {
    id: asString(item.id, `battle_${index}`),
    topic: asString(item.topic, '未命名擂台'),
    aId: songId(item.aId ?? item.songAId ?? item.songA),
    bId: songId(item.bId ?? item.songBId ?? item.songB),
    aVotes: asNumber(item.aVotes ?? item.votesA),
    bVotes: asNumber(item.bVotes ?? item.votesB),
    createdBy: asString(item.createdBy),
    status: status === 'closed' || status === 'hidden' ? status : 'active',
    createdAt: asString(item.createdAt, now),
    updatedAt: asString(item.updatedAt, now),
    votedSide: item.votedSide === 'A' || item.votedSide === 'B' ? item.votedSide : undefined,
    songA: Object.keys(asRecord(item.songA)).length ? (item.songA as Song) : undefined,
    songB: Object.keys(asRecord(item.songB)).length ? (item.songB as Song) : undefined,
  }
}

function mapFortune(value: unknown, fallbackDate: string): FortuneRecord {
  const root = asRecord(value)
  const item = asRecord(root.fortune ?? value)
  const mood = asRecord(item.mood)
  const luckyColor = asRecord(item.luckyColor)
  const streakBadge = asRecord(item.streakBadge)
  const now = new Date().toISOString()
  const date = asString(item.date, fallbackDate)

  return {
    id: asString(item.id, `fortune_${date.replaceAll('-', '')}`),
    userId: asString(item.userId),
    date,
    keyword: asString(item.keyword, '今日'),
    mood: {
      emoji: asString(mood.emoji, '♪'),
      name: asString(mood.name, asString(item.moodName, '今日旋律')),
      color: asString(mood.color, '#8b5cf6'),
    },
    battery: asNumber(item.battery, 0),
    luckyColor: {
      name: asString(luckyColor.name, '幸运色'),
      hex: asString(luckyColor.hex, '#8b5cf6'),
    },
    luckyNumber: asNumber(item.luckyNumber, 0),
    peak: asString(item.peak) || undefined,
    encourage: asString(item.encourage) || undefined,
    action: asString(item.action) || undefined,
    dos: Array.isArray(item.dos) ? item.dos.filter((entry): entry is string => typeof entry === 'string') : [],
    donts: Array.isArray(item.donts) ? item.donts.filter((entry): entry is string => typeof entry === 'string') : [],
    recharge: asString(item.recharge) || undefined,
    img: asString(item.img ?? item.imageUrl) || undefined,
    imgGenerating: asBoolean(item.imgGenerating),
    streak: asNumber(item.streak ?? root.streak),
    streakBadge: Object.keys(streakBadge).length
      ? { name: asString(streakBadge.name), level: asNumber(streakBadge.level) }
      : undefined,
    songId: asString(item.songId) || undefined,
    songTitle: asString(item.songTitle) || undefined,
    createdAt: asString(item.createdAt, now),
    updatedAt: asString(item.updatedAt, now),
  }
}

export async function getChallenges(): Promise<ChallengeRecord[]> {
  const result = await request<ListResponse<unknown> | unknown[]>('/api/challenges')
  return getList(result).map(mapChallenge)
}

export async function getChallengeDetail(challengeId: string): Promise<{ challenge?: ChallengeRecord; refs: ChallengeSongRef[]; songs: Song[]; participants: ChallengeParticipant[] }> {
  const result = asRecord(await request<unknown>(`/api/challenges/${encodeURIComponent(challengeId)}`))
  const challengeValue = asRecord(result.challenge)
  const rawItems = Array.isArray(result.songs)
    ? result.songs
    : Array.isArray(result.list)
      ? result.list
      : []
  const songs: Song[] = []
  const refs = rawItems.flatMap((value, index) => {
    const item = asRecord(value)
    const rawSong = asRecord(item.song ?? value)
    const id = asString(rawSong.id ?? item.songId)
    if (!id) return []
    const rawAuthor = asRecord(rawSong.author)
    const authorId = asString(rawAuthor.id ?? rawSong.authorId)
    const normalizedSong: Song = {
      id,
      title: asString(rawSong.title, '未命名话题作品'),
      description: asString(rawSong.description) || undefined,
      mode: 'song',
      style: asString(rawSong.style, 'AI 音乐'),
      tags: Array.isArray(rawSong.tags) ? rawSong.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      lyrics: asString(rawSong.lyrics) || undefined,
      audioUrl: asString(rawSong.audioUrl) || undefined,
      coverUrl: asString(rawSong.coverUrl ?? rawSong.coverImg ?? rawSong.cover) || undefined,
      duration: asNumber(rawSong.duration),
      status: 'published',
      published: true,
      isInstrumental: asBoolean(rawSong.isInstrumental),
      challengeId,
      author: {
        id: authorId,
        nickname: asString(rawAuthor.nickname ?? rawSong.authorName, '创作者'),
        avatarUrl: asString(rawAuthor.avatarUrl) || undefined,
      },
      likeCount: asNumber(rawSong.likeCount ?? rawSong.likes),
      collectCount: asNumber(rawSong.collectCount),
      commentCount: asNumber(rawSong.commentCount),
      playCount: asNumber(rawSong.playCount ?? rawSong.plays),
      remixCount: asNumber(rawSong.remixCount ?? rawSong.coverCount),
      createdAt: asString(rawSong.createdAt, new Date().toISOString()),
      publishedAt: asString(rawSong.publishedAt) || null,
    }
    songs.push(normalizedSong)
    return [{
      id: asString(item.id, id),
      challengeId,
      songId: id,
      note: asString(item.note ?? rawSong.description, '围绕话题创作的参与作品'),
      rank: asNumber(item.rank, index + 1),
    }]
  })
  const participants = (Array.isArray(result.participants) ? result.participants : []).flatMap((value) => {
    const item = asRecord(value)
    const id = asString(item.id)
    if (!id) return []
    return [{
      id,
      nickname: asString(item.nickname, '创作者'),
      songCount: asNumber(item.songCount),
    }]
  })
  return {
    challenge: Object.keys(challengeValue).length ? mapChallenge(challengeValue, 0) : undefined,
    refs,
    songs,
    participants,
  }
}

export async function getBattles(): Promise<BattleRecord[]> {
  const result = await request<ListResponse<unknown> | unknown[]>('/api/battles')
  return getList(result).map(mapBattle)
}

export async function createBattle(input: { topic: string; aId: string; bId: string }): Promise<BattleRecord | null> {
  const result = await request<{ battle?: unknown } | unknown>('/api/battle', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  const record = asRecord(result)
  const battle = record.battle ?? result
  return Object.keys(asRecord(battle)).length ? mapBattle(battle, 0) : null
}

export async function voteBattle(battleId: string, side: VoteSide) {
  return request<{ voted?: boolean; votesA?: number; votesB?: number; aVotes?: number; bVotes?: number }>(
    `/api/battle/${encodeURIComponent(battleId)}/vote`,
    { method: 'POST', body: JSON.stringify({ side }) },
  )
}

export async function getDayFortune(date = new Date().toISOString().slice(0, 10)): Promise<FortuneRecord> {
  const result = await request<unknown>('/api/dayfortune')
  return mapFortune(result, date)
}

export async function getFortunes(month: string): Promise<FortuneRecord[]> {
  const result = await request<ListResponse<unknown> | unknown[]>(`/api/fortunes?month=${encodeURIComponent(month)}`)
  return getList(result).map((item) => mapFortune(item, `${month}-01`))
}

export async function getDayArt(): Promise<string> {
  const result = asRecord(await request<unknown>('/api/dayart'))
  return asString(result.imageUrl ?? result.img ?? asRecord(result.art).imageUrl)
}

export async function getDayLyric(type: 'vocal' | 'instrumental'): Promise<DayLyricResult> {
  const result = asRecord(await request<unknown>(`/api/daylyric?type=${encodeURIComponent(type)}`))
  return {
    title: asString(result.title),
    style: asString(result.style),
    lyrics: asString(result.lyrics),
  }
}

export async function submitFortuneSong(input: {
  title: string
  style: string
  lyrics: string
  prompt: string
  isInstrumental: boolean
}): Promise<GenerateTaskResult> {
  const result = asRecord(
    await request<unknown>('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ ...input, mode: 'fortune', originId: null }),
    }),
  )
  return { taskId: asString(result.taskId ?? result.id) }
}

export async function getGenerateTask(taskId: string): Promise<GenerateTaskStatus> {
  const result = asRecord(await request<unknown>(`/api/task/${encodeURIComponent(taskId)}`))
  const status = asString(result.status, 'running')
  const errorRecord = asRecord(result.error)
  return {
    taskId: asString(result.taskId ?? result.id, taskId),
    status: status === 'queued' || status === 'done' || status === 'error' ? status : 'running',
    stage: asString(result.stage) || undefined,
    progress: typeof result.progress === 'number' ? result.progress : undefined,
    result: asRecord(result.result) as GenerateTaskStatus['result'],
    error: asString(errorRecord.message ?? result.error) || null,
  }
}

export async function getQrCode(text: string, url: string): Promise<string> {
  const target = url || text
  return buildApiUrl(`/api/qr?text=${encodeURIComponent(target)}`)
}
