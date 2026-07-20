import type { CSSProperties } from 'react'
import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'
import { formatCount, formatDuration } from '../utils/format'

type SongCardProps = {
  song: Song
  onOpen?: (songId: string) => void
  coverAspect?: 'default' | 'portrait'
}

export function SongCard({
  song,
  onOpen,
  coverAspect = 'default',
}: SongCardProps) {
  const coverUrl = resolveAssetUrl(song.coverUrl)
  const coverStyle = {
    '--cover-color': song.author.color,
  } as CSSProperties

  return (
    <article className="song-card">
      <div className="song-card__cover-wrap">
        <button
          aria-label={`打开作品 ${song.title}`}
          className={`song-cover${coverAspect === 'portrait' ? ' song-cover--portrait' : ''}`}
          style={coverStyle}
          type="button"
          onClick={() => onOpen?.(song.id)}
        >
          {coverUrl ? <img className="song-cover__image" src={coverUrl} alt={`${song.title} 封面`} /> : null}
          <span className="song-cover__eyebrow">{song.mode}</span>
          <i aria-hidden="true" />
        </button>
      </div>
      <div className="song-card__body">
        <div className="song-card__title-row">
          <h3>{song.title}</h3>
          <span>{formatDuration(song.duration)}</span>
        </div>
        <p>{song.description ?? '暂无简介'}</p>
        <div className="song-card__meta" style={coverStyle}>
          <span className="author-dot" />
          <strong>{song.author.nickname}</strong>
          <span>{formatCount(song.playCount)} 播放</span>
          <span>{formatCount(song.likeCount)} 喜欢</span>
        </div>
      </div>
    </article>
  )
}
