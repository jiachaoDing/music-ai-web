import { useEffect, useMemo, useState } from 'react'
import {
  createBattle as createBattleRequest,
  getBattles,
  getChallenges,
  getDayArt,
  getDayFortune,
  getDayLyric,
  getFortunes,
  getGenerateTask,
  submitFortuneSong,
  voteBattle as voteBattleRequest,
} from '../api/discovery'
import { BattleNewPage } from './discover/BattleNewPage'
import { BattlesPage } from './discover/BattlesPage'
import { ChallengeDetailPage } from './discover/ChallengeDetailPage'
import { initialBattles, initialChallengeSongRefs, initialChallenges, initialFortunes } from './discover/data'
import { DiscoverHomePage } from './discover/DiscoverHomePage'
import { discoverStyles } from './discover/discoverStyles'
import { FortunePage } from './discover/FortunePage'
import type { BattleRecord, BattleVoteRecord, DiscoverView, FortuneSongDraft, VoteSide } from './discover/types'
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
}

const today = new Date().toISOString().slice(0, 10)
const currentMonth = today.slice(0, 7)

export function DiscoverPage({ user, songs, onOpenSong, onPlaySong }: DiscoverPageProps) {
  const [view, setView] = useState<DiscoverView>(getInitialView)
  const [selectedChallengeId, setSelectedChallengeId] = useState(() => {
    const challengeId = window.location.pathname.split('/challenges/')[1]
    return initialChallenges.some((challenge) => challenge.id === challengeId) ? challengeId : initialChallenges[0].id
  })
  const [challengeSongRefs, setChallengeSongRefs] = useState(initialChallengeSongRefs)
  const [challenges, setChallenges] = useState(initialChallenges)
  const [battles, setBattles] = useState<BattleRecord[]>(initialBattles)
  const [battleVotes, setBattleVotes] = useState<BattleVoteRecord[]>([])
  const [fortuneSongs, setFortuneSongs] = useState<FortuneSongDraft[]>([])
  const [fortunes, setFortunes] = useState(initialFortunes)
  const [todayFortune, setTodayFortune] = useState(() => initialFortunes.find((fortune) => fortune.date === today) ?? initialFortunes[0])
  const [selectedSongId, setSelectedSongId] = useState(songs.find((song) => song.published)?.id ?? songs[0]?.id ?? '')
  const [creationTitle, setCreationTitle] = useState('夏夜回信')
  const [battleTopic, setBattleTopic] = useState('哪首歌更适合今晚循环？')
  const [aId, setAId] = useState('song_001')
  const [bId, setBId] = useState('song_005')
  const [selectedDate, setSelectedDate] = useState(today)
  const [message, setMessage] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [generatingFortune, setGeneratingFortune] = useState(false)

  const publishedSongs = useMemo(
    () => [...fortuneSongs.map((draft) => draft.song), ...songs].filter((song) => song.published || song.status === 'draft'),
    [fortuneSongs, songs],
  )
  const activeChallenges = challenges.filter((challenge) => challenge.active && challenge.status === 'active')
  const selectedChallenge = challenges.find((challenge) => challenge.id === selectedChallengeId) ?? activeChallenges[0]
  const selectedChallengeSongs = selectedChallenge
    ? challengeSongRefs.filter((ref) => ref.challengeId === selectedChallenge.id)
    : []

  useEffect(() => {
    if (!selectedSongId && songs.length) {
      setSelectedSongId(songs.find((song) => song.published)?.id ?? songs[0]?.id ?? '')
    }
  }, [selectedSongId, songs])

  useEffect(() => {
    if (!publishedSongs.length) return
    if (!publishedSongs.some((song) => song.id === aId)) setAId(publishedSongs[0]?.id ?? '')
    if (!publishedSongs.some((song) => song.id === bId) || aId === bId) {
      setBId(publishedSongs.find((song) => song.id !== aId)?.id ?? '')
    }
  }, [aId, bId, publishedSongs])

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

  function navigate(nextView: DiscoverView, path: string) {
    window.history.pushState({}, '', path)
    setView(nextView)
    setMessage('')
  }

  function openChallenge(challengeId: string) {
    setSelectedChallengeId(challengeId)
    navigate('challenge', `/challenges/${challengeId}`)
  }

  function submitChallengeSong() {
    if (!selectedSongId) {
      setMessage('请先选择一首要投稿的作品。')
      return
    }

    setChallengeSongRefs((current) => [
      {
        id: `challenge_song_${Date.now()}`,
        challengeId: selectedChallenge.id,
        songId: selectedSongId,
        note: `${creationTitle || '我的挑战作品'} 已加入挑战池，等待大家试听。`,
        rank: current.filter((item) => item.challengeId === selectedChallenge.id).length + 1,
      },
      ...current,
    ])
    setMessage('投稿成功，作品已经加入挑战。')
  }

  async function voteBattle(battleId: string, side: VoteSide) {
    const hasVoted = battleVotes.some((vote) => vote.battleId === battleId && vote.userId === user.id)
    if (hasVoted) {
      setMessage('你已经投过这个擂台了，每场对决只能投一次。')
      return
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
      setBattleVotes((current) => [
        ...current,
        { id: `battle_vote_${Date.now()}`, battleId, userId: user.id, side, createdAt: new Date().toISOString() },
      ])
      setMessage(`投票成功，你支持了 ${side} 方。`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '投票失败，请稍后重试。')
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
    setFortuneSongs((current) => [draft, ...current])
    setMessage(`时运曲已生成：${draft.song.title}。`)
  }

  async function generateFortuneSong(mode: 'vocal' | 'instrumental') {
    setGeneratingFortune(true)
    try {
      const lyric = await getDayLyric(mode)
      const task = await submitFortuneSong({
        title: lyric.title || `${todayFortune.keyword}时运曲`,
        style: lyric.style || (mode === 'instrumental' ? 'Lo-fi / 纯音乐' : '治愈流行 / Lo-fi'),
        lyrics: lyric.lyrics,
        prompt: `${todayFortune.keyword}、${todayFortune.mood.name}、${todayFortune.recharge ?? '治愈'}`,
        isInstrumental: mode === 'instrumental',
      })
      if (!task.taskId) throw new Error('后端没有返回生成任务 ID。')

      for (let attempt = 0; attempt < 30; attempt += 1) {
        const status = await getGenerateTask(task.taskId)
        if (status.status === 'done') {
          if (!status.result?.song) throw new Error('生成完成，但后端没有返回歌曲数据。')
          addFortuneSong({ song: status.result.song, fortuneDate: todayFortune.date })
          return
        }
        if (status.status === 'error') throw new Error(status.error || '时运曲生成失败。')
        await new Promise((resolve) => window.setTimeout(resolve, 2000))
      }
      throw new Error('时运曲仍在生成，请稍后再查看作品列表。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '时运曲生成失败，请稍后重试。')
    } finally {
      setGeneratingFortune(false)
    }
  }

  return (
    <section className="page-stack discover-suite">
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

      {view === 'home' ? (
        <DiscoverHomePage
          battles={battles}
          challenges={activeChallenges}
          challengeSongRefs={challengeSongRefs}
          todayFortune={todayFortune}
          onNavigateBattles={() => navigate('battles', '/battles')}
          onNavigateFortune={() => navigate('fortune', '/fortune')}
          onOpenChallenge={openChallenge}
        />
      ) : null}

      {view === 'challenge' ? (
        selectedChallenge ? <ChallengeDetailPage
          challenges={activeChallenges}
          creationTitle={creationTitle}
          publishedSongs={publishedSongs}
          selectedChallenge={selectedChallenge}
          selectedChallengeSongs={selectedChallengeSongs}
          selectedSongId={selectedSongId}
          onChangeCreationTitle={setCreationTitle}
          onChangeSelectedSongId={setSelectedSongId}
          onOpenChallenge={openChallenge}
          onOpenSong={onOpenSong}
          onPlaySong={onPlaySong}
          onSubmit={submitChallengeSong}
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
          month={currentMonth}
          selectedDate={selectedDate}
          onCheckin={setMessage}
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
