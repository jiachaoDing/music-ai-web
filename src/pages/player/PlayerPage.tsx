import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatDuration } from '../../utils/format'
import { playerStyles } from './playerStyles'

type PlayerPageProps = {
  song?: Song
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  visualizerBars?: number[]
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
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('[') && !line.startsWith('<') && !line.endsWith('>'))
    .map((text, index) => ({ text, index }))
}

function getActiveLyricIndex(lines: LyricLine[], currentTime: number, duration: number) {
  if (!lines.length || duration <= 0) return -1

  const progress = Math.max(0, Math.min(currentTime / duration, 0.999))
  return Math.min(lines.length - 1, Math.floor(progress * lines.length))
}

export function PlayerPage({
  song,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  visualizerBars = [],
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onSeek,
  onClose,
  onBackHome,
}: PlayerPageProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const lyricsRef = useRef<HTMLDivElement | null>(null)

  const lyricLines = useMemo(() => parseLyrics(song?.lyrics), [song?.lyrics])
  const activeLyricIndex = useMemo(
    () => getActiveLyricIndex(lyricLines, currentTime, duration || song?.duration || 0),
    [currentTime, duration, lyricLines, song?.duration]
  )

  useEffect(() => {
    if (!lyricsRef.current || activeLyricIndex < 0) return

    const activeElement = lyricsRef.current.querySelector<HTMLElement>(
      `[data-lyric-index="${activeLyricIndex}"]`
    )

    activeElement?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
  }, [activeLyricIndex])

  return (
    <section className={`immersive-player${isPlaying ? ' is-playing' : ''}`}>
      <style>{playerStyles}</style>

      <div className="immersive-player__backdrop" />

      <div className="immersive-player__bars immersive-player__bars--top" aria-hidden="true">
        {visualizerBars.map((value, index) => (
          <div key={`top-${index}`} className="immersive-player__bar">
            <i
              style={
                {
                  '--bar-height': `${Math.max(14, Math.round(value * 100))}%`,
                } as CSSProperties
              }
            />
          </div>
        ))}
      </div>

      <div className="immersive-player__bars immersive-player__bars--bottom" aria-hidden="true">
        {[...visualizerBars].reverse().map((value, index) => (
          <div key={`bottom-${index}`} className="immersive-player__bar">
            <i
              style={
                {
                  '--bar-height': `${Math.max(12, Math.round(value * 100))}%`,
                } as CSSProperties
              }
            />
          </div>
        ))}
      </div>

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

        <div ref={lyricsRef} className="immersive-player__lyrics">
          {lyricLines.length ? (
            lyricLines.map((line, index) => (
              <p
                key={`${line.text}-${line.index}`}
                data-lyric-index={index}
                className={index === activeLyricIndex ? 'is-active' : ''}
              >
                {line.text}
              </p>
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
