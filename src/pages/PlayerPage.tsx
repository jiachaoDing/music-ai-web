import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'
import { formatDuration } from '../utils/format'

type PlayerPageProps = {
  song?: Song
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onSeek?: (progress: number) => void
}

export function PlayerPage({
  song,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onSeek,
}: PlayerPageProps) {
  const coverUrl = resolveAssetUrl(song?.coverUrl)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <section className="player-page">
      <div className="player-disc">
        {coverUrl ? <img className="detail-cover__image" src={coverUrl} alt={`${song?.title ?? '当前作品'} 封面`} /> : song?.title.slice(0, 1) ?? 'E'}
      </div>
      <h1>{song?.title ?? '暂无播放内容'}</h1>
      <p>{song ? `${song.author.nickname} · ${song.style}` : '从首页、详情页或我的作品里选择一首歌开始播放。'}</p>
      <button
        type="button"
        className="progress-bar"
        onClick={(event) => {
          if (!duration || !onSeek) return
          const rect = event.currentTarget.getBoundingClientRect()
          const nextProgress = ((event.clientX - rect.left) / rect.width) * 100
          onSeek(nextProgress)
        }}
      >
        <span style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </button>
      <div className="player-page__time">
        <span>{formatDuration(Math.floor(currentTime))}</span>
        <span>{formatDuration(Math.floor(duration || song?.duration || 0))}</span>
      </div>
      <div className="action-grid">
        <button type="button" onClick={onPlayPrev} disabled={!song}>
          上一首
        </button>
        <button type="button" onClick={onTogglePlay} disabled={!song}>
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button type="button" onClick={onPlayNext} disabled={!song}>
          下一首
        </button>
      </div>
    </section>
  )
}
