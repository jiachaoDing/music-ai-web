import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { CoverImage } from '../../components/CoverImage'
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
  hasVoted,
  onVote,
  onOpen,
  onPlay,
}: {
  song: Song
  votes: number
  side: VoteSide
  voted: boolean
  hasVoted: boolean
  onVote: () => void
  onOpen: () => void
  onPlay: () => void
}) {
  const coverUrl = resolveAssetUrl(song.coverUrl)
  return (
    <div className={voted ? `battle-song battle-song--${side.toLowerCase()} is-voted` : `battle-song battle-song--${side.toLowerCase()}`}>
      <button className="song-cover battle-cover" style={songStyle(song)} type="button" aria-label={`试听 ${song.title}`} onClick={onPlay}>
        {coverUrl ? <CoverImage className="song-cover__image" src={song.coverUrl} thumbnail alt={`${song.title} 封面`} loading="lazy" decoding="async" /> : null}
        <i aria-hidden="true" />
      </button>
      <div>
        <button className="battle-song__title" type="button" onClick={onOpen}>{song.title}</button>
        <span>{song.author.nickname} · {formatDuration(song.duration)}</span>
      </div>
      <button type="button" disabled={hasVoted} onClick={onVote}>{voted || hasVoted ? '已投票' : `投给 ${side}`}</button>
      <small>{votes} 票</small>
    </div>
  )
}

export function BattlePreviewSong({ song, label, onOpen, onPlay }: { song: Song; label: string; onOpen: () => void; onPlay: () => void }) {
  const coverUrl = resolveAssetUrl(song.coverUrl)
  return (
    <article className={`preview-song preview-song--${label.toLowerCase()}`}>
      <button className="song-cover battle-cover" style={songStyle(song)} type="button" aria-label={`预览 ${song.title}`} onClick={onPlay}>
        {coverUrl ? <CoverImage className="song-cover__image" src={song.coverUrl} thumbnail alt={`${song.title} 封面`} loading="lazy" decoding="async" /> : null}
        <i aria-hidden="true" />
      </button>
      <button className="battle-preview__title" type="button" onClick={onOpen}>{song.title}</button>
      <span>{song.style} · {song.author.nickname}</span>
    </article>
  )
}
