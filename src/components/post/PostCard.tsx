import type { FC } from 'react'
import type { Post } from '../../types/post'
import { formatDate } from '../../utils/formatDate'
import { parseMarkdown } from '../../utils/parseMarkdown'
import { Link } from 'react-router-dom'

interface PostCardProps {
  post: Post
  disabled: boolean
  onView: (postId: string) => void
  onToggleLike: (postId: string) => void
  likedByUser: (post: Post) => boolean
  likeCount: (post: Post) => number
}

export const PostCard: FC<PostCardProps> = ({ post, disabled, onView, onToggleLike, likedByUser, likeCount }) => {
  const parsedTitle = parseMarkdown(post.title)
  const parsedContent = parseMarkdown(post.content)

  return (
    <div>
      <div className="h-auto m-auto bg-black flex flex-col justify-between select-text shadow-md opacity-80 rounded-2xl w-14/15 mb-10 mt-10 lg:mb-20 lg:w-11/15 p-6">
        <div>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex gap-2 flex-wrap font-medium text-base">
              {post.topic && (
                <Link to={`/topic/${post.topic}`} className="text-amber-200 hover:bg-gray-700/25 px-2 py-1 rounded-2xl">
                  /{post.topic}/ 
                </Link>
              )}
              <Link to={`/user/${post.name}`} className="text-right text-amber-100/75 whitespace-nowrap cursor-pointer py-1 rounded-2xl hover:text-amber-200 transition">
                {post.name}:
              </Link>
            </div>
            <h5 className="text-sm text-right text-amber-200 whitespace-nowrap font-thin">
              {post.createdAt ? formatDate(post.createdAt) : 'N/A'}
            </h5>
          </div>

          <h1 className="mb-6 text-2xl text-left font-medium">{parsedTitle}</h1>

          <button onClick={() => onView(post.id!)} className="text-left w-full">
            <p className="mb-5 text-left line-clamp-8 hover:opacity-75 transition">{parsedContent}</p>
          </button>
        </div>

        <div className="flex gap-2 flex-wrap font-thin text-sm">
          <div className="bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl">
            <button
              onClick={() => onToggleLike(post.id!)}
              className="flex items-center"
              disabled={disabled}
              aria-label="Toggle like"
            >
              <img
                src="/icons/like.svg"
                alt="Like"
                className={`w-5 h-5 mr-3 ${likedByUser(post) ? 'invert' : ''}`}
              />
              {likeCount(post)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
