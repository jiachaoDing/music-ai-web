import type { CSSProperties } from 'react'
import type { Song } from '../types/song'
import { formatCount, formatDuration } from '../utils/format'

type SongCardProps = {
  song: Song
  onOpen?: (songId: string) => void
}

export function SongCard({ song, onOpen }: SongCardProps) {
  const coverStyle = {
    '--cover-color': song.author.color,
  } as CSSProperties

  return (
    <article className="song-card">
      <button
        aria-label={`打开作品 ${song.title}`}
        className="song-cover"
        style={coverStyle}
        type="button"
        onClick={() => onOpen?.(song.id)}
      >
        <span className="song-cover__eyebrow">{song.mode}</span>
        <strong>{song.title}</strong>
        <i aria-hidden="true" />
      </button>
      <div className="song-card__body">
        <div className="song-card__title-row">
          <h3>{song.title}</h3>
          <span>{formatDuration(song.duration)}</span>
        </div>
        <p>{song.description ?? '暂无简介'}</p>
        <div className="chip-row">
          <span>{song.style}</span>
          <span>{song.mode}</span>
          <span>{song.status}</span>
        </div>
        <div className="song-card__meta">
          <span>{song.author.nickname}</span>
          <span>{formatCount(song.playCount)} 播放</span>
          <span>{formatCount(song.likeCount)} 喜欢</span>
        </div>
      </div>
    </article>
  )
}
