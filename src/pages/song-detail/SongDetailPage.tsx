import { useEffect, useState } from 'react'
import { generateSongReview, type SongReviewResult } from '../../api/ai'
import { addSongToPlaylist, createPlaylist, getPlaylists } from '../../api/me'
import { collectSong, likeSong } from '../../api/song'
import type { Playlist } from '../../types/playlist'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatCount, formatDuration } from '../../utils/format'
import { songDetailStyles } from './songDetailStyles'

type SongDetailPageProps = {
  song: Song
  canManage: boolean
  publishing?: boolean
  onPlay: () => void
  onRemix: () => void | Promise<void>
  onPlayDj: () => void | Promise<void>
  onOpenPoster: () => void
  onPublish: () => void
  onSetPrivate: () => void
  onSongUpdate?: (song: Song) => void
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

function formatAiReviewText(value?: string | null) {
  return value?.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

function getReviewPayload(result: SongReviewResult) {
  return result.data ?? result
}

function pickReviewText(result: SongReviewResult) {
  const payload = getReviewPayload(result)

  return (
    formatAiReviewText(payload.text) ||
    formatAiReviewText(payload.aiReview) ||
    formatAiReviewText(payload.review) ||
    formatAiReviewText(payload.song?.aiReview)
  )
}

export function SongDetailPage({
  song,
  canManage,
  publishing = false,
  onPlay,
  onRemix,
  onPlayDj,
  onOpenPoster,
  onPublish,
  onSetPrivate,
  onSongUpdate,
}: SongDetailPageProps) {
  const statusCopy = getStatusCopy(song)
  const coverUrl = resolveAssetUrl(song.coverUrl)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [playlistSubmitting, setPlaylistSubmitting] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [playlistCreating, setPlaylistCreating] = useState(false)
  const [likeSubmitting, setLikeSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(song.likeCount)
  const [collectCount, setCollectCount] = useState(song.collectCount)
  const [djLoading, setDjLoading] = useState(false)
  const [remixSubmitting, setRemixSubmitting] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [aiReview, setAiReview] = useState(formatAiReviewText(song.aiReview) ?? '')
  const displayDescription =
    song.description ??
    `${formatMode(song.mode)}已经完成，当前可以继续试听、查看歌词，并决定是否发布到社区。`

  useEffect(() => {
    setLiked(false)
    setLikeCount(song.likeCount)
    setCollectCount(song.collectCount)
    setAiReview(formatAiReviewText(song.aiReview) ?? '')
  }, [song.id, song.likeCount, song.collectCount, song.aiReview])

  useEffect(() => {
    async function hydratePlaylists() {
      setPlaylistLoading(true)
      try {
        const nextPlaylists = await getPlaylists()
        setPlaylists(nextPlaylists)
        setSelectedPlaylistId((current) => current || nextPlaylists[0]?.id || '')
      } catch (error) {
        console.error(error)
      } finally {
        setPlaylistLoading(false)
      }
    }

    void hydratePlaylists()
  }, [])

  async function handleAddToPlaylist() {
    if (!selectedPlaylistId) {
      window.alert('请先选择一个歌单')
      return
    }

    setPlaylistSubmitting(true)

    try {
      try {
        const result = await collectSong(song.id, selectedPlaylistId)
        setCollectCount(result.collectCount)
      } catch (error) {
        if (error instanceof Error && error.message.includes('已经收藏')) {
          await addSongToPlaylist(selectedPlaylistId, song.id)
        } else {
          throw error
        }
      }

      setPlaylists((current) =>
        current.map((playlist) =>
          playlist.id === selectedPlaylistId
            ? { ...playlist, songCount: playlist.songCount + 1 }
            : playlist,
        ),
      )
      window.alert('已收藏到歌单')
      setPlaylistModalOpen(false)
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '收藏到歌单失败，请稍后重试')
    } finally {
      setPlaylistSubmitting(false)
    }
  }

  async function handleCreatePlaylist() {
    const name = newPlaylistName.trim()
    if (!name) {
      window.alert('请输入歌单名称')
      return
    }

    setPlaylistCreating(true)

    try {
      const nextPlaylist = await createPlaylist(name)
      setPlaylists((current) => [nextPlaylist, ...current])
      setSelectedPlaylistId(nextPlaylist.id)
      setNewPlaylistName('')
      window.alert('歌单已新建，可以继续收藏当前作品')
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '新建歌单失败，请稍后重试')
    } finally {
      setPlaylistCreating(false)
    }
  }

  async function handleLikeSong() {
    if (likeSubmitting || liked) return

    setLikeSubmitting(true)

    try {
      const result = await likeSong(song.id)
      setLiked(result.liked)
      setLikeCount(result.likeCount)
      window.alert('已点赞')
    } catch (error) {
      console.error(error)
      if (error instanceof Error && error.message.includes('已经点赞')) {
        setLiked(true)
        window.alert('你已经点赞过这首作品')
      } else {
        window.alert(error instanceof Error ? error.message : '点赞失败，请稍后重试')
      }
    } finally {
      setLikeSubmitting(false)
    }
  }

  async function handlePlayDj() {
    setDjLoading(true)
    try {
      await onPlayDj()
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'AI DJ 播报生成失败，请稍后重试')
    } finally {
      setDjLoading(false)
    }
  }

  async function handleRemix() {
    setRemixSubmitting(true)
    try {
      await onRemix()
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '二创任务提交失败，请稍后重试')
    } finally {
      setRemixSubmitting(false)
    }
  }

  async function handleGenerateReview() {
    if (reviewLoading) return

    setReviewLoading(true)
    try {
      const result = await generateSongReview(song.id)
      const payload = getReviewPayload(result)
      const payloadReview = pickReviewText(result)
      const nextReview =
        formatAiReviewText(result.text) ||
        formatAiReviewText(result.aiReview) ||
        formatAiReviewText(result.review) ||
        formatAiReviewText(result.song?.aiReview) ||
        'AI 乐评已生成，但后端没有返回具体内容。'
      setAiReview(nextReview)
      if (payloadReview) {
        setAiReview(payloadReview)
      }
      if (payload.song) {
        onSongUpdate?.({ ...payload.song, aiReview: payloadReview ?? nextReview })
      }
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'AI 乐评生成失败，请稍后重试')
    } finally {
      setReviewLoading(false)
    }
  }

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
                <span>{formatCount(likeCount)} 喜欢</span>
                <span>{formatCount(collectCount)} 收藏</span>
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
            <strong>{formatCount(song.playCount + likeCount + collectCount)}</strong>
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
        <button
          type="button"
          className="song-detail-action is-soft"
          disabled={remixSubmitting}
          onClick={() => void handleRemix()}
        >
          {remixSubmitting ? '提交中...' : '翻唱二创'}
        </button>
        <button
          type="button"
          className="song-detail-action is-soft"
          disabled={djLoading}
          onClick={() => void handlePlayDj()}
        >
          {djLoading ? '播报中...' : 'AI DJ 播报'}
        </button>
        <button
          type="button"
          className={`song-detail-action ${liked ? 'is-liked' : ''}`}
          disabled={likeSubmitting || liked}
          onClick={() => void handleLikeSong()}
        >
          {likeSubmitting ? '点赞中...' : liked ? '已点赞' : `点赞 ${formatCount(likeCount)}`}
        </button>
        <button
          type="button"
          className="song-detail-action"
          onClick={() => setPlaylistModalOpen(true)}
        >
          收藏到歌单 {formatCount(collectCount)}
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
                  {formatCount(likeCount)} 喜欢 · {formatCount(collectCount)} 收藏
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
                <button
                  type="button"
                  className="song-detail-panel__button"
                  disabled={reviewLoading}
                  onClick={() => void handleGenerateReview()}
                >
                  {reviewLoading ? '生成中...' : aiReview ? '重新生成' : '生成乐评'}
                </button>
                <h2>AI 乐评</h2>
              </div>
            </div>
            <p>
              {aiReview ||
                '当前还没有生成 AI 乐评，后续这里可以继续接入创作解析、DJ 播报和风格总结。'}
            </p>
          </section>

        </div>
      </section>

      {playlistModalOpen ? (
        <div className="song-detail-modal-backdrop" onClick={() => setPlaylistModalOpen(false)}>
          <div className="song-detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="song-detail-modal__heading">
              <div>
                <span>Collect To Playlist</span>
                <h3>收藏到歌单</h3>
              </div>
              <button
                type="button"
                className="song-detail-modal__close"
                onClick={() => setPlaylistModalOpen(false)}
              >
                关闭
              </button>
            </div>

            <div className="song-detail-add-target">
              <strong>{song.title}</strong>
              <span>{song.style} · 当前 {formatCount(collectCount)} 次收藏</span>
            </div>

            <div className="song-detail-playlist-list" aria-label="选择歌单">
              {playlistLoading ? <p className="song-detail-modal__hint">正在读取歌单...</p> : null}
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  className={`song-detail-playlist-item ${
                    playlist.id === selectedPlaylistId ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                >
                  <span
                    className="song-detail-playlist-cover"
                    style={{ background: playlist.color ?? undefined }}
                    aria-hidden="true"
                  >
                    ♪
                  </span>
                  <span className="song-detail-playlist-copy">
                    <strong>{playlist.name}</strong>
                    <small>{playlist.songCount} 首 · {playlist.type === 'liked' ? '喜欢歌单' : '自建歌单'}</small>
                  </span>
                  <span className="song-detail-playlist-check">
                    {playlist.id === selectedPlaylistId ? '已选' : '选择'}
                  </span>
                </button>
              ))}
            </div>

            {!playlists.length && !playlistLoading ? (
              <p className="song-detail-modal__hint">还没有可用歌单，可以直接在这里新建一个。</p>
            ) : null}

            <div className="song-detail-create-playlist">
              <input
                value={newPlaylistName}
                placeholder="新建一个歌单..."
                disabled={playlistCreating}
                onChange={(event) => setNewPlaylistName(event.target.value)}
              />
              <button
                type="button"
                className="song-detail-action is-soft"
                disabled={playlistCreating}
                onClick={() => void handleCreatePlaylist()}
              >
                {playlistCreating ? '新建中...' : '+ 新建'}
              </button>
            </div>

            <div className="song-detail-modal__actions">
              <button
                type="button"
                className="song-detail-action"
                disabled={playlistSubmitting}
                onClick={() => setPlaylistModalOpen(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="song-detail-action is-primary"
                disabled={playlistLoading || playlistSubmitting || !selectedPlaylistId}
                onClick={() => void handleAddToPlaylist()}
              >
                {playlistSubmitting ? '收藏中...' : '确认收藏'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </section>
  )
}
