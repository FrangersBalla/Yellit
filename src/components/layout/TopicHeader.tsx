import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { goBackOrHome } from '../../utils/backNavigation'

interface TopicHeaderProps {
  topic: {
    name: string
    memberCount: number
  }
  isFollowing: boolean
  onFollow: () => void
}

export const TopicHeader: FC<TopicHeaderProps> = ({ topic, isFollowing, onFollow }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    goBackOrHome(navigate)
  }

  return (
    <div className="bg-zinc-900/80 p-6 rounded-3xl shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <button
            onClick={handleBack}
            className="hover:opacity-75 transition py-1 cursor-pointer"
            aria-label="Go back"
          >
            <img src="/icons/back.svg" alt="Back" className="w-6 h-6 invert opacity-50" />
          </button>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white mb-2 selectable-text">{topic.name}</p>
            <p className="text-sm text-gray-400 mb-4">{topic.memberCount} membri</p>
          </div>
        </div>
        <button
          onClick={onFollow}
          className={`px-4 py-2 rounded-full font-medium transition ${
            isFollowing
              ? 'bg-zinc-700 text-white'
              : 'bg-amber-300 text-black'
          }`}
        >
          {isFollowing ? 'Iscritto' : 'Iscriviti'}
        </button>
      </div>
    </div>
  )
}