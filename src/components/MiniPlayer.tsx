import type { Song } from '../types/song'

type MiniPlayerProps = {
  song?: Song
  onOpenPlayer?: () => void
}

export function MiniPlayer({ song, onOpenPlayer }: MiniPlayerProps) {
  return (
    <button className="mini-player" type="button" onClick={onOpenPlayer}>
      <span className="mini-player__art" />
      <div className="mini-player__info">
        <strong>{song?.title ?? '暂无播放内容'}</strong>
        <span>{song ? song.author.nickname : '选择一首作品开始播放'}</span>
      </div>
      <div className="mini-player__controls" aria-hidden="true">
        <span className="mini-player__skip">‹</span>
        <span className="mini-player__play">▶</span>
        <span className="mini-player__skip">›</span>
      </div>
      <span className="mini-player__progress" aria-hidden="true">
        <i />
      </span>
    </button>
  )
}
