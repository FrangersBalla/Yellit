import type { FC } from 'react'
import type { PostComment } from '../../../types/postComment'
import { formatDate } from '../../../utils/formatDate'
import { useCommentTranslate } from '../../../hooks/post/useCommentTranslate'
import { parseMarkdown } from '../../../utils/parseMarkdown'

interface CommentItemProps {
  comment: PostComment
}

export const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const { translation, translating, translated, handleTranslate } = useCommentTranslate(comment.comment)

  const displayText = translated ? translation : comment.comment
  const parsedText = parseMarkdown(displayText)

  return (
    <div className="bg-zinc-900/80 p-3 rounded-3xl select-none">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-amber-200">{comment.userName}</span>
        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="text-sm text-white break-words mb-2 selectable-text">{parsedText}</p>
      <button
        onClick={handleTranslate}
        className="text-xs text-amber-200 hover:text-amber-300 transition"
        disabled={translating}
      >
        {translated ? 'See Original' : translating ? 'Translating...' : 'Translate'}
      </button>
    </div>
  )
}