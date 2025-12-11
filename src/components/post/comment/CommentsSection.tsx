import type { FC } from 'react'
import type { PostComment } from '../../../types/postComment'
import { CommentItem } from './CommentItem'

interface CommentsSectionProps {
  comments: PostComment[]
}

export const CommentsSection: FC<CommentsSectionProps> = ({ comments }) => (
  <div className="pt-6 space-y-4 border-t border-white/25 select-none">
    <h2 className="text-lg font-semibold text-white select-none">Comments ({comments.length})</h2>

    <div className="space-y-3">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  </div>
)
