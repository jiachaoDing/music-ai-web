import type { AlbumSummary } from '../api/song'
import type { Song } from '../types/song'
import { formatDuration } from '../utils/format'

type TaskPageProps = {
  task: {
    status: 'queued' | 'running' | 'done' | 'error'
    stage: string
    description: string
    progress: number
    canOpenSong: boolean
    queueAhead?: number
    active?: number
    maxConcurrency?: number
    albumResult?: {
      album: AlbumSummary
      tracks: Song[]
    }
  }
  onOpenSong: () => void
  onOpenAlbumSong?: (songId: string) => void
  onReturnToChallenge?: () => void
  challengeTitle?: string
}

export function TaskPage({ task, onOpenSong, onOpenAlbumSong, onReturnToChallenge, challengeTitle }: TaskPageProps) {
  const buttonLabel =
    task.status === 'error'
      ? '返回继续调整'
      : task.canOpenSong
        ? '查看生成结果'
        : '生成中...'

  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>生成状态</span>
        <h1>{task.stage}</h1>
        <p>{task.description}</p>
      </div>
      <section className="task-panel">
        {task.status === 'queued' ? (
          <div className="task-queue" aria-label="任务排队状态">
            <div>
              <span>前方请求</span>
              <strong>{task.queueAhead ?? 0}</strong>
            </div>
            <div>
              <span>占用通道</span>
              <strong>{task.active ?? '--'}</strong>
            </div>
            <div>
              <span>通道上限</span>
              <strong>{task.maxConcurrency ?? '--'}</strong>
            </div>
          </div>
        ) : null}
        <div className="progress-bar">
          <span style={{ width: `${task.progress}%` }} />
        </div>
        <strong className="task-progress-value">{task.progress}%</strong>
        {task.albumResult ? (
          <section className="task-album-result">
            <div>
              <span>概念 EP</span>
              <h2>{task.albumResult.album.title}</h2>
              <p>{task.albumResult.album.description || `${task.albumResult.tracks.length} 首曲目`}</p>
            </div>
            {task.albumResult.tracks.length ? (
              <div className="task-album-tracks">
                {task.albumResult.tracks.map((track, index) => (
                  <button type="button" key={track.id} onClick={() => onOpenAlbumSong?.(track.id)}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{track.title}</strong>
                    <em>{formatDuration(track.duration)}</em>
                  </button>
                ))}
              </div>
            ) : <p>正在等待第一首歌曲完成...</p>}
          </section>
        ) : null}
        <button type="button" disabled={!task.canOpenSong} onClick={onOpenSong}>
          {buttonLabel}
        </button>
        {task.status === 'done' && onReturnToChallenge ? (
          <button type="button" onClick={onReturnToChallenge}>返回话题「{challengeTitle}」</button>
        ) : null}
      </section>
    </section>
  )
}
