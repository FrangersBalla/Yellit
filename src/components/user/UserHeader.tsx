import type { FC } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { goBackOrHome } from '../../utils/backNavigation'

interface UserHeaderProps {
  user: {
    username: string
    email: string
    topics: string[]
  }
  isFollowing: boolean
  onFollow: () => void
  isCurrentUser: boolean
  isFollowingLoading?: boolean
}

export const UserHeader: FC<UserHeaderProps> = ({ user, isFollowing, onFollow, isCurrentUser, isFollowingLoading = false }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    goBackOrHome(navigate)
  }

  return (
    <div className="bg-zinc-900/80 p-6 rounded-3xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div className="flex items-start gap-2">
          <div
            onClick={handleBack}
            className="hover:opacity-75 transition py-1 cursor-pointer"
            aria-label="Go back"
            style={{ touchAction: 'manipulation' }}
          >
            <img src="/icons/back.svg" alt="Back" className="w-6 h-6 invert opacity-50" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white mb-2 selectable-text">{user.username}</p>
            <p className="text-sm text-gray-400 mb-4 selectable-text">{user.email}</p>
            <div>
              <p className="text-lg font-semibold text-amber-200 mb-2">Topic:</p>
              <div className="flex flex-wrap gap-2">
                {user.topics.length > 0 ? (
                  user.topics.map((topic, index) => (
                    <Link
                      key={index}
                      to={`/topic/${topic}`}
                      className="bg-amber-300/20 text-amber-200 px-3 py-1 rounded-full text-sm hover:bg-amber-300/30 transition"
                    >
                      {topic}
                    </Link>
                  ))
                ) : (
                  <p className=""></p>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isCurrentUser && (
          <button
            onClick={onFollow}
            disabled={isFollowingLoading}
            className={`px-4 py-2 rounded-full font-medium transition mt-4 sm:mt-0 ${
              isFollowingLoading
                ? 'bg-zinc-600 text-gray-400 cursor-not-allowed'
                : isFollowing
                ? 'bg-zinc-700 text-white'
                : 'bg-amber-300 text-black'
            }`}
          >
            {isFollowingLoading ? 'Caricamento...' : isFollowing ? 'Segui già' : 'Segui'}
          </button>
        )}
      </div>
    </div>
  )
}