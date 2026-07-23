import { useEffect, useState } from 'react'
import { getSongComments } from '../../api/song'
import { CommentCard } from '../../components/CommentCard'
import type { Comment } from '../../types/comment'
import type { Song } from '../../types/song'
import { sortComments } from '../../utils/comment'
import { commentsStyles } from './commentsStyles'

type CommentsPageProps = {
  song: Song
}

export function CommentsPage({ song }: CommentsPageProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    void getSongComments(song.id)
      .then((result) => {
        if (!cancelled) setComments(sortComments(result))
      })
      .catch(() => {
        if (!cancelled) setError('评论暂时读取失败，请稍后再试。')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [song.id])

  return (
    <section className="comments-page">
      <style>{commentsStyles}</style>
      <header className="comments-page__heading">
        <span>All Comments</span>
        <h1>全部评论</h1>
        <p>《{song.title}》 · {comments.length || song.commentCount} 条评论</p>
      </header>

      {loading ? <p className="comments-page__state">正在读取评论...</p> : null}
      {error ? <p className="comments-page__state">{error}</p> : null}
      {!loading && !error && !comments.length ? (
        <p className="comments-page__state">这首歌暂时还没有评论。</p>
      ) : null}

      {comments.length ? (
        <div className="comments-page__list">
          {comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
        </div>
      ) : null}
    </section>
  )
}
