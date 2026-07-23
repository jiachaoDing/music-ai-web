import { useEffect, useMemo, useState } from 'react'
import { generateLyrics } from '../api/ai'
import { getPublicSongs } from '../api/song'
import {
  createBattle as createBattleRequest,
  getBattles,
  getChallengeDetail,
  getChallenges,
  getDayArt,
  getDayFortune,
  getFortunes,
  getGenerateTask,
  submitFortuneSong,
  voteBattle as voteBattleRequest,
} from '../api/discovery'
import { BattleNewPage } from './discover/BattleNewPage'
import { BattlesPage } from './discover/BattlesPage'
import { ChallengeDetailPage } from './discover/ChallengeDetailPage'
import { initialBattles, initialChallenges, initialFortunes } from './discover/data'
import { discoverStyles } from './discover/discoverStyles'
import { FortunePage } from './discover/FortunePage'
import type { BattleRecord, BattleVoteRecord, ChallengeParticipant, ChallengeSongRef, DiscoverView, FortuneRecord, FortuneSongDraft, VoteSide } from './discover/types'
import type { Song } from '../types/song'
import type { User } from '../types/user'

function getInitialView(): DiscoverView {
  const path = window.location.pathname
  if (path.startsWith('/challenges/')) return 'challenge'
  if (path === '/battles/new' || path === '/battles') return 'battles'
  if (path === '/fortune') return 'fortune'
  return 'challenge'
}

type DiscoverPageProps = {
  user: User
  songs: Song[]
  battleSongs: Song[]
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
  onSongGenerated: (song: Song) => void
  onJoinChallenge: (challenge: { id: string; title: string; prompt?: string }) => void
  onOpenHost: () => void
}

const FORTUNE_TASK_POLL_LIMIT = 180

function getLocalDate() {
  return new Date().toLocaleDateString('en-CA')
}

function fortuneCheckinKey(userId: string) {
  return `echo_fortune_checkin_${userId}`
}

type PendingFortuneTask = {
  taskId: string
  fortuneDate: string
}

function pendingFortuneTaskKey(userId: string) {
  return `echo_pending_fortune_task_${userId}`
}

function isPlaceholderTitle(title?: string) {
  const normalized = title?.trim().replace(/[《》「」“”]/g, '') ?? ''
  return !normalized || ['未命名', '未命名歌曲', 'AI生成歌曲', 'AI 生成歌曲', '今日微光', '今日微光（纯音乐）', '歌名', '标题', '歌曲标题'].includes(normalized)
}

function isPlaceholderFortune(fortune: FortuneRecord) {
  return fortune.id.startsWith('placeholder_') || fortune.keyword === '待打卡'
}

function extractAiTitle(rawText?: string) {
  if (!rawText) return ''
  const match = rawText.match(/(?:标题|歌名)\s*[:：]\s*[《「“"]?([^》」”"\n]+)/)
  return match?.[1]?.trim() ?? ''
}

function extractAiLyrics(rawText?: string) {
  if (!rawText) return ''
  const cleaned = rawText.replace(/<\/?think>/gi, '').trim()
  const sections = [...cleaned.matchAll(/\[([^\]]+)\]/g)].filter((match) => {
    const label = match[1].replace(/\s+/g, '').toLowerCase()
    return label === 'verse' || label === 'verse1' || label === '主歌' || label === '主歌一' || label === '主歌1'
  })
  const finalDraftStart = sections.at(-1)
  if (finalDraftStart?.index !== undefined) return cleaned.slice(finalDraftStart.index).trim()
  const section = cleaned.match(/\[(?:Chorus|Bridge|副歌)[^\]]*\][\s\S]*/i)
  if (section?.[0]?.trim()) return section[0].trim()
  const marker = cleaned.match(/(?:歌词|Lyrics)\s*[:：]\s*([\s\S]+)/i)
  return marker?.[1]?.trim() ?? ''
}

function usableVocalLyrics(lyrics?: string, rawText?: string) {
  const direct = lyrics?.trim() ?? ''
  if (direct && /(?:标题|歌名|风格)\s*[:：]/.test(direct)) {
    return extractAiLyrics(direct) || extractAiLyrics(rawText)
  }
  if (direct && !/^(?:歌词|Lyrics)\s*[:：]?$/i.test(direct)) return direct
  return extractAiLyrics(rawText)
}

function loadSavedBattleVotes(userId: string): BattleVoteRecord[] {
  try {
    const value = JSON.parse(localStorage.getItem(`echo_battle_votes_${userId}`) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function DiscoverPage({ user, songs, battleSongs, onOpenSong, onPlaySong, onSongGenerated, onJoinChallenge, onOpenHost }: DiscoverPageProps) {
  const [today, setToday] = useState(getLocalDate)
  const currentMonth = today.slice(0, 7)
  const [view, setView] = useState<DiscoverView>(getInitialView)
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const [mobileLauncherOpen, setMobileLauncherOpen] = useState(() => window.matchMedia('(max-width: 640px)').matches && window.location.pathname === '/discover')
  const [battleMode, setBattleMode] = useState<'list' | 'create'>(() => window.location.pathname === '/battles/new' ? 'create' : 'list')
  const [selectedChallengeId, setSelectedChallengeId] = useState(() => {
    const challengeId = window.location.pathname.split('/challenges/')[1]
    return challengeId || initialChallenges[0].id
  })
  const [challengeSongRefs, setChallengeSongRefs] = useState<ChallengeSongRef[]>([])
  const [challengeSongs, setChallengeSongs] = useState<Song[]>([])
  const [challengeParticipants, setChallengeParticipants] = useState<ChallengeParticipant[]>([])
  const [challenges, setChallenges] = useState(initialChallenges)
  const [battles, setBattles] = useState<BattleRecord[]>(initialBattles)
  const [battleVotes, setBattleVotes] = useState<BattleVoteRecord[]>(() => loadSavedBattleVotes(user.id))
  const [battleCandidates, setBattleCandidates] = useState<Song[]>(battleSongs)
  const [fortuneSongs, setFortuneSongs] = useState<FortuneSongDraft[]>([])
  const [fortunes, setFortunes] = useState(initialFortunes)
  const [todayFortune, setTodayFortune] = useState(() => initialFortunes.find((fortune) => fortune.date === today) ?? initialFortunes[0])
  const [battleTopic, setBattleTopic] = useState('哪首歌更适合今晚循环？')
  const [aId, setAId] = useState('song_001')
  const [bId, setBId] = useState('song_005')
  const [selectedDate, setSelectedDate] = useState(today)
  const [message, setMessage] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [challengesLoaded, setChallengesLoaded] = useState(false)
  const [generatingFortune, setGeneratingFortune] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkedInToday, setCheckedInToday] = useState(false)

  useEffect(() => {
    const syncDate = () => setToday((current) => {
      const next = getLocalDate()
      return current === next ? current : next
    })
    const handleVisibility = () => {
      if (!document.hidden) syncDate()
    }
    const timer = window.setInterval(syncDate, 30_000)
    window.addEventListener('focus', syncDate)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', syncDate)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    setSelectedDate(today)
    setCheckedInToday(false)
  }, [today, user.id, user.lastCheckin])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const syncViewport = () => setIsMobileViewport(media.matches)
    media.addEventListener('change', syncViewport)
    return () => media.removeEventListener('change', syncViewport)
  }, [])

  const publishedSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    ;[...fortuneSongs.map((draft) => draft.song), ...challengeSongs, ...battles.flatMap((battle) => [battle.songA, battle.songB]), ...songs]
      .filter((song): song is Song => Boolean(song))
      .filter((song) => song.published || song.status === 'draft')
      .forEach((song) => songMap.set(song.id, song))
    return [...songMap.values()]
  }, [battles, challengeSongs, fortuneSongs, songs])
  const availableBattleSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    battleCandidates
      .filter((song) => song.published && song.status === 'published')
      .forEach((song) => songMap.set(song.id, song))
    return [...songMap.values()]
  }, [battleCandidates])

  useEffect(() => {
    let cancelled = false
    getPublicSongs()
      .then((publicSongs) => {
        if (!cancelled) setBattleCandidates(publicSongs)
      })
      .catch((error) => {
        console.error('Failed to load public battle songs.', error)
        if (!cancelled) setBattleCandidates(battleSongs)
      })
    return () => {
      cancelled = true
    }
  }, [battleSongs])
  const activeChallenges = challenges.filter((challenge) => challenge.active && challenge.status === 'active')
  const selectedChallenge = challenges.find((challenge) => challenge.id === selectedChallengeId) ?? activeChallenges[0]
  const selectedChallengeSongs = useMemo(() => {
    if (!selectedChallenge) return []
    const refs = new Map(challengeSongRefs.filter((ref) => ref.challengeId === selectedChallenge.id).map((ref) => [ref.songId, ref]))
    songs.filter((song) => song.challengeId === selectedChallenge.id).forEach((song, index) => {
      if (!refs.has(song.id)) refs.set(song.id, { id: song.id, challengeId: selectedChallenge.id, songId: song.id, note: song.description ?? '我参与的话题作品', rank: refs.size + index + 1 })
    })
    return [...refs.values()]
  }, [challengeSongRefs, selectedChallenge, songs])
  const hasParticipated = selectedChallengeSongs.some((ref) => publishedSongs.find((song) => song.id === ref.songId)?.author.id === user.id)

  useEffect(() => {
    if (!availableBattleSongs.length) return
    if (!availableBattleSongs.some((song) => song.id === aId)) setAId(availableBattleSongs[0]?.id ?? '')
    if (!availableBattleSongs.some((song) => song.id === bId) || aId === bId) {
      setBId(availableBattleSongs.find((song) => song.id !== aId)?.id ?? '')
    }
  }, [aId, availableBattleSongs, bId])

  useEffect(() => {
    const saved = localStorage.getItem(pendingFortuneTaskKey(user.id))
    if (!saved) return
    try {
      const pending = JSON.parse(saved) as PendingFortuneTask
      if (!pending.taskId || !pending.fortuneDate) return
      setGeneratingFortune(true)
      void waitForFortuneTask(pending.taskId, pending.fortuneDate)
        .catch((error) => setMessage(error instanceof Error ? error.message : '恢复时运曲生成任务失败。'))
        .finally(() => setGeneratingFortune(false))
    } catch {
      localStorage.removeItem(pendingFortuneTaskKey(user.id))
    }
  // 恢复任务只应在登录用户变化时触发，避免轮询函数重建导致重复请求。
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  useEffect(() => {
    let cancelled = false

    async function loadDiscovery() {
      setLoadingData(true)
      const results = await Promise.allSettled([
        getChallenges(),
        getBattles(),
        getFortunes(currentMonth),
        getDayArt(),
      ])

      if (cancelled) return

      const [challengeResult, battleResult, calendarResult, artResult] = results

      if (challengeResult.status === 'fulfilled') {
        setChallenges(challengeResult.value)
        setChallengesLoaded(true)
        setSelectedChallengeId((current) =>
          challengeResult.value.some((challenge) => challenge.id === current)
            ? current
            : challengeResult.value[0]?.id ?? '',
        )
      }
      if (battleResult.status === 'fulfilled') setBattles(battleResult.value)
      if (calendarResult.status === 'fulfilled' && calendarResult.value.length) {
        const calendar = calendarResult.value
        let currentFortune = calendar.find((fortune) => fortune.date === today)
        const artUrl = artResult.status === 'fulfilled' ? artResult.value : ''
        const hasSavedCheckin = user.lastCheckin === today
          || localStorage.getItem(fortuneCheckinKey(user.id)) === today

        if (hasSavedCheckin && (!currentFortune || isPlaceholderFortune(currentFortune))) {
          try {
            const restoredFortune = await getDayFortune(today)
            currentFortune = { ...restoredFortune, date: today, img: restoredFortune.img || artUrl }
          } catch {
            currentFortune = undefined
          }
        }

        if (cancelled) return

        if (currentFortune) {
          currentFortune = { ...currentFortune, img: currentFortune.img || artUrl }
        }
        const nextCalendar = currentFortune
          ? [...calendar.filter((fortune) => fortune.date !== today), currentFortune]
              .sort((left, right) => left.date.localeCompare(right.date))
          : calendar
        setFortunes(nextCalendar)
        if (currentFortune) {
          setTodayFortune({ ...currentFortune, img: currentFortune.img || artUrl })
          setCheckedInToday(!isPlaceholderFortune(currentFortune))
        } else {
          setCheckedInToday(false)
        }
      }

      const failedCount = results.filter((result) => result.status === 'rejected').length
      if (failedCount) setMessage(`发现页有 ${failedCount} 项数据暂时加载失败，已保留可用内容。`)
      setLoadingData(false)
    }

    void loadDiscovery()
    return () => {
      cancelled = true
    }
  }, [currentMonth, today, user.id, user.lastCheckin])

  useEffect(() => {
    if (!challengesLoaded || !selectedChallengeId) return
    let cancelled = false
    setChallengeSongRefs([])
    setChallengeSongs([])
    setChallengeParticipants([])
    getChallengeDetail(selectedChallengeId)
      .then((detail) => {
        if (cancelled) return
        setChallengeSongRefs(detail.refs)
        setChallengeSongs(detail.songs)
        setChallengeParticipants(detail.participants)
        if (detail.challenge) {
          setChallenges((current) => current.map((challenge) => challenge.id === detail.challenge?.id ? { ...challenge, ...detail.challenge } : challenge))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setChallengeSongRefs([])
          setChallengeSongs([])
          setChallengeParticipants([])
        }
      })
    return () => { cancelled = true }
  }, [challengesLoaded, selectedChallengeId])

  function navigate(nextView: DiscoverView, path: string) {
    window.history.pushState({}, '', path)
    setView(nextView)
    if (nextView === 'battles') setBattleMode('list')
    setMessage('')
  }

  function openBattleCreator() {
    window.history.pushState({}, '', '/battles')
    setView('battles')
    setBattleMode('create')
    setMessage('')
  }

  function openMobileSection(nextView: DiscoverView, path: string) {
    setMobileLauncherOpen(false)
    navigate(nextView, path)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  function openMobileLauncher() {
    window.history.pushState({}, '', '/discover')
    setMobileLauncherOpen(true)
    setMessage('')
  }

  function openChallenge(challengeId: string) {
    setSelectedChallengeId(challengeId)
    navigate('challenge', `/challenges/${challengeId}`)
  }

  async function voteBattle(battleId: string, side: VoteSide) {
    const hasVoted = battleVotes.some((vote) => vote.battleId === battleId && vote.userId === user.id)
    if (hasVoted) {
      setMessage('你已经投过这个擂台了，每场对决只能投一次。')
      return
    }

    function rememberVote(savedSide?: VoteSide) {
      setBattleVotes((current) => {
        if (current.some((vote) => vote.battleId === battleId && vote.userId === user.id)) return current
        const next = [
          ...current,
          { id: `battle_vote_${Date.now()}`, battleId, userId: user.id, side: savedSide, createdAt: new Date().toISOString() },
        ]
        localStorage.setItem(`echo_battle_votes_${user.id}`, JSON.stringify(next))
        return next
      })
    }

    try {
      const result = await voteBattleRequest(battleId, side)
      setBattles((current) =>
        current.map((battle) =>
          battle.id === battleId
            ? {
                ...battle,
                aVotes: result.votesA ?? result.aVotes ?? battle.aVotes + (side === 'A' ? 1 : 0),
                bVotes: result.votesB ?? result.bVotes ?? battle.bVotes + (side === 'B' ? 1 : 0),
                votedSide: side,
                updatedAt: new Date().toISOString(),
              }
            : battle,
        ),
      )
      rememberVote(side)
      setMessage(`投票成功，你支持了 ${side} 方。`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '投票失败，请稍后重试。'
      if (errorMessage.includes('已经投过') || errorMessage.includes('已投过')) {
        rememberVote()
        setMessage('你已经投过这个擂台了，投票状态已恢复。')
      } else {
        setMessage(errorMessage)
      }
    }
  }

  async function createBattle() {
    if (!battleTopic.trim()) {
      setMessage('请先写一个擂台主题。')
      return
    }

    if (!aId || !bId || aId === bId) {
      setMessage('请选择两首不同的歌曲。')
      return
    }

    try {
      const created = await createBattleRequest({ topic: battleTopic.trim(), aId, bId })
      const latestBattles = await getBattles()
      setBattles(latestBattles.length ? latestBattles : created ? [created] : [])
      setBattleMode('list')
      window.history.replaceState({}, '', '/battles')
      setMessage('擂台创建成功，大家可以开始投票了。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '擂台创建失败，请稍后重试。')
    }
  }

  function addFortuneSong(draft: FortuneSongDraft) {
    setFortuneSongs((current) => current.some((item) => item.song.id === draft.song.id) ? current : [draft, ...current])
    onSongGenerated(draft.song)
    setMessage(`时运曲已生成：${draft.song.title}。`)
  }

  async function waitForFortuneTask(taskId: string, fortuneDate: string) {
    for (let attempt = 0; attempt < FORTUNE_TASK_POLL_LIMIT; attempt += 1) {
      const status = await getGenerateTask(taskId)
      if (status.status === 'done') {
        if (!status.result?.song) throw new Error('歌曲生成结果暂时不可用，请稍后重试。')
        localStorage.removeItem(pendingFortuneTaskKey(user.id))
        addFortuneSong({ song: status.result.song, fortuneDate })
        return
      }
      if (status.status === 'error') {
        localStorage.removeItem(pendingFortuneTaskKey(user.id))
        throw new Error(status.error || '时运曲生成失败。')
      }
      if (status.status === 'queued') {
        setMessage((status.queueAhead ?? 0) > 0
          ? `时运曲正在排队，前面还有 ${status.queueAhead} 个 AI 请求。`
          : '时运曲即将开始生成，正在分配生成资源。')
      } else {
        setMessage('时运曲正在生成，请稍候。')
      }
      await new Promise((resolve) => window.setTimeout(resolve, 2000))
    }
    throw new Error('时运曲仍在后台生成。任务进度已经保存，重新进入时运页面后会继续查询。')
  }

  async function checkInToday() {
    if (checkingIn || checkedInToday) {
      setMessage('今天已经打卡，无需重复操作。')
      return
    }
    setCheckingIn(true)
    try {
      const fortune = await getDayFortune(today)
      const checkedFortune = { ...fortune, date: today, img: fortune.img || todayFortune.img }
      setTodayFortune(checkedFortune)
      setFortunes((current) => current.some((item) => item.date === today)
        ? current.map((item) => item.date === today ? checkedFortune : item)
        : [checkedFortune, ...current])
      setSelectedDate(today)
      setCheckedInToday(true)
      localStorage.setItem(fortuneCheckinKey(user.id), today)
      setMessage('今日已打卡，签到状态已经保存。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '今日打卡失败，请稍后重试。')
    } finally {
      setCheckingIn(false)
    }
  }

  async function generateFortuneSong(mode: 'vocal' | 'instrumental', selectedFortune: FortuneRecord) {
    if (isPlaceholderFortune(selectedFortune)) {
      setMessage(selectedFortune.date < today ? '当日未打卡，暂无时运记录。' : '时运尚未开启。')
      return
    }
    if (selectedFortune.date > today) {
      setMessage('时运尚未开启。')
      return
    }
    if (selectedFortune.date < today) {
      setMessage('历史时运仅供查看，不能再次生成歌曲。')
      return
    }
    setGeneratingFortune(true)
    try {
      const isInstrumental = mode === 'instrumental'
      const fortunePrompt = [
        `日期：${selectedFortune.date}`,
        `当日时运关键词：${selectedFortune.keyword}`,
        `当日心情：${selectedFortune.mood.name}`,
        `当日能量：${selectedFortune.battery}`,
        `宜：${selectedFortune.dos?.join('、') || '顺其自然'}`,
        `忌：${selectedFortune.donts?.join('、') || '过度消耗'}`,
        `充电建议：${selectedFortune.recharge ?? selectedFortune.encourage ?? '治愈与放松'}`,
        isInstrumental
          ? '请据此创作一首纯音乐的标题和风格。标题要简洁、有画面感、与今日时运相关，不要使用“今日微光”，不要出现“纯音乐”字样；歌词内容仅作为创作参考，最终音乐不得包含人声。'
          : '请据此创作一首今日时运歌曲。标题要简洁、有画面感、与今日状态相关，不要使用“今日微光”；歌词需要完整并包含 Verse、Chorus 等段落。',
      ].join('\n')
      const styles = isInstrumental ? ['治愈', 'Lo-fi', '氛围纯音乐'] : ['治愈流行', 'Lo-fi']
      const lyricInput = { mode: 'song', prompt: fortunePrompt, styles }
      let lyric = await generateLyrics(lyricInput)
      let vocalLyrics = isInstrumental ? '' : usableVocalLyrics(lyric.lyrics, lyric.rawText)

      if (!isInstrumental && !vocalLyrics) {
        const retryInput = {
          mode: 'song',
          prompt: `${fortunePrompt}\n上一次没有返回可识别的歌词。请严格按照“标题：”“风格：”“歌词：”输出，并提供完整的 [Verse] 和 [Chorus]。`,
          styles,
        }
        const retry = await generateLyrics(retryInput)
        lyric = retry
        vocalLyrics = usableVocalLyrics(retry.lyrics, retry.rawText)
      }

      if (!isInstrumental && !vocalLyrics) {
        const fallback = await generateLyrics({
          mode: 'song',
          prompt: `${fortunePrompt}\n请生成完整且非空的 [Verse]、[Chorus] 演唱歌词。`,
          styles,
        })
        if (isPlaceholderTitle(lyric.title) && !isPlaceholderTitle(fallback.title)) lyric = fallback
        vocalLyrics = usableVocalLyrics(fallback.lyrics, fallback.rawText)
      }

      if (!isInstrumental && !vocalLyrics) {
        throw new Error('AI 没有返回演唱歌词，本次未提交音乐生成，请稍后重试。')
      }

      let generatedTitle = isPlaceholderTitle(lyric.title) ? extractAiTitle(lyric.rawText) : lyric.title.trim()
      if (isPlaceholderTitle(generatedTitle)) {
        const titleInput = {
          mode: 'song',
          prompt: `${fortunePrompt}\n上一次没有生成有效歌名。请重新构思一个独特的中文歌名，并严格以“标题：歌名”开头。`,
          styles,
        }
        const titleResult = await generateLyrics(titleInput)
        generatedTitle = isPlaceholderTitle(titleResult.title) ? extractAiTitle(titleResult.rawText) : titleResult.title.trim()
      }
      const fallbackTitle = `${selectedFortune.keyword}·${selectedFortune.mood.name}`
      const task = await submitFortuneSong({
        title: isPlaceholderTitle(generatedTitle) ? fallbackTitle : generatedTitle,
        style: lyric.style?.trim() || (isInstrumental ? 'Lo-fi / 氛围纯音乐' : '治愈流行 / Lo-fi'),
        lyrics: isInstrumental ? '' : vocalLyrics,
        prompt: fortunePrompt,
        isInstrumental,
      })
      if (!task.taskId) throw new Error('生成任务提交失败，请稍后重试。')
      setMessage((task.queueAhead ?? 0) > 0
        ? `时运曲已进入队列，前面还有 ${task.queueAhead} 个 AI 请求。`
        : '时运曲任务已提交，正在等待生成资源。')
      localStorage.setItem(pendingFortuneTaskKey(user.id), JSON.stringify({
        taskId: task.taskId,
        fortuneDate: selectedFortune.date,
      } satisfies PendingFortuneTask))
      await waitForFortuneTask(task.taskId, selectedFortune.date)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '时运曲生成失败，请稍后重试。')
    } finally {
      setGeneratingFortune(false)
    }
  }

  return (
    <section className={`page-stack discover-suite discover-suite--${view}${isMobileViewport && mobileLauncherOpen ? ' discover-suite--launcher' : ''}`}>
      <style>{discoverStyles}</style>

      <section className="discover-mobile-launcher" aria-label="发现功能入口">
        <div className="discover-mobile-launcher__heading">
          <span>Discover</span>
          <h1>今天想发现什么？</h1>
          <p>从一个入口开始，遇见新的声音、对决和每日时运。</p>
        </div>
        <button className="discover-curator-entry" type="button" onClick={onOpenHost}>
          <span>Echo AI Curator</span>
          <strong>去主理人主页听今日策展</strong>
          <b aria-hidden="true">→</b>
        </button>
        <div className="discover-mobile-launcher__grid">
          <button type="button" onClick={() => openMobileSection('challenge', selectedChallenge ? `/challenges/${selectedChallenge.id}` : '/discover')}>
            <i aria-hidden="true">✦</i>
            <span>Creative Topics</span>
            <strong>话题挑战</strong>
            <small>跟随主题写下你的新作品</small>
          </button>
          <button type="button" onClick={() => openMobileSection('battles', '/battles')}>
            <i aria-hidden="true">VS</i>
            <span>Vote Arena</span>
            <strong>PK 擂台</strong>
            <small>听两首歌，为喜欢的一方投票</small>
          </button>
          <button type="button" onClick={() => openMobileSection('fortune', '/fortune')}>
            <i aria-hidden="true">☼</i>
            <span>Daily Fortune</span>
            <strong>时运曲</strong>
            <small>打开今日能量与专属旋律</small>
          </button>
        </div>
      </section>

      {isMobileViewport && !mobileLauncherOpen ? (
        <button className="discover-mobile-home" type="button" onClick={openMobileLauncher}>← 发现菜单</button>
      ) : null}

      <div className="discover-hero">
        <div>
          <span>Discover</span>
          <h1>发现灵感、对决和今日时运</h1>
          <p>从每日时运曲开始，加入话题创作，或发起一场让大家投票的歌曲 PK。</p>
        </div>
        <div className="discover-hero__actions">
          <button type="button" onClick={() => navigate('fortune', '/fortune')}>今日打卡</button>
          <button type="button" onClick={openBattleCreator}>发起擂台</button>
          <button type="button" onClick={onOpenHost}>AI 主理人</button>
        </div>
      </div>

      <button className="discover-curator-spotlight" type="button" onClick={onOpenHost}>
        <span className="discover-curator-spotlight__avatar" aria-hidden="true">
          <img src="/assets/echo-ai-curator.png" alt="" />
        </span>
        <span className="discover-curator-spotlight__copy">
          <small>Echo AI Curator · Daily Selection</small>
          <strong>今天，让 Echo 主理人替你挑一首歌</strong>
          <em>每日主打、社区翻牌与灵感话题，都由这位 AI 音乐策展人持续更新。</em>
        </span>
        <b aria-hidden="true">进入今日策展 ↗</b>
      </button>

      <nav className="discover-tabs" aria-label="发现页功能">
        {[
          ['challenge', selectedChallenge ? `/challenges/${selectedChallenge.id}` : '/discover', '话题挑战'],
          ['battles', '/battles', 'PK 擂台'],
          ['fortune', '/fortune', '时运日历'],
        ].map(([key, path, label]) => (
          <button
            className={view === key ? 'is-active' : ''}
            key={key}
            type="button"
            onClick={() => navigate(key as DiscoverView, path)}
          >
            {label}
          </button>
        ))}
      </nav>

      {view === 'challenge' ? (
        selectedChallenge ? <ChallengeDetailPage
          challenges={activeChallenges}
          publishedSongs={publishedSongs}
          selectedChallenge={selectedChallenge}
          selectedChallengeSongs={selectedChallengeSongs}
          participants={challengeParticipants}
          hasParticipated={hasParticipated}
          onOpenChallenge={openChallenge}
          onOpenSong={onOpenSong}
          onPlaySong={onPlaySong}
          onJoin={() => onJoinChallenge({ id: selectedChallenge.id, title: selectedChallenge.title, prompt: selectedChallenge.prompt ?? selectedChallenge.desc })}
        /> : <section className="content-panel empty-panel"><h2>暂无话题挑战</h2><p>暂时没有可参与的话题。</p></section>
      ) : null}

      {view === 'battles' ? (
        <section className="battle-workspace">
          <div className="battle-mode-switch" role="group" aria-label="PK 擂台功能">
            <button className={battleMode === 'list' ? 'is-active' : ''} type="button" onClick={() => setBattleMode('list')}>擂台对决</button>
            <button className={battleMode === 'create' ? 'is-active' : ''} type="button" onClick={openBattleCreator}>创建擂台</button>
          </div>
          {battleMode === 'list' ? (
            <BattlesPage
              battleVotes={battleVotes}
              battles={battles}
              currentUserId={user.id}
              songs={availableBattleSongs}
              onCreate={openBattleCreator}
              onOpenSong={onOpenSong}
              onPlaySong={onPlaySong}
              onVote={voteBattle}
            />
          ) : (
            <BattleNewPage
              aId={aId}
              bId={bId}
              songs={availableBattleSongs}
              topic={battleTopic}
              onBack={() => setBattleMode('list')}
              onChangeAId={setAId}
              onChangeBId={setBId}
              onChangeTopic={setBattleTopic}
              onCreate={createBattle}
              onOpenSong={onOpenSong}
              onPlaySong={onPlaySong}
            />
          )}
        </section>
      ) : null}

      {view === 'fortune' ? (
        <FortunePage
          fortunes={fortunes}
          generatedSongs={fortuneSongs}
          generating={generatingFortune}
          checkingIn={checkingIn}
          checkedInToday={checkedInToday}
          month={currentMonth}
          selectedDate={selectedDate}
          onCheckin={setMessage}
          onCheckinToday={() => void checkInToday()}
          onGenerateSong={(mode, fortune) => void generateFortuneSong(mode, fortune)}
          onSelectDate={setSelectedDate}
        />
      ) : null}

      {message ? (
        <div className="discover-modal-backdrop" role="presentation" onClick={() => setMessage('')}>
          <section className="discover-modal" role="dialog" aria-modal="true" aria-label="操作提示" onClick={(event) => event.stopPropagation()}>
            <span>Echo Notice</span>
            <h2>操作完成</h2>
            <p>{message}</p>
            <button type="button" onClick={() => setMessage('')}>知道了</button>
          </section>
        </div>
      ) : null}
      {loadingData ? <div className="discover-loading" role="status">正在加载发现页数据…</div> : null}
    </section>
  )
}
