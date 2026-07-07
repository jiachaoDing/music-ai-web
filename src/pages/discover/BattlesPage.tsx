import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
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
}

const genreColors = ['#ff8fab', '#7dd3fc', '#86efac', '#fde68a', '#c4b5fd', '#fca5a5']

export function BattlesPage({ battles, battleVotes, currentUserId, songs, onVote, onCreate }: BattlesPageProps) {
  const [selectedBattleId, setSelectedBattleId] = useState(battles[0]?.id ?? '')
  const genres = useMemo(() => Array.from(new Set(songs.flatMap((song) => song.tags.slice(0, 1)))).slice(0, 6), [songs])
  const selectedBattle = battles.find((battle) => battle.id === selectedBattleId) ?? battles[0]

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
  const votedSide = battleVotes.find((vote) => vote.battleId === selectedBattle.id && vote.userId === currentUserId)?.side

  return (
    <section className="playground-shell battle-playground">
      <aside className="playground-rail battle-rail-left" aria-label="擂台列表">
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
          <BattleSong song={songA} votes={selectedBattle.aVotes} side="A" voted={votedSide === 'A'} onVote={() => onVote(selectedBattle.id, 'A')} />
          <div className="battle-divider">
            <strong>VS</strong>
          </div>
          <BattleSong song={songB} votes={selectedBattle.bVotes} side="B" voted={votedSide === 'B'} onVote={() => onVote(selectedBattle.id, 'B')} />
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

      <aside className="playground-rail genre-rail" aria-label="热门风格">
        <div className="rail-title">Genre</div>
        {genres.map((genre, index) => (
          <button className="rail-card genre-card" key={genre} type="button">
            <span
              className="rail-cover genre-cover"
              style={{ '--cover-color': genreColors[index % genreColors.length] } as CSSProperties}
            />
            <strong>{genre}</strong>
          </button>
        ))}
      </aside>
    </section>
  )
}
