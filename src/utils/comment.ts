import type { Comment } from '../types/comment'

export function isHostComment(comment: Comment) {
  return comment.userId === 'echo-host' || comment.text.startsWith('【主理人翻牌】')
}

export function sortComments(comments: Comment[]) {
  return [...comments].sort((left, right) => {
    const hostDifference = Number(isHostComment(right)) - Number(isHostComment(left))
    if (hostDifference) return hostDifference
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })
}
