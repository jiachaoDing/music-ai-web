import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'

type RepeatMode = 'off' | 'all' | 'one'

type MiniPlayerProps = {
  song?: Song
  isPlaying?: boolean
  repeatMode?: RepeatMode
  shuffleEnabled?: boolean
  progress?: number
  onOpenPlayer?: () => void
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onCycleRepeat?: () => void
}

const repeatTitle: Record<RepeatMode, string> = {
  off: '顺序播放',
  all: '列表循环',
  one: '单曲循环',
}

type IconName = 'shuffle' | 'repeat' | 'repeat-one' | 'prev' | 'next' | 'play' | 'pause'

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

  if (name === 'prev') {
    return (
      <svg {...common}>
        <path d="M6 5h2v14H6zM9 12l10 7V5z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'next') {
    return (
      <svg {...common}>
        <path d="M16 5h2v14h-2zM5 5v14l10-7z" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'pause') {
    return (
      <svg {...common}>
        <path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  )
}

export function MiniPlayer({
  song,
  isPlaying = false,
  repeatMode = 'off',
  shuffleEnabled = false,
  progress = 0,
  onOpenPlayer,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onCycleRepeat,
}: MiniPlayerProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const modeIcon = shuffleEnabled ? 'shuffle' : repeatMode === 'one' ? 'repeat-one' : 'repeat'
  const modeTitle = shuffleEnabled ? '随机播放' : repeatTitle[repeatMode === 'off' ? 'all' : repeatMode]

  return (
    <div className="mini-player">
      <button className="mini-player__main" type="button" onClick={onOpenPlayer}>
        <span className="mini-player__art">
          {coverUrl ? (
            <img className="mini-player__art-image" src={coverUrl} alt={`${song?.title ?? '当前作品'} 封面`} />
          ) : null}
        </span>
        <div className="mini-player__info">
          <strong>{song?.title ?? '暂无播放内容'}</strong>
          <span>{song ? song.author.nickname : '选择一首作品开始播放'}</span>
        </div>
      </button>

      <div className="mini-player__controls" aria-label="播放控制">
        <button type="button" className="mini-player__icon" onClick={onPlayPrev} disabled={!song} aria-label="上一首">
          <Icon name="prev" size={19} />
        </button>
        <button type="button" className="mini-player__play" onClick={onTogglePlay} disabled={!song} aria-label={isPlaying ? '暂停' : '播放'}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={19} />
        </button>
        <button type="button" className="mini-player__icon" onClick={onPlayNext} disabled={!song} aria-label="下一首">
          <Icon name="next" size={19} />
        </button>
        <button
          type="button"
          className="mini-player__icon is-active"
          onClick={onCycleRepeat}
          disabled={!song}
          title={modeTitle}
          aria-label={modeTitle}
        >
          <Icon name={modeIcon} size={19} />
        </button>
      </div>

      <span className="mini-player__progress" aria-hidden="true">
        <i style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </span>
    </div>
  )
}
