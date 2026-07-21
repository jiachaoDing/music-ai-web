import { useEffect, useState } from 'react'
import { generateSongReview, type SongReviewResult } from '../../api/ai'
import { addSongToPlaylist, createPlaylist, getPlaylists } from '../../api/me'
import {
  addSongComment,
  collectSong,
  getSongComments,
  getSongTree,
  likeSong,
  type SongTreeNode,
  type SongTreeResponse,
} from '../../api/song'
import type { Comment } from '../../types/comment'
import type { Playlist } from '../../types/playlist'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { ECHO_COSTS, formatEchoCost } from '../../utils/echoCost'
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
  onDelete?: () => void | Promise<void>
  onOpenSong?: (songId: string) => void
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

function countTreeNodes(nodes: SongTreeNode[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countTreeNodes(node.children), 0)
}

function getTreePreview(node: SongTreeNode) {
  return resolveAssetUrl(node.coverUrl ?? undefined)
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
  onDelete,
  onOpenSong,
  onSongUpdate,
}: SongDetailPageProps) {
  const statusCopy = getStatusCopy(song)
  const coverUrl = resolveAssetUrl(song.coverUrl)
  const canDelete =
    canManage &&
    !song.published &&
    ['draft', 'private', 'failed', 'generating', 'generated'].includes(song.status)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [playlistSubmitting, setPlaylistSubmitting] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [playlistCreating, setPlaylistCreating] = useState(false)
  const [likeSubmitting, setLikeSubmitting] = useState(false)
  const [liked, setLiked] = useState(song.liked ?? false)
  const [likeCount, setLikeCount] = useState(song.likeCount)
  const [collectCount, setCollectCount] = useState(song.collectCount)
  const [djLoading, setDjLoading] = useState(false)
  const [remixSubmitting, setRemixSubmitting] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [aiReview, setAiReview] = useState(formatAiReviewText(song.aiReview) ?? '')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentAnon, setCommentAnon] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentCount, setCommentCount] = useState(song.commentCount)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [songTree, setSongTree] = useState<SongTreeResponse | null>(null)
  const [treeLoading, setTreeLoading] = useState(false)
  const displayDescription =
    song.description ??
    `${formatMode(song.mode)}已经完成，当前可以继续试听、查看歌词，并决定是否发布到社区。`

  useEffect(() => {
    setLiked(false)
    setLikeCount(song.likeCount)
    setLiked(song.liked ?? false)
    setCollectCount(song.collectCount)
    setCommentCount(song.commentCount)
    setAiReview(formatAiReviewText(song.aiReview) ?? '')
  }, [song.id, song.likeCount, song.collectCount, song.commentCount, song.aiReview])

  useEffect(() => {
    async function hydrateComments() {
      setCommentsLoading(true)
      setCommentsError('')

      try {
        const nextComments = await getSongComments(song.id)
        setComments(nextComments)
      } catch (error) {
        console.error(error)
        setComments([])
        setCommentsError('评论暂时读取失败，请稍后再试。')
      } finally {
        setCommentsLoading(false)
      }
    }

    void hydrateComments()
  }, [song.id])

  useEffect(() => {
    async function hydrateTree() {
      setTreeLoading(true)

      try {
        const nextTree = await getSongTree(song.id)
        setSongTree(nextTree)
      } catch (error) {
        console.error(error)
        setSongTree(null)
      } finally {
        setTreeLoading(false)
      }
    }

    void hydrateTree()
  }, [song.id])

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
      onSongUpdate?.({ ...song, liked: result.liked, likeCount: result.likeCount })
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

  async function handleDeleteSong() {
    if (!onDelete) return

    const confirmed = window.confirm(`确定删除《${song.title}》吗？删除后无法恢复。`)
    if (!confirmed) return

    setDeleteSubmitting(true)

    try {
      await onDelete()
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '删除作品失败，请稍后重试')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  function renderTreeNode(node: SongTreeNode) {
    const isCurrent = node.id === songTree?.currentId
    const previewUrl = getTreePreview(node)

    return (
      <div className="song-remix-tree__node" key={node.id}>
        <button
          type="button"
          className={`song-remix-tree__item ${isCurrent ? 'is-current' : ''}`}
          onClick={() => (isCurrent ? undefined : onOpenSong?.(node.id))}
        >
          <span className="song-remix-tree__cover">
            {previewUrl ? <img src={previewUrl} alt={`${node.title} 封面`} /> : <i>{node.mode === 'remix' ? '翻' : '曲'}</i>}
          </span>
          <span className="song-remix-tree__copy">
            <strong>{node.title}</strong>
            <small>@{node.author?.nickname ?? '匿名创作者'} · {node.mode === 'remix' ? '翻唱版本' : '原始作品'}</small>
          </span>
          {isCurrent ? <b>当前</b> : null}
        </button>
        {node.children.length ? (
          <div className="song-remix-tree__children">
            {node.children.map((child) => renderTreeNode(child))}
          </div>
        ) : null}
      </div>
    )
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
        'AI 乐评暂时不可用，请稍后重新生成。'
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

  async function handleSubmitComment() {
    const text = commentText.trim()
    if (!text || commentSubmitting) return

    setCommentSubmitting(true)
      try {
        const result = await addSongComment(song.id, { text, anon: commentAnon })
        const nextCommentCount = commentCount + 1
        setComments((current) => [result.comment, ...current])
        setCommentText('')
        setCommentAnon(false)
        setCommentCount(nextCommentCount)
        onSongUpdate?.({ ...song, commentCount: nextCommentCount })
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '留言失败，请稍后再试')
    } finally {
      setCommentSubmitting(false)
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
              <span className="song-detail-ai-badge">AI生成</span>
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
                <span>AI生成</span>
              </div>

              <div className="song-detail-stats">
                <span>{formatCount(song.playCount)} 播放</span>
                <span>{formatCount(likeCount)} 喜欢</span>
                <span>{formatCount(collectCount)} 收藏</span>
                <span>{formatCount(commentCount)} 评论</span>
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
            <p>根据播放、点赞和收藏综合计算。</p>
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
              {canDelete && onDelete ? (
                <button
                  type="button"
                  className="song-detail-action is-danger"
                  disabled={deleteSubmitting}
                  onClick={() => void handleDeleteSong()}
                >
                  {deleteSubmitting ? '删除中...' : '删除作品'}
                </button>
              ) : null}
              <p className="song-detail-delete-note">
                删除规则：草稿和私密作品可以删除；已发布作品需要先设为仅自己可见。
              </p>
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
          {remixSubmitting ? '提交中...' : (
            <>
              翻唱二创
              <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.remix)}</span>
            </>
          )}
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
          {likeSubmitting ? '点赞中...' : liked ? '已点赞' : '点赞'}
        </button>
        <button
          type="button"
          className="song-detail-action"
          onClick={() => setPlaylistModalOpen(true)}
        >
          收藏到歌单
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
                <h2>歌词内容 <small className="song-detail-inline-ai">AI生成</small></h2>
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

          <section className="song-detail-block song-remix-tree">
            <div className="song-detail-block__header">
              <div>
                <span>Remix Tree</span>
                <h2>翻唱进化树</h2>
              </div>
              {songTree ? (
                <strong className="song-remix-tree__count">{countTreeNodes(songTree.remixes)} 个二创版本</strong>
              ) : null}
            </div>
            {treeLoading ? <p>正在读取翻唱进化树...</p> : null}
            {!treeLoading && songTree ? (
              <div className="song-remix-tree__body">
                {renderTreeNode({ ...songTree.root, children: songTree.remixes })}
              </div>
            ) : null}
            {!treeLoading && !songTree ? (
              <p>还没有二创版本，完成翻唱后会显示在这里。</p>
            ) : null}
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
                '还没有 AI 乐评，点击生成即可查看。'}
            </p>
          </section>

          <section className="song-detail-panel song-detail-hole">
            <div className="song-detail-panel__header">
              <div>
                <span>Tree Hole</span>
                <h2>树洞 · 留言</h2>
              </div>
              <strong className="song-detail-hole__count">{formatCount(commentCount)} 条</strong>
            </div>

            <div className="song-detail-hole-form">
              <textarea
                value={commentText}
                maxLength={240}
                placeholder="把听完这首歌后的感受留在树洞里..."
                disabled={commentSubmitting}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <div className="song-detail-hole-form__footer">
                <label>
                  <input
                    type="checkbox"
                    checked={commentAnon}
                    disabled={commentSubmitting}
                    onChange={(event) => setCommentAnon(event.target.checked)}
                  />
                  匿名留言
                </label>
                <span>{commentText.trim().length}/240</span>
                <button
                  type="button"
                  className="song-detail-action is-primary"
                  disabled={commentSubmitting || !commentText.trim()}
                  onClick={() => void handleSubmitComment()}
                >
                  {commentSubmitting ? '发送中...' : '留在树洞'}
                </button>
              </div>
            </div>

            {commentsLoading ? <p>正在读取留言...</p> : null}
            {commentsError ? <p>{commentsError}</p> : null}
            {!commentsLoading && !commentsError && !comments.length ? (
              <p>还没有人来过这个树洞，来当第一个吧。</p>
            ) : null}

            {comments.length ? (
              <div className="song-detail-comments">
                {comments.map((comment) => {
                  const isHostComment =
                    comment.userId === 'echo-host' || comment.text.startsWith('【主理人翻牌】')
                  const text = comment.text.replace(/^【主理人翻牌】/, '')

                  return (
                    <article
                      className={`song-detail-comment ${isHostComment ? 'is-host' : ''}`}
                      key={comment.id}
                    >
                      <div className="song-detail-comment__avatar" aria-hidden="true">
                        {isHostComment ? 'E' : (comment.userName || 'U').slice(0, 1)}
                      </div>
                      <div className="song-detail-comment__body">
                        <div className="song-detail-comment__meta">
                          <strong>
                            {isHostComment
                              ? 'Echo 主理人'
                              : comment.anon
                                ? '匿名听众'
                                : comment.userName || '听众'}
                          </strong>
                          {isHostComment ? <span>主理人翻牌</span> : null}
                          {!isHostComment && comment.anon ? <span>匿名</span> : null}
                        </div>
                        <p>{text}</p>
                        <small>{formatDate(comment.createdAt)}</small>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : null}
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
