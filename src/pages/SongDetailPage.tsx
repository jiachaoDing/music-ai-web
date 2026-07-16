import type { Song } from '../types/song'
import { resolveAssetUrl } from '../utils/asset'
import { formatCount, formatDuration } from '../utils/format'

type SongDetailPageProps = {
  song: Song
  canManage: boolean
  publishing?: boolean
  onPlay: () => void
  onOpenPoster: () => void
  onPublish: () => void
  onSetPrivate: () => void
}

function getStatusCopy(song: Song) {
  if (song.published && song.status === 'published') {
    return {
      label: '已发布',
      description: '这首作品已经进入公开状态，可以继续分享、播放和传播。',
    }
  }

  if (song.status === 'private') {
    return {
      label: '仅自己可见',
      description: '作品目前保留在个人空间中，你可以随时再次公开发布。',
    }
  }

  return {
    label: '草稿',
    description: '作品已经生成完成，但还没有正式发布到社区。',
  }
}

export function SongDetailPage({
  song,
  canManage,
  publishing = false,
  onPlay,
  onOpenPoster,
  onPublish,
  onSetPrivate,
}: SongDetailPageProps) {
  const statusCopy = getStatusCopy(song)
  const coverUrl = resolveAssetUrl(song.coverUrl)

  return (
    <section className="page-stack">
      <div className="detail-hero">
        <div className="detail-cover">
          {coverUrl ? (
            <img className="detail-cover__image" src={coverUrl} alt={`${song.title} 封面`} />
          ) : (
            song.title.slice(0, 1)
          )}
        </div>
        <div className="detail-copy">
          <span>
            {song.mode} · {statusCopy.label}
          </span>
          <h1>{song.title}</h1>
          <p>{song.description ?? statusCopy.description}</p>
          <div className="chip-row">
            <span>{song.style}</span>
            <span>{formatDuration(song.duration)}</span>
            <span>{song.author.nickname}</span>
          </div>
        </div>
      </div>

      {canManage ? (
        <section className="content-panel detail-status-panel">
          <div className="detail-status-panel__copy">
            <h2>发布状态</h2>
            <p>{statusCopy.description}</p>
          </div>
          <div className="action-grid">
            {!song.published || song.status !== 'published' ? (
              <button type="button" className="is-primary" disabled={publishing} onClick={onPublish}>
                {publishing ? '发布中...' : '发布作品'}
              </button>
            ) : (
              <button
                type="button"
                className="is-secondary"
                disabled={publishing}
                onClick={onSetPrivate}
              >
                {publishing ? '处理中...' : '设为仅自己可见'}
              </button>
            )}
          </div>
        </section>
      ) : null}

      <section className="action-grid">
        <button type="button" onClick={onPlay}>
          播放
        </button>
        <button type="button">点赞 {formatCount(song.likeCount)}</button>
        <button type="button">收藏</button>
        <button type="button" onClick={onOpenPoster}>
          海报
        </button>
      </section>

      <section className="content-panel">
        <h2>作品概览</h2>
        <p>
          当前播放 {formatCount(song.playCount)} 次，收到 {formatCount(song.likeCount)} 次点赞，已被收藏{' '}
          {formatCount(song.collectCount)} 次。
        </p>
      </section>

      <section className="content-panel">
        <h2>AI 乐评</h2>
        <p>{song.aiReview ?? '后续这里可以继续接入 AI 乐评、DJ 播报或创作解析内容。'}</p>
      </section>

      <section className="content-panel">
        <h2>歌词</h2>
        <pre>{song.lyrics ?? '当前作品暂时还没有歌词内容。'}</pre>
      </section>
    </section>
  )
}
