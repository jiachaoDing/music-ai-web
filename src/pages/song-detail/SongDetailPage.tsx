import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatCount, formatDuration } from '../../utils/format'
import { songDetailStyles } from './songDetailStyles'

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
      description: '作品已经公开发布，可以继续分享、播放和传播。',
    }
  }

  if (song.status === 'private') {
    return {
      label: '仅自己可见',
      description: '作品目前保留在个人空间中，你可以随时重新公开发布。',
    }
  }

  return {
    label: '草稿',
    description: '作品已经生成完成，但还没有正式发布到社区。',
  }
}

function formatMode(mode: Song['mode']) {
  if (mode === 'photo') return '看图写歌'
  if (mode === 'emotion') return '情绪炼歌'
  if (mode === 'meme') return '梗歌制造机'
  if (mode === 'foryou') return '为 TA 写歌'
  return '常规创作'
}

function formatDate(date?: string | null) {
  if (!date) return '未记录'

  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  const displayDescription =
    song.description ??
    `${formatMode(song.mode)}已经完成，当前可以继续试听、查看歌词，并决定是否发布到社区。`

  return (
    <section className="page-stack song-detail-page">
      <style>{songDetailStyles}</style>

      <section className="song-detail-hero">
        <div className="song-detail-surface">
          <div className="song-detail-main">
            <div className="song-detail-cover">
              {coverUrl ? (
                <img src={coverUrl} alt={`${song.title} 封面`} />
              ) : (
                <div className="song-detail-cover__fallback">{song.title.slice(0, 1)}</div>
              )}
            </div>

            <div className="song-detail-copy">
              <div className="song-detail-eyebrow">
                <b />
                <span>
                  {formatMode(song.mode)} · {statusCopy.label}
                </span>
              </div>

              <h1>{song.title}</h1>
              <p className="song-detail-summary">{displayDescription}</p>

              <div className="song-detail-tags">
                <span>{song.style}</span>
                <span>{song.published ? '社区公开作品' : '个人空间作品'}</span>
              </div>

              <div className="song-detail-stats">
                <span>{formatCount(song.playCount)} 播放</span>
                <span>{formatCount(song.likeCount)} 喜欢</span>
                <span>{formatCount(song.collectCount)} 收藏</span>
                <span>{formatCount(song.commentCount)} 评论</span>
              </div>

              <div className="song-detail-meta-grid">
                <div className="song-detail-meta-card">
                  <span>作者</span>
                  <strong>{song.author.nickname}</strong>
                </div>
                <div className="song-detail-meta-card">
                  <span>时长</span>
                  <strong>{formatDuration(song.duration)}</strong>
                </div>
                <div className="song-detail-meta-card">
                  <span>创建时间</span>
                  <strong>{formatDate(song.createdAt)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="song-detail-panel song-detail-side">
          <div className="song-detail-side__top">
            <span>发布状态</span>
            <h2>{statusCopy.label}</h2>
            <p>{statusCopy.description}</p>
          </div>

          <div className="song-detail-side__score">
            <span>作品热度</span>
            <strong>{formatCount(song.playCount + song.likeCount + song.collectCount)}</strong>
            <p>当前由播放、点赞和收藏累积形成，后续还可以继续接评论和分享表现。</p>
          </div>

          {canManage ? (
            <div className="song-detail-side__actions">
              {!song.published || song.status !== 'published' ? (
                <button
                  type="button"
                  className="song-detail-action is-primary"
                  disabled={publishing}
                  onClick={onPublish}
                >
                  {publishing ? '发布中...' : '发布作品'}
                </button>
              ) : (
                <button
                  type="button"
                  className="song-detail-action is-soft"
                  disabled={publishing}
                  onClick={onSetPrivate}
                >
                  {publishing ? '处理中...' : '设为仅自己可见'}
                </button>
              )}
            </div>
          ) : null}
        </aside>
      </section>

      <section className="song-detail-toolbar">
        <button type="button" className="song-detail-action is-primary" onClick={onPlay}>
          播放作品
        </button>
        <button type="button" className="song-detail-action">
          点赞 {formatCount(song.likeCount)}
        </button>
        <button type="button" className="song-detail-action">
          收藏 {formatCount(song.collectCount)}
        </button>
        <button type="button" className="song-detail-action" onClick={onOpenPoster}>
          查看海报
        </button>
      </section>

      <section className="song-detail-grid">
        <div className="song-detail-stack">
          <section className="song-detail-block is-lyrics">
            <div className="song-detail-block__header">
              <div>
                <span>Lyrics</span>
                <h2>歌词内容</h2>
              </div>
            </div>
            <pre className="song-detail-lyrics">
              {song.lyrics?.trim() || '当前作品暂时还没有歌词内容。'}
            </pre>
          </section>

          <section className="song-detail-block">
            <div className="song-detail-block__header">
              <div>
                <span>Overview</span>
                <h2>作品概览</h2>
              </div>
            </div>
            <div className="song-detail-overview">
              <div className="song-detail-overview__row">
                <span>播放表现</span>
                <strong>{formatCount(song.playCount)} 次播放</strong>
              </div>
              <div className="song-detail-overview__row">
                <span>互动反馈</span>
                <strong>
                  {formatCount(song.likeCount)} 喜欢 · {formatCount(song.collectCount)} 收藏
                </strong>
              </div>
              <div className="song-detail-overview__row">
                <span>发布时间</span>
                <strong>{formatDate(song.publishedAt)}</strong>
              </div>
            </div>
          </section>
        </div>

        <div className="song-detail-stack">
          <section className="song-detail-panel">
            <div className="song-detail-panel__header">
              <div>
                <span>AI Review</span>
                <h2>AI 乐评</h2>
              </div>
            </div>
            <p>
              {song.aiReview ??
                '当前还没有生成 AI 乐评，后续这里可以继续接入创作解析、DJ 播报和风格总结。'}
            </p>
          </section>

        </div>
      </section>
    </section>
  )
}
