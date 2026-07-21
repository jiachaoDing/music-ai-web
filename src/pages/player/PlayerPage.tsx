import { useMemo, useState } from 'react'
import type { RefObject } from 'react'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatDuration } from '../../utils/format'
import { playerStyles } from './playerStyles'

type PlayerPageProps = {
  song?: Song
  isPlaying?: boolean
  repeatMode?: 'off' | 'all' | 'one'
  shuffleEnabled?: boolean
  currentTime?: number
  duration?: number
  queueSongs?: Song[]
  currentSongId?: string
  visualizerCanvasRef?: RefObject<HTMLCanvasElement | null>
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onCycleRepeat?: () => void
  onPlayQueueSong?: (songId: string) => void
  onRemoveQueueSong?: (songId: string) => void
  onSeek?: (progress: number) => void
  onClose?: () => void
  onBackHome?: () => void
}

type LyricLine = {
  text: string
  index: number
}

function PlayerIcon({
  name,
  size = 22,
}: {
  name: 'shuffle' | 'repeat' | 'repeat-one' | 'prev' | 'next' | 'play' | 'pause' | 'queue'
  size?: number
}) {
  if (name === 'pause') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M7.5 5h3.2v14H7.5zM13.3 5h3.2v14h-3.2z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'prev') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M6 5h2.2v14H6zM18 6.3v11.4L9.2 12z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'next') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M15.8 5H18v14h-2.2zM6 6.3v11.4l8.8-5.7z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'shuffle') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M4 7h2.7c1.3 0 2.4.6 3.1 1.7l4.4 6.6c.7 1.1 1.8 1.7 3.1 1.7H20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 14l3 3-3 3M4 17h2.7c1.3 0 2.4-.6 3.1-1.7l.4-.6M14.1 8.7c.8-1.1 1.8-1.7 3.2-1.7H20M17 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {name === 'repeat' ? (
        <>
          <path d="M17 3.8 20.2 7 17 10.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 9V8.4C4 7.5 4.4 6.6 5 6s1.5-1 2.4-1h12.4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.2 3.8 17 7 13.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 15v.6c0 .9-.4 1.8-1 2.4s-1.5 1-2.4 1H4.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M17 3.8 20.2 7 17 10.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 9V8.4C4 7.5 4.4 6.6 5 6s1.5-1 2.4-1h12.4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.2 3.8 17 7 13.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 15v.6c0 .9-.4 1.8-1 2.4s-1.5 1-2.4 1H4.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="12" y="14.6" textAnchor="middle" fontSize="7.2" fontWeight="900" fill="currentColor">
            1
          </text>
        </>
      )}
    </svg>
  )
}

function QueueIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M6 7h12M6 12h12M6 17h8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M3.5 7h.1M3.5 12h.1M3.5 17h.1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function parseLyrics(lyrics?: string): LyricLine[] {
  if (!lyrics?.trim()) return []

  return lyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('<'))
    .map((line) => line.replace(/^(?:\[[^\]]+\]|【[^】]+】)\s*/, '').trim())
    .filter(Boolean)
    .map((text, index) => ({ text, index }))
}

export function PlayerPage({
  song,
  isPlaying = false,
  repeatMode = 'off',
  shuffleEnabled = false,
  currentTime = 0,
  duration = 0,
  queueSongs = [],
  currentSongId,
  visualizerCanvasRef,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onCycleRepeat,
  onPlayQueueSong,
  onRemoveQueueSong,
  onSeek,
  onClose,
  onBackHome,
}: PlayerPageProps) {
  const [queueOpen, setQueueOpen] = useState(false)
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const playModeTitle = shuffleEnabled ? '随机播放' : repeatMode === 'one' ? '单曲循环' : '列表循环'
  const playModeIcon = shuffleEnabled ? 'shuffle' : repeatMode === 'one' ? 'repeat-one' : 'repeat'

  const lyricLines = useMemo(() => parseLyrics(song?.lyrics), [song?.lyrics])
  const queueList = queueSongs.length ? queueSongs : song ? [song] : []
  const activeSongId = currentSongId ?? song?.id

  return (
    <section className={`immersive-player${isPlaying ? ' is-playing' : ''}`}>
      <style>{playerStyles}</style>

      <canvas
        ref={visualizerCanvasRef}
        className="immersive-player__visualizer"
        aria-hidden="true"
      />

      <div className="immersive-player__backdrop" />

      <header className="immersive-player__topbar">
        <button type="button" className="immersive-player__ghost" onClick={onClose}>
          返回详情
        </button>
        <button type="button" className="immersive-player__brand" onClick={onBackHome}>
          Echo AI
        </button>
      </header>

      <div className="immersive-player__content">
        <div className="immersive-player__cover">
          {coverUrl ? (
            <img src={coverUrl} alt={`${song?.title ?? '当前作品'}封面`} />
          ) : (
            <div className="immersive-player__cover-fallback">{song?.title?.slice(0, 1) ?? 'E'}</div>
          )}
        </div>

        <div className="immersive-player__title">
          <h1>{song?.title ?? '暂无播放内容'}</h1>
          <p>{song ? `@${song.author.nickname}` : '从首页或详情页选择一首歌开始播放'}</p>
        </div>

        <div className="immersive-player__lyrics" aria-label="歌词列表">
          {lyricLines.length ? (
            lyricLines.map((line) => (
              <p key={`${line.text}-${line.index}`}>{line.text}</p>
            ))
          ) : (
            <p className="immersive-player__empty">当前作品暂时没有歌词内容。</p>
          )}
        </div>

        <div className="immersive-player__dock">
          <div className="immersive-player__timeline">
            <div className="immersive-player__time">
              <span>{formatDuration(Math.floor(currentTime))}</span>
              <span>{formatDuration(Math.floor(duration || song?.duration || 0))}</span>
            </div>
            <button
              type="button"
              className="immersive-player__progress"
              onClick={(event) => {
                if (!duration || !onSeek) return
                const rect = event.currentTarget.getBoundingClientRect()
                const nextProgress = ((event.clientX - rect.left) / rect.width) * 100
                onSeek(nextProgress)
              }}
              aria-label="调整播放进度"
            >
              <span style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
            </button>
          </div>

          <div className="immersive-player__controls">
            <button
              type="button"
              className="immersive-player__control immersive-player__control--repeat is-active"
              onClick={onCycleRepeat}
              disabled={!song}
              aria-label={playModeTitle}
              title={playModeTitle}
            >
              <PlayerIcon name={playModeIcon} size={22} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--small"
              onClick={onPlayPrev}
              disabled={!song}
              aria-label="上一首"
            >
              <PlayerIcon name="prev" size={22} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--play"
              onClick={onTogglePlay}
              disabled={!song}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              <PlayerIcon name={isPlaying ? 'pause' : 'play'} size={24} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--small"
              onClick={onPlayNext}
              disabled={!song}
              aria-label="下一首"
            >
              <PlayerIcon name="next" size={22} />
            </button>
            <button
              type="button"
              className={`immersive-player__control immersive-player__control--queue${queueOpen ? ' is-active' : ''}`}
              onClick={() => setQueueOpen((open) => !open)}
              disabled={!song}
              aria-label="播放列表"
              title="播放列表"
              aria-expanded={queueOpen}
            >
              <QueueIcon size={21} />
            </button>
          </div>

          <div className="immersive-player__meta">
            <span>{song?.style ?? '未设置风格'}</span>
            <span>{song ? `${song.playCount} 播放` : '等待播放'}</span>
            <span>{song ? `${song.likeCount} 喜欢` : '准备开始'}</span>
          </div>
        </div>
      </div>

      {queueOpen ? (
        <aside className="immersive-player__queue" aria-label="待播清单">
          <div className="immersive-player__queue-head">
            <div>
              <span>Queue</span>
              <h2>待播清单</h2>
            </div>
            <strong>{queueList.length} 首</strong>
          </div>

          <div className="immersive-player__queue-list">
            {queueList.map((queuedSong) => {
              const queuedCover = resolveAssetUrl(queuedSong.coverUrl)
              const active = queuedSong.id === activeSongId

              return (
                <div key={queuedSong.id} className={`immersive-player__queue-item${active ? ' is-current' : ''}`}>
                  <button type="button" className="immersive-player__queue-play" onClick={() => onPlayQueueSong?.(queuedSong.id)}>
                    <span className="immersive-player__queue-cover">
                      {queuedCover ? <img src={queuedCover} alt="" /> : <i>{queuedSong.title.slice(0, 1)}</i>}
                    </span>
                    <span className="immersive-player__queue-meta">
                      <b>{queuedSong.title}</b>
                      <small>{queuedSong.author.nickname}</small>
                    </span>
                    <em>{formatDuration(queuedSong.duration)}</em>
                  </button>
                  <button
                    type="button"
                    className="immersive-player__queue-remove"
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
        </aside>
      ) : null}
    </section>
  )
}
