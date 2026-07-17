import { useMemo, useState } from 'react'
import type { Song } from '../../types/song'
import { BattleSong, songStyle } from './DiscoverShared'
import type { BattleRecord, BattleVoteRecord, VoteSide } from './types'

type BattlesPageProps = {
  battles: BattleRecord[]
  battleVotes: BattleVoteRecord[]
  currentUserId: string
  songs: Song[]
  onVote: (battleId: string, side: VoteSide) => void
  onCreate: () => void
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
}

export function BattlesPage({ battles, battleVotes, currentUserId, songs, onVote, onCreate, onOpenSong, onPlaySong }: BattlesPageProps) {
  const [selectedBattleId, setSelectedBattleId] = useState(battles[0]?.id ?? '')
  const selectedBattle = battles.find((battle) => battle.id === selectedBattleId) ?? battles[0]

  const insights = useMemo(() => {
    const sorted = [...battles].sort((a, b) => b.aVotes + b.bVotes - (a.aVotes + a.bVotes))
    const closest = [...battles].sort((a, b) => Math.abs(a.aVotes - a.bVotes) - Math.abs(b.aVotes - b.bVotes))[0]
    const latest = [...battles].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    return [
      { label: '高票擂台', value: sorted[0] ? `${sorted[0].aVotes + sorted[0].bVotes} 票` : '暂无', battleId: sorted[0]?.id },
      { label: '胶着对决', value: closest ? `差 ${Math.abs(closest.aVotes - closest.bVotes)} 票` : '暂无', battleId: closest?.id },
      { label: '最新开放', value: latest ? latest.topic : '暂无新擂台', battleId: latest?.id },
    ]
  }, [battles])

  function songById(songId: string) {
    return songs.find((song) => song.id === songId) ?? songs[0]
  }

  if (!selectedBattle) {
    return (
      <section className="content-panel empty-panel">
        <h2>暂时没有擂台</h2>
        <button type="button" onClick={onCreate}>创建第一场对决</button>
      </section>
    )
  }

  const songA = songById(selectedBattle.aId)
  const songB = songById(selectedBattle.bId)
  const total = Math.max(1, selectedBattle.aVotes + selectedBattle.bVotes)
  const percentA = Math.round((selectedBattle.aVotes / total) * 100)
  const percentB = 100 - percentA
  const votedSide =
    selectedBattle.votedSide ??
    battleVotes.find((vote) => vote.battleId === selectedBattle.id && vote.userId === currentUserId)?.side

  return (
    <section className="playground-shell battle-playground">
      <aside className="playground-rail battle-rail-left rail-scroll" aria-label="擂台列表">
        <div className="rail-title">PK</div>
        {battles.map((battle) => {
          const coverSong = songById(battle.aId)
          return (
            <button
              className={battle.id === selectedBattle.id ? 'rail-card is-active' : 'rail-card'}
              key={battle.id}
              type="button"
              onClick={() => setSelectedBattleId(battle.id)}
            >
              <span className="rail-cover" style={songStyle(coverSong)} />
              <strong>{battle.topic}</strong>
              <small>{battle.aVotes + battle.bVotes} 票</small>
            </button>
          )
        })}
      </aside>

      <main className="playground-stage battle-stage-card">
        <div className="stage-heading">
          <div>
            <span>Vote Arena</span>
            <h2>{selectedBattle.topic}</h2>
          </div>
          <button type="button" onClick={onCreate}>创建擂台</button>
        </div>

        <div className="battle-duel-frame">
          <BattleSong song={songA} votes={selectedBattle.aVotes} side="A" voted={votedSide === 'A'} onVote={() => onVote(selectedBattle.id, 'A')} onOpen={() => onOpenSong(songA.id)} onPlay={() => onPlaySong(songA.id)} />
          <div className="battle-divider">
            <strong>VS</strong>
          </div>
          <BattleSong song={songB} votes={selectedBattle.bVotes} side="B" voted={votedSide === 'B'} onVote={() => onVote(selectedBattle.id, 'B')} onOpen={() => onOpenSong(songB.id)} onPlay={() => onPlaySong(songB.id)} />
          <div className="battle-progress" aria-label={`A 方 ${percentA}%，B 方 ${percentB}%`}>
            <span style={{ width: `${percentA}%` }} />
            <strong>{percentA}%</strong>
            <em>{percentB}%</em>
          </div>
        </div>

        <label className="battle-lyric-box">
          <span>投票理由</span>
          <input placeholder="哪一首更适合这个主题？写一句你的理由" />
        </label>
      </main>

      <aside className="playground-rail insight-rail" aria-label="擂台看点">
        <div className="rail-title">看点</div>
        {insights.map((item) => (
          <button
            className="insight-card"
            key={item.label}
            type="button"
            onClick={() => item.battleId && setSelectedBattleId(item.battleId)}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </button>
        ))}
        <button className="insight-card insight-card--create" type="button" onClick={onCreate}>
          <span>新擂台</span>
          <strong>选择两首歌发起对决</strong>
        </button>
      </aside>
    </section>
  )
}
