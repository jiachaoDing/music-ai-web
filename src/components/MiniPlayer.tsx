import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'

type MiniPlayerProps = {
  song?: Song
  isPlaying?: boolean
  progress?: number
  onOpenPlayer?: () => void
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
}

export function MiniPlayer({
  song,
  isPlaying = false,
  progress = 0,
  onOpenPlayer,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
}: MiniPlayerProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)

  return (
    <div className="mini-player">
      <button className="mini-player__main" type="button" onClick={onOpenPlayer}>
        <span className="mini-player__art">
          {coverUrl ? <img className="mini-player__art-image" src={coverUrl} alt={`${song?.title ?? '当前作品'} 封面`} /> : null}
        </span>
        <div className="mini-player__info">
          <strong>{song?.title ?? '暂无播放内容'}</strong>
          <span>{song ? song.author.nickname : '选择一首作品开始播放'}</span>
        </div>
      </button>

      <div className="mini-player__controls" aria-label="播放控制">
        <button type="button" className="mini-player__skip" onClick={onPlayPrev} disabled={!song}>
          ‹
        </button>
        <button type="button" className="mini-player__play" onClick={onTogglePlay} disabled={!song}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button type="button" className="mini-player__skip" onClick={onPlayNext} disabled={!song}>
          ›
        </button>
      </div>

      <span className="mini-player__progress" aria-hidden="true">
        <i style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </span>
    </div>
  )
}
