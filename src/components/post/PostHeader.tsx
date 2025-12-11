import type { FC } from 'react'
import { formatDate } from '../../utils/formatDate'
import { Link } from 'react-router-dom'
import { goBackOrHome } from '../../utils/backNavigation'
import { useNavigate } from 'react-router-dom'

interface PostHeaderProps {
  authorName?: string
  createdAt?: any
  topic?: string
  onBack?: () => void
}

export const PostHeader: FC<PostHeaderProps> = ({ authorName, createdAt, topic }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    goBackOrHome(navigate)
  }
  return (
    <div className="mb-2 items-center">
      <div className="flex gap-2 flex-wrap font-medium text-base">
        <div
          onClick={handleBack}
          className="hover:opacity-75 transition py-1 cursor-pointer"
          aria-label="Go back"
          style={{ touchAction: 'manipulation' }}
        >
          <img src="/icons/back.svg" alt="Back" className="w-6 h-6 invert opacity-50" />
        </div>
        {topic && (
          <Link to={`/topic/${topic}`} className="text-amber-200 hover:bg-gray-700/25 px-2 py-1 rounded-2xl cursor-pointer"
                style={{ touchAction: 'manipulation' }}>/{topic}/ </Link>
        )}
        <Link to={`/user/${authorName}`} className="text-right cursor-pointer whitespace-nowrap text-amber-100/75 py-1 rounded-2xl hover:text-amber-200 transition">
          {authorName}
        </Link>
      </div>
      <h5 className="text-sm text-right text-amber-200 whitespace-nowrap font-thin">
        {createdAt ? formatDate(createdAt) : 'N/A'}
      </h5>
    </div>
  )
}
