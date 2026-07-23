import { useState } from 'react'
import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'
import { formatDuration } from '../utils/format'
import { CoverImage } from './CoverImage'

type RepeatMode = 'off' | 'all' | 'one'

type MiniPlayerProps = {
  song?: Song
  isPlaying?: boolean
  isBuffering?: boolean
  repeatMode?: RepeatMode
  shuffleEnabled?: boolean
  progress?: number
  queueSongs?: Song[]
  currentSongId?: string
  onOpenPlayer?: () => void
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onCycleRepeat?: () => void
  onPlayQueueSong?: (songId: string) => void
  onRemoveQueueSong?: (songId: string) => void
}

const repeatTitle: Record<RepeatMode, string> = {
  off: '顺序播放',
  all: '列表循环',
  one: '单曲循环',
}

type IconName = 'shuffle' | 'repeat' | 'repeat-one' | 'prev' | 'next' | 'play' | 'pause' | 'queue'

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (name === 'shuffle') {
    return (
      <svg {...common}>
        <path d="M4 7h2.7c1.3 0 2.4.6 3.1 1.7l4.4 6.6c.7 1.1 1.8 1.7 3.1 1.7H20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 14l3 3-3 3M4 17h2.7c1.3 0 2.4-.6 3.1-1.7l.4-.6M14.1 8.7c.8-1.1 1.8-1.7 3.2-1.7H20M17 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'repeat' || name === 'repeat-one') {
    return (
      <svg {...common}>
        <path d="M17 3.8 20.2 7 17 10.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9V8.4C4 7.5 4.4 6.6 5 6s1.5-1 2.4-1h12.4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 20.2 3.8 17 7 13.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 15v.6c0 .9-.4 1.8-1 2.4s-1.5 1-2.4 1H4.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        {name === 'repeat-one' ? (
          <text x="12" y="14.6" textAnchor="middle" fontSize="7.2" fontWeight="900" fill="currentColor">
            1
          </text>
        ) : null}
      </svg>
    )
  }

  if (name === 'prev') {
    return (
      <svg {...common}>
        <path d="M6 5h2.2v14H6zM18 6.3v11.4L9.2 12z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'next') {
    return (
      <svg {...common}>
        <path d="M15.8 5H18v14h-2.2zM6 6.3v11.4l8.8-5.7z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'pause') {
    return (
      <svg {...common}>
        <path d="M7.5 5h3.2v14H7.5zM13.3 5h3.2v14h-3.2z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'queue') {
    return (
      <svg {...common}>
        <path d="M6 7h12M6 12h12M6 17h8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M3.5 7h.1M3.5 12h.1M3.5 17h.1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
    </svg>
  )
}

export function MiniPlayer({
  song,
  isPlaying = false,
  isBuffering = false,
  repeatMode = 'off',
  shuffleEnabled = false,
  progress = 0,
  queueSongs = [],
  currentSongId,
  onOpenPlayer,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onCycleRepeat,
  onPlayQueueSong,
  onRemoveQueueSong,
}: MiniPlayerProps) {
  const [queueOpen, setQueueOpen] = useState(false)
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const modeIcon = shuffleEnabled ? 'shuffle' : repeatMode === 'one' ? 'repeat-one' : 'repeat'
  const modeTitle = shuffleEnabled ? '随机播放' : repeatTitle[repeatMode === 'off' ? 'all' : repeatMode]
  const queueList = queueSongs.length ? queueSongs : song ? [song] : []
  const activeSongId = currentSongId ?? song?.id

  return (
    <div className="mini-player">
      <button className="mini-player__main" type="button" onClick={onOpenPlayer}>
        <span className="mini-player__art">
          {coverUrl ? (
            <CoverImage className="mini-player__art-image" src={song?.coverUrl} thumbnail alt={`${song?.title ?? '当前作品'} 封面`} />
          ) : null}
        </span>
        <div className="mini-player__info">
          <strong>{song?.title ?? '暂无播放内容'}</strong>
          <span>{song ? song.author.nickname : '选择一首作品开始播放'}</span>
        </div>
      </button>

      <div className="mini-player__controls" aria-label="播放控制">
        <button type="button" className="mini-player__icon mini-player__mode is-active" onClick={onCycleRepeat} disabled={!song} title={modeTitle} aria-label={modeTitle}>
          <Icon name={modeIcon} size={23} />
        </button>
        <button type="button" className="mini-player__icon" onClick={onPlayPrev} disabled={!song} aria-label="上一首">
          <Icon name="prev" size={21} />
        </button>
        <button type="button" className={`mini-player__play${isBuffering ? ' is-buffering' : ''}`} onClick={onTogglePlay} disabled={!song} aria-label={isBuffering ? '正在缓冲' : isPlaying ? '暂停' : '播放'}>
          {isBuffering ? <span className="player-buffer-spinner" aria-hidden="true" /> : <Icon name={isPlaying ? 'pause' : 'play'} size={22} />}
        </button>
        <button type="button" className="mini-player__icon" onClick={onPlayNext} disabled={!song} aria-label="下一首">
          <Icon name="next" size={21} />
        </button>
        <button
          type="button"
          className={`mini-player__icon mini-player__queue-toggle${queueOpen ? ' is-active' : ''}`}
          onClick={() => setQueueOpen((open) => !open)}
          disabled={!song}
          title="播放列表"
          aria-label="播放列表"
          aria-expanded={queueOpen}
        >
          <Icon name="queue" size={22} />
        </button>
      </div>

      {queueOpen ? (
        <section className="mini-player__queue" aria-label="待播清单">
          <div className="mini-player__queue-head">
            <strong>待播清单</strong>
            <span>{queueList.length} 首</span>
          </div>
          <div className="mini-player__queue-list">
            {queueList.map((queuedSong) => {
              const queuedCover = resolveAssetUrl(queuedSong.coverUrl)
              const active = queuedSong.id === activeSongId

              return (
                <div
                  key={queuedSong.id}
                  className={`mini-player__queue-item${active ? ' is-current' : ''}`}
                >
                  <button type="button" className="mini-player__queue-play" onClick={() => onPlayQueueSong?.(queuedSong.id)}>
                    <span className="mini-player__queue-cover">
                      {queuedCover ? <CoverImage src={queuedSong.coverUrl} thumbnail alt="" loading="lazy" decoding="async" /> : <i>{queuedSong.title.slice(0, 1)}</i>}
                    </span>
                    <span className="mini-player__queue-meta">
                      <b>{queuedSong.title}</b>
                      <small>{queuedSong.author.nickname}</small>
                    </span>
                    <em>{formatDuration(queuedSong.duration)}</em>
                  </button>
                  <button
                    type="button"
                    className="mini-player__queue-remove"
                    onClick={() => onRemoveQueueSong?.(queuedSong.id)}
                    aria-label={`从待播清单移除 ${queuedSong.title}`}
                    title="移除"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      <span className="mini-player__progress" aria-hidden="true">
        <i style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </span>
    </div>
  )
}
