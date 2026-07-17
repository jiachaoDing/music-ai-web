import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import { formatDuration } from '../../utils/format'
import type { VoteSide } from './types'

export function songStyle(song: Song) {
  return { '--cover-color': song.author.color ?? '#ea4c89' } as CSSProperties
}

export function BattleSong({
  song,
  votes,
  side,
  voted,
  onVote,
  onOpen,
  onPlay,
}: {
  song: Song
  votes: number
  side: VoteSide
  voted: boolean
  onVote: () => void
  onOpen: () => void
  onPlay: () => void
}) {
  return (
    <div className={voted ? `battle-song battle-song--${side.toLowerCase()} is-voted` : `battle-song battle-song--${side.toLowerCase()}`}>
      <button className="song-cover battle-cover" style={songStyle(song)} type="button" aria-label={`试听 ${song.title}`} onClick={onPlay}>
        <span className="song-cover__eyebrow">{side} 方</span>
        <button className="battle-song__title" type="button" onClick={onOpen}>{song.title}</button>
        <i aria-hidden="true" />
      </button>
      <div>
        <strong>{song.title}</strong>
        <span>{song.author.nickname} · {formatDuration(song.duration)}</span>
      </div>
      <button type="button" onClick={onVote}>{voted ? '已投票' : `投给 ${side}`}</button>
      <small>{votes} 票</small>
    </div>
  )
}

export function BattlePreviewSong({ song, label, onOpen, onPlay }: { song: Song; label: string; onOpen: () => void; onPlay: () => void }) {
  return (
    <article className={`preview-song preview-song--${label.toLowerCase()}`}>
      <button className="song-cover battle-cover" style={songStyle(song)} type="button" aria-label={`预览 ${song.title}`} onClick={onPlay}>
        <span className="song-cover__eyebrow">{label} 方</span>
        <strong>{song.title}</strong>
        <i aria-hidden="true" />
      </button>
      <button className="battle-preview__title" type="button" onClick={onOpen}>{song.title}</button>
      <span>{song.style} · {song.author.nickname}</span>
    </article>
  )
}
