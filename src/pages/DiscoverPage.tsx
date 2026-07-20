import { useEffect, useMemo, useState } from 'react'
import { generateLyrics, generateLyricsWithFallback } from '../api/ai'
import { BackButton } from '../components/BackButton'
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
import { DiscoverHomePage } from './discover/DiscoverHomePage'
import { discoverStyles } from './discover/discoverStyles'
import { FortunePage } from './discover/FortunePage'
import type { BattleRecord, BattleVoteRecord, ChallengeParticipant, ChallengeSongRef, DiscoverView, FortuneSongDraft, VoteSide } from './discover/types'
import type { Song } from '../types/song'
import type { User } from '../types/user'

function getInitialView(): DiscoverView {
  const path = window.location.pathname
  if (path.startsWith('/challenges/')) return 'challenge'
  if (path === '/battles/new') return 'battleNew'
  if (path === '/battles') return 'battles'
  if (path === '/fortune') return 'fortune'
  return 'home'
}

type DiscoverPageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
  onSongGenerated: (song: Song) => void
  onJoinChallenge: (challenge: { id: string; title: string; prompt?: string }) => void
}

const today = new Date().toLocaleDateString('en-CA')
const currentMonth = today.slice(0, 7)
const FORTUNE_TASK_POLL_LIMIT = 180

type PendingFortuneTask = {
  taskId: string
  fortuneDate: string
}

function pendingFortuneTaskKey(userId: string) {
  return `echo_pending_fortune_task_${userId}`
}

function isPlaceholderTitle(title?: string) {
  const normalized = title?.trim().replace(/[《》「」“”]/g, '') ?? ''
  return !normalized || ['未命名', '未命名歌曲', 'AI生成歌曲', 'AI 生成歌曲', '今日微光', '今日微光（纯音乐）'].includes(normalized)
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

export function DiscoverPage({ user, songs, onOpenSong, onPlaySong, onSongGenerated, onJoinChallenge }: DiscoverPageProps) {
  const [view, setView] = useState<DiscoverView>(getInitialView)
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
  const [fortuneSongs, setFortuneSongs] = useState<FortuneSongDraft[]>([])
  const [fortunes, setFortunes] = useState(initialFortunes)
  const [todayFortune, setTodayFortune] = useState(() => initialFortunes.find((fortune) => fortune.date === today) ?? initialFortunes[0])
  const [battleTopic, setBattleTopic] = useState('哪首歌更适合今晚循环？')
  const [aId, setAId] = useState('song_001')
  const [bId, setBId] = useState('song_005')
  const [selectedDate, setSelectedDate] = useState(today)
  const [message, setMessage] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [generatingFortune, setGeneratingFortune] = useState(false)
  const [checkedInToday, setCheckedInToday] = useState(user.lastCheckin === today)

  const publishedSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    ;[...fortuneSongs.map((draft) => draft.song), ...challengeSongs, ...battles.flatMap((battle) => [battle.songA, battle.songB]), ...songs]
      .filter((song): song is Song => Boolean(song))
      .filter((song) => song.published || song.status === 'draft')
      .forEach((song) => songMap.set(song.id, song))
    return [...songMap.values()]
  }, [battles, challengeSongs, fortuneSongs, songs])
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
    if (!publishedSongs.length) return
    if (!publishedSongs.some((song) => song.id === aId)) setAId(publishedSongs[0]?.id ?? '')
    if (!publishedSongs.some((song) => song.id === bId) || aId === bId) {
      setBId(publishedSongs.find((song) => song.id !== aId)?.id ?? '')
    }
  }, [aId, bId, publishedSongs])

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
        getDayFortune(today),
        getFortunes(currentMonth),
        getDayArt(),
      ])

      if (cancelled) return

      const [challengeResult, battleResult, fortuneResult, calendarResult, artResult] = results

      if (challengeResult.status === 'fulfilled') {
        setChallenges(challengeResult.value)
        setSelectedChallengeId((current) =>
          challengeResult.value.some((challenge) => challenge.id === current)
            ? current
            : challengeResult.value[0]?.id ?? '',
        )
      }
      if (battleResult.status === 'fulfilled') setBattles(battleResult.value)
      if (fortuneResult.status === 'fulfilled') {
        const fortune = {
          ...fortuneResult.value,
          img: artResult.status === 'fulfilled' && artResult.value ? artResult.value : fortuneResult.value.img,
        }
        setTodayFortune(fortune)
        setCheckedInToday(true)
        setSelectedDate(fortune.date)
      }
      if (calendarResult.status === 'fulfilled' && calendarResult.value.length) {
        const calendar = calendarResult.value
        const currentFortune = fortuneResult.status === 'fulfilled' ? fortuneResult.value : null
        setFortunes(
          currentFortune && !calendar.some((fortune) => fortune.date === currentFortune.date)
            ? [currentFortune, ...calendar]
            : calendar,
        )
      }

      const failedCount = results.filter((result) => result.status === 'rejected').length
      if (failedCount) setMessage(`发现页有 ${failedCount} 项数据暂时加载失败，已保留可用内容。`)
      setLoadingData(false)
    }

    void loadDiscovery()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedChallengeId) return
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
  }, [selectedChallengeId])

  function navigate(nextView: DiscoverView, path: string) {
    window.history.pushState({}, '', path)
    setView(nextView)
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
      navigate('battles', '/battles')
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
        if (!status.result?.song) throw new Error('生成完成，但后端没有返回歌曲数据。')
        localStorage.removeItem(pendingFortuneTaskKey(user.id))
        addFortuneSong({ song: status.result.song, fortuneDate })
        return
      }
      if (status.status === 'error') {
        localStorage.removeItem(pendingFortuneTaskKey(user.id))
        throw new Error(status.error || '时运曲生成失败。')
      }
      await new Promise((resolve) => window.setTimeout(resolve, 2000))
    }
    throw new Error('时运曲仍在后台生成。任务进度已经保存，重新进入时运页面后会继续查询。')
  }

  async function generateFortuneSong(mode: 'vocal' | 'instrumental') {
    setGeneratingFortune(true)
    try {
      const isInstrumental = mode === 'instrumental'
      const fortunePrompt = [
        `日期：${todayFortune.date}`,
        `今日时运关键词：${todayFortune.keyword}`,
        `今日心情：${todayFortune.mood.name}`,
        `今日能量：${todayFortune.battery}`,
        `充电建议：${todayFortune.recharge ?? todayFortune.encourage ?? '治愈与放松'}`,
        isInstrumental
          ? '请据此创作一首纯音乐的标题和风格。标题要简洁、有画面感、与今日时运相关，不要使用“今日微光”，不要出现“纯音乐”字样；歌词内容仅作为创作参考，最终音乐不得包含人声。'
          : '请据此创作一首今日时运歌曲。标题要简洁、有画面感、与今日状态相关，不要使用“今日微光”；歌词需要完整并包含 Verse、Chorus 等段落。',
      ].join('\n')
      const styles = isInstrumental ? ['治愈', 'Lo-fi', '氛围纯音乐'] : ['治愈流行', 'Lo-fi']
      const lyricInput = { mode: 'song', prompt: fortunePrompt, styles }
      let lyric = await generateLyrics(lyricInput).catch(() => generateLyricsWithFallback(lyricInput))
      let vocalLyrics = isInstrumental ? '' : usableVocalLyrics(lyric.lyrics, lyric.rawText)

      if (!isInstrumental && !vocalLyrics) {
        const retryInput = {
          mode: 'song',
          prompt: `${fortunePrompt}\n上一次没有返回可识别的歌词。请严格按照“标题：”“风格：”“歌词：”输出，并提供完整的 [Verse] 和 [Chorus]。`,
          styles,
        }
        const retry = await generateLyrics(retryInput).catch(() => generateLyricsWithFallback(retryInput))
        lyric = retry
        vocalLyrics = usableVocalLyrics(retry.lyrics, retry.rawText)
      }

      if (!isInstrumental && !vocalLyrics) {
        const fallback = await generateLyricsWithFallback({
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
        const titleResult = await generateLyrics(titleInput).catch(() => generateLyricsWithFallback(titleInput))
        generatedTitle = isPlaceholderTitle(titleResult.title) ? extractAiTitle(titleResult.rawText) : titleResult.title.trim()
      }
      const fallbackTitle = `${todayFortune.keyword}·${todayFortune.mood.name}`
      const task = await submitFortuneSong({
        title: isPlaceholderTitle(generatedTitle) ? fallbackTitle : generatedTitle,
        style: lyric.style?.trim() || (isInstrumental ? 'Lo-fi / 氛围纯音乐' : '治愈流行 / Lo-fi'),
        lyrics: isInstrumental ? '' : vocalLyrics,
        prompt: fortunePrompt,
        isInstrumental,
      })
      if (!task.taskId) throw new Error('后端没有返回生成任务 ID。')
      localStorage.setItem(pendingFortuneTaskKey(user.id), JSON.stringify({
        taskId: task.taskId,
        fortuneDate: todayFortune.date,
      } satisfies PendingFortuneTask))
      await waitForFortuneTask(task.taskId, todayFortune.date)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '时运曲生成失败，请稍后重试。')
    } finally {
      setGeneratingFortune(false)
    }
  }

  return (
    <section className={`page-stack discover-suite discover-suite--${view}`}>
      <style>{discoverStyles}</style>

      <div className="discover-hero">
        <div>
          <span>Discover</span>
          <h1>发现灵感、对决和今日时运</h1>
          <p>从每日时运曲开始，加入话题创作，或发起一场让大家投票的歌曲 PK。</p>
        </div>
        <div className="discover-hero__actions">
          <button type="button" onClick={() => navigate('fortune', '/fortune')}>今日打卡</button>
          <button type="button" onClick={() => navigate('battleNew', '/battles/new')}>发起擂台</button>
        </div>
      </div>

      <nav className="discover-tabs" aria-label="发现页功能">
        {[
          ['home', '/discover', '总览'],
          ['challenge', selectedChallenge ? `/challenges/${selectedChallenge.id}` : '/discover', '话题挑战'],
          ['battles', '/battles', 'PK 擂台'],
          ['battleNew', '/battles/new', '创建擂台'],
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

      {view !== 'home' && view !== 'battleNew' ? (
        <div className="discover-back-row">
          <BackButton label="返回发现总览" onClick={() => navigate('home', '/discover')} />
        </div>
      ) : null}

      {view === 'home' ? (
        <DiscoverHomePage
          battles={battles}
          challenges={activeChallenges}
          todayFortune={todayFortune}
          onNavigateBattles={() => navigate('battles', '/battles')}
          onNavigateFortune={() => navigate('fortune', '/fortune')}
          onOpenChallenge={openChallenge}
        />
      ) : null}

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
        /> : <section className="content-panel empty-panel"><h2>暂无话题挑战</h2><p>后端当前还没有发布可参与的话题。</p></section>
      ) : null}

      {view === 'battles' ? (
        <BattlesPage
          battleVotes={battleVotes}
          battles={battles}
          currentUserId={user.id}
          songs={publishedSongs}
          onCreate={() => navigate('battleNew', '/battles/new')}
          onOpenSong={onOpenSong}
          onPlaySong={onPlaySong}
          onVote={voteBattle}
        />
      ) : null}

      {view === 'battleNew' ? (
        <BattleNewPage
          aId={aId}
          bId={bId}
          songs={publishedSongs}
          topic={battleTopic}
          onBack={() => navigate('battles', '/battles')}
          onChangeAId={setAId}
          onChangeBId={setBId}
          onChangeTopic={setBattleTopic}
          onCreate={createBattle}
          onOpenSong={onOpenSong}
          onPlaySong={onPlaySong}
        />
      ) : null}

      {view === 'fortune' ? (
        <FortunePage
          fortunes={fortunes}
          generatedSongs={fortuneSongs}
          generating={generatingFortune}
          checkedInToday={checkedInToday}
          month={currentMonth}
          selectedDate={selectedDate}
          onCheckin={setMessage}
          onCheckinToday={() => {
            setCheckedInToday(true)
            setMessage('今日已打卡，签到状态已经保存。')
          }}
          onGenerateSong={(mode) => void generateFortuneSong(mode)}
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
