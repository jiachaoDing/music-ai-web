import { useMemo } from 'react'
import type { RefObject } from 'react'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatDuration } from '../../utils/format'
import { playerStyles } from './playerStyles'

type PlayerPageProps = {
  song?: Song
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  visualizerCanvasRef?: RefObject<HTMLCanvasElement | null>
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onSeek?: (progress: number) => void
  onClose?: () => void
  onBackHome?: () => void
}

type LyricLine = {
  text: string
  index: number
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
  currentTime = 0,
  duration = 0,
  visualizerCanvasRef,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onSeek,
  onClose,
  onBackHome,
}: PlayerPageProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

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
              ‹
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--play"
              onClick={onTogglePlay}
              disabled={!song}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? 'Ⅱ' : '▶'}
            </button>
            <button
              type="button"
              className="immersive-player__control immersive-player__control--small"
              onClick={onPlayNext}
              disabled={!song}
              aria-label="下一首"
            >
              ›
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
