import { useEffect, useMemo, useState } from 'react'
import type { Song } from '../../types/song'
import type { UserRole } from '../../types/user'
import { BattleSong } from './DiscoverShared'
import type { BattleRecord, BattleVoteRecord, VoteSide } from './types'

type BattlesPageProps = {
  battles: BattleRecord[]
  battleVotes: BattleVoteRecord[]
  currentUserId: string
  currentUserRole: UserRole
  songs: Song[]
  onVote: (battleId: string, side: VoteSide) => void
  onCreate: () => void
  onDelete: (battleId: string) => Promise<boolean>
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
}

export function BattlesPage({ battles, battleVotes, currentUserId, currentUserRole, songs, onVote, onCreate, onDelete, onOpenSong, onPlaySong }: BattlesPageProps) {
  const [selectedBattleId, setSelectedBattleId] = useState(battles[0]?.id ?? '')
  const [pendingDelete, setPendingDelete] = useState<BattleRecord | null>(null)
  const [deleting, setDeleting] = useState(false)
  const selectedBattle = battles.find((battle) => battle.id === selectedBattleId) ?? battles[0]

  useEffect(() => {
    if (!battles.length) {
      setSelectedBattleId('')
      return
    }
    if (!battles.some((battle) => battle.id === selectedBattleId)) {
      setSelectedBattleId(battles[0].id)
    }
  }, [battles, selectedBattleId])

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
    return songs.find((song) => song.id === songId)
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
  const canDelete = currentUserRole === 'admin' || selectedBattle.isOwner === true || selectedBattle.creatorId === currentUserId || selectedBattle.createdBy === currentUserId
  const total = Math.max(1, selectedBattle.aVotes + selectedBattle.bVotes)
  const percentA = Math.round((selectedBattle.aVotes / total) * 100)
  const percentB = 100 - percentA
  const savedVote = battleVotes.find((vote) => vote.battleId === selectedBattle.id && vote.userId === currentUserId)
  const votedSide = selectedBattle.votedSide ?? savedVote?.side
  const hasVoted = Boolean(selectedBattle.votedSide || savedVote)

  async function confirmDelete() {
    if (!pendingDelete || deleting) return
    setDeleting(true)
    const deleted = await onDelete(pendingDelete.id)
    setDeleting(false)
    if (deleted) setPendingDelete(null)
  }

  return (
    <section className="playground-shell battle-playground">
      <aside className="playground-rail battle-rail-left rail-scroll" aria-label="擂台列表">
        <div className="rail-title">PK</div>
        {battles.map((battle) => {
          return (
            <button
              className={battle.id === selectedBattle.id ? 'rail-card is-active' : 'rail-card'}
              key={battle.id}
              type="button"
              onClick={() => setSelectedBattleId(battle.id)}
            >
              <span className="rail-battle-mark" aria-hidden="true">PK</span>
              <span className="rail-card-copy">
                <strong>{battle.topic}</strong>
                <small>{battle.aVotes + battle.bVotes} 票</small>
              </span>
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
          <div className="stage-heading__actions">
            {canDelete ? (
              <button className="battle-delete-button" type="button" onClick={() => setPendingDelete(selectedBattle)}>
                删除擂台
              </button>
            ) : null}
            <button type="button" onClick={onCreate}>创建擂台</button>
          </div>
        </div>

        {songA && songB ? (
          <div className="battle-duel-frame">
            <BattleSong song={songA} votes={selectedBattle.aVotes} side="A" voted={votedSide === 'A'} hasVoted={hasVoted} onVote={() => onVote(selectedBattle.id, 'A')} onOpen={() => onOpenSong(songA.id)} onPlay={() => onPlaySong(songA.id)} />
            <div className="battle-divider">
              <strong>VS</strong>
            </div>
            <BattleSong song={songB} votes={selectedBattle.bVotes} side="B" voted={votedSide === 'B'} hasVoted={hasVoted} onVote={() => onVote(selectedBattle.id, 'B')} onOpen={() => onOpenSong(songB.id)} onPlay={() => onPlaySong(songB.id)} />
            <div className="battle-progress" aria-label={`A 方 ${percentA}%，B 方 ${percentB}%`}>
              <span style={{ width: `${percentA}%` }} />
              <strong>{percentA}%</strong>
              <em>{percentB}%</em>
            </div>
          </div>
        ) : (
          <section className="empty-panel battle-missing-state">
            <h2>这场擂台的歌曲暂时无法加载</h2>
            <p>歌曲可能已被删除。创建者或管理员仍然可以删除这场无效擂台。</p>
          </section>
        )}

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

      {pendingDelete ? (
        <div className="discover-modal-backdrop" role="presentation" onClick={() => !deleting && setPendingDelete(null)}>
          <section className="discover-modal battle-delete-confirm" role="alertdialog" aria-modal="true" aria-labelledby="battle-delete-title" onClick={(event) => event.stopPropagation()}>
            <span>Delete Battle</span>
            <h2 id="battle-delete-title">确认删除这场擂台？</h2>
            <p>“{pendingDelete.topic}”的擂台和投票记录将被永久删除，但两首歌曲会继续保留。</p>
            <div className="battle-delete-confirm__actions">
              <button type="button" disabled={deleting} onClick={() => setPendingDelete(null)}>取消</button>
              <button className="battle-delete-button" type="button" disabled={deleting} onClick={() => void confirmDelete()}>
                {deleting ? '正在删除…' : '确认删除'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  )
}
