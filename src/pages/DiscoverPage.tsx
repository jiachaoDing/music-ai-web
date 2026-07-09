import { useMemo, useState } from 'react'
import { mockSongs } from '../mock/songs'
import { BattleNewPage } from './discover/BattleNewPage'
import { BattlesPage } from './discover/BattlesPage'
import { ChallengeDetailPage } from './discover/ChallengeDetailPage'
import { currentUserId, initialBattles, initialChallengeSongRefs, initialChallenges, initialFortunes } from './discover/data'
import { DiscoverHomePage } from './discover/DiscoverHomePage'
import { discoverStyles } from './discover/discoverStyles'
import { FortunePage } from './discover/FortunePage'
import type { BattleRecord, BattleVoteRecord, DiscoverView, FortuneSongDraft, VoteSide } from './discover/types'

function getInitialView(): DiscoverView {
  const path = window.location.pathname
  if (path.startsWith('/challenges/')) return 'challenge'
  if (path === '/battles/new') return 'battleNew'
  if (path === '/battles') return 'battles'
  if (path === '/fortune') return 'fortune'
  return 'home'
}

export function DiscoverPage() {
  const [view, setView] = useState<DiscoverView>(getInitialView)
  const [selectedChallengeId, setSelectedChallengeId] = useState(() => {
    const challengeId = window.location.pathname.split('/challenges/')[1]
    return initialChallenges.some((challenge) => challenge.id === challengeId) ? challengeId : initialChallenges[0].id
  })
  const [challengeSongRefs, setChallengeSongRefs] = useState(initialChallengeSongRefs)
  const [battles, setBattles] = useState<BattleRecord[]>(initialBattles)
  const [battleVotes, setBattleVotes] = useState<BattleVoteRecord[]>([])
  const [fortuneSongs, setFortuneSongs] = useState<FortuneSongDraft[]>([])
  const [selectedSongId, setSelectedSongId] = useState(mockSongs.find((song) => song.published)?.id ?? '')
  const [creationTitle, setCreationTitle] = useState('夏夜回信')
  const [battleTopic, setBattleTopic] = useState('哪首歌更适合今晚循环？')
  const [aId, setAId] = useState('song_001')
  const [bId, setBId] = useState('song_005')
  const [selectedDate, setSelectedDate] = useState('2026-07-07')
  const [message, setMessage] = useState('')

  const publishedSongs = useMemo(
    () => [...fortuneSongs.map((draft) => draft.song), ...mockSongs].filter((song) => song.published || song.status === 'draft'),
    [fortuneSongs],
  )
  const activeChallenges = initialChallenges.filter((challenge) => challenge.active && challenge.status === 'active')
  const selectedChallenge = initialChallenges.find((challenge) => challenge.id === selectedChallengeId) ?? initialChallenges[0]
  const selectedChallengeSongs = challengeSongRefs.filter((ref) => ref.challengeId === selectedChallenge.id)
  const todayFortune = initialFortunes.find((fortune) => fortune.date === '2026-07-07') ?? initialFortunes[6]

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

  function voteBattle(battleId: string, side: VoteSide) {
    const hasVoted = battleVotes.some((vote) => vote.battleId === battleId && vote.userId === currentUserId)
    if (hasVoted) {
      setMessage('你已经投过这个擂台了，每场对决只能投一次。')
      return
    }

    setBattles((current) =>
      current.map((battle) =>
        battle.id === battleId
          ? {
              ...battle,
              aVotes: battle.aVotes + (side === 'A' ? 1 : 0),
              bVotes: battle.bVotes + (side === 'B' ? 1 : 0),
              updatedAt: new Date().toISOString(),
            }
          : battle,
      ),
    )
    setBattleVotes((current) => [
      ...current,
      {
        id: `battle_vote_${Date.now()}`,
        battleId,
        userId: currentUserId,
        side,
        createdAt: new Date().toISOString(),
      },
    ])
    setMessage(`投票成功，你支持了 ${side} 方。`)
  }

  function createBattle() {
    if (!battleTopic.trim()) {
      setMessage('请先写一个擂台主题。')
      return
    }

    if (!aId || !bId || aId === bId) {
      setMessage('请选择两首不同的歌曲。')
      return
    }

    setBattles((current) => [
      {
        id: `battle_${Date.now()}`,
        topic: battleTopic.trim(),
        aId,
        bId,
        aVotes: 0,
        bVotes: 0,
        createdBy: currentUserId,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ])
    navigate('battles', '/battles')
    setMessage('擂台创建成功，大家可以开始投票了。')
  }

  function addFortuneSong(draft: FortuneSongDraft) {
    setFortuneSongs((current) => [draft, ...current])
    setMessage(`时运曲已生成：${draft.song.title}。`)
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
          ['challenge', `/challenges/${selectedChallenge.id}`, '话题挑战'],
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
        <ChallengeDetailPage
          challenges={activeChallenges}
          creationTitle={creationTitle}
          publishedSongs={publishedSongs}
          selectedChallenge={selectedChallenge}
          selectedChallengeSongs={selectedChallengeSongs}
          selectedSongId={selectedSongId}
          onChangeCreationTitle={setCreationTitle}
          onChangeSelectedSongId={setSelectedSongId}
          onOpenChallenge={openChallenge}
          onSubmit={submitChallengeSong}
        />
      ) : null}

      {view === 'battles' ? (
        <BattlesPage
          battleVotes={battleVotes}
          battles={battles}
          currentUserId={currentUserId}
          songs={publishedSongs}
          onCreate={() => navigate('battleNew', '/battles/new')}
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
        />
      ) : null}

      {view === 'fortune' ? (
        <FortunePage
          fortunes={initialFortunes}
          generatedSongs={fortuneSongs}
          selectedDate={selectedDate}
          onCheckin={setMessage}
          onGenerateSong={addFortuneSong}
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
    </section>
  )
}
