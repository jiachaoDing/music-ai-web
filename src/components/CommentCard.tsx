import type { Comment } from '../types/comment'
import { isHostComment } from '../utils/comment'

function formatCommentDate(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CommentCard({ comment }: { comment: Comment }) {
  const hostComment = isHostComment(comment)
  const text = comment.text.replace(/^【主理人翻牌】/, '')

  return (
    <article className={`song-detail-comment ${hostComment ? 'is-host' : ''}`}>
      <div className="song-detail-comment__avatar" aria-hidden="true">
        {hostComment ? 'E' : (comment.userName || 'U').slice(0, 1)}
      </div>
      <div className="song-detail-comment__body">
        <div className="song-detail-comment__meta">
          <strong>
            {hostComment
              ? 'Echo 主理人'
              : comment.anon
                ? '匿名听众'
                : comment.userName || '听众'}
          </strong>
          {hostComment ? <span>主理人翻牌</span> : null}
          {hostComment ? <span className="is-ai">AI生成</span> : null}
          {!hostComment && comment.anon ? <span>匿名</span> : null}
        </div>
        <p>{text}</p>
        <small>{formatCommentDate(comment.createdAt)}</small>
      </div>
    </article>
  )
}
