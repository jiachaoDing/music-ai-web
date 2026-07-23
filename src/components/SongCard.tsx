import type { CSSProperties, MouseEvent } from 'react'
import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'
import { CoverImage } from './CoverImage'
import { formatCount, formatDuration } from '../utils/format'

type SongCardProps = {
  song: Song
  onOpen?: (songId: string) => void
  onPlay?: (songId: string) => void
  coverAspect?: 'default' | 'portrait'
}

export function SongCard({
  song,
  onOpen,
  onPlay,
  coverAspect = 'default',
}: SongCardProps) {
  const coverUrl = resolveAssetUrl(song.coverUrl)
  const coverStyle = {
    '--cover-color': song.author.color,
  } as CSSProperties
  const handleOpen = () => onOpen?.(song.id)
  const handlePlay = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    ;(onPlay ?? onOpen)?.(song.id)
  }

  return (
    <article className="song-card" onClick={handleOpen}>
      <div className="song-card__cover-wrap">
        <div
          aria-label={`打开作品 ${song.title}`}
          className={`song-cover${coverAspect === 'portrait' ? ' song-cover--portrait' : ''}`}
          style={coverStyle}
        >
          {coverUrl ? <CoverImage className="song-cover__image" src={song.coverUrl} thumbnail alt={`${song.title} 封面`} loading="lazy" decoding="async" /> : null}
          <span className="song-cover__eyebrow">{song.mode}</span>
          <span className="ai-generated-badge">AI生成</span>
          <button
            aria-label={`播放 ${song.title}`}
            className="song-cover__play"
            type="button"
            onClick={handlePlay}
          >
            <i aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="song-card__body">
        <div className="song-card__title-row">
          <h3>{song.title}</h3>
          <span>{formatDuration(song.duration)}</span>
        </div>
        {song.description ? <p>{song.description}</p> : null}
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
