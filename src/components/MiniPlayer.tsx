import type { Song } from '../types/song'

type MiniPlayerProps = {
  song?: Song
  onOpenPlayer?: () => void
}

export function MiniPlayer({ song, onOpenPlayer }: MiniPlayerProps) {
  return (
    <button className="mini-player" type="button" onClick={onOpenPlayer}>
      <span className="mini-player__pulse" />
      <div>
        <strong>{song?.title ?? '暂无播放内容'}</strong>
        <span>{song ? song.author.nickname : '选择一首作品开始播放'}</span>
      </div>
      <span>播放</span>
    </button>
  )
}
