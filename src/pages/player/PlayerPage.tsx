import { useMemo } from 'react'
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
  visualizerCanvasRef?: RefObject<HTMLCanvasElement | null>
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onCycleRepeat?: () => void
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
  name: 'shuffle' | 'repeat' | 'repeat-one' | 'prev' | 'next' | 'play' | 'pause'
  size?: number
}) {
  if (name === 'pause') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'prev') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M6 5h2v14H6zM9 12l10 7V5z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'next') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M16 5h2v14h-2zM5 5v14l10-7z" fill="currentColor" />
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
          <path d="M5 8h10.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M13.5 5.5 17 8l-3.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 16H8.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10.5 13.5 7 16l3.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M7.2 8.2h7.4c1.6 0 2.9 1.3 2.9 2.9v.9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M15 5.7 18.2 8.2 15 10.7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.8 15.8H9.4c-1.6 0-2.9-1.3-2.9-2.9V12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9 18.3 5.8 15.8 9 13.3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="12" y="14.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="currentColor">
            1
          </text>
        </>
      )}
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
  visualizerCanvasRef,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onCycleRepeat,
  onSeek,
  onClose,
  onBackHome,
}: PlayerPageProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const playModeTitle = shuffleEnabled ? '随机播放' : repeatMode === 'one' ? '单曲循环' : '列表循环'
  const playModeIcon = shuffleEnabled ? 'shuffle' : repeatMode === 'one' ? 'repeat-one' : 'repeat'

  const lyricLines = useMemo(() => parseLyrics(song?.lyrics), [song?.lyrics])

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
              className="immersive-player__control immersive-player__control--small"
              onClick={onPlayPrev}
              disabled={!song}
              aria-label="上一首"
            >
              <PlayerIcon name="prev" size={19} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--play"
              onClick={onTogglePlay}
              disabled={!song}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              <PlayerIcon name={isPlaying ? 'pause' : 'play'} size={19} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--small"
              onClick={onPlayNext}
              disabled={!song}
              aria-label="下一首"
            >
              <PlayerIcon name="next" size={19} />
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--repeat is-active"
              onClick={onCycleRepeat}
              disabled={!song}
              aria-label={playModeTitle}
              title={playModeTitle}
            >
              <PlayerIcon name={playModeIcon} size={19} />
            </button>
          </div>

          <div className="immersive-player__meta">
            <span>{song?.style ?? '未设置风格'}</span>
            <span>{song ? `${song.playCount} 播放` : '等待播放'}</span>
            <span>{song ? `${song.likeCount} 喜欢` : '准备开始'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
