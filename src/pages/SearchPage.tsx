import { useSearchParams, useNavigate } from 'react-router-dom'
import { PostCard } from '../components/post/PostCard'
import SkeletonPost from '../components/skeleton/SkeletonPost'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import SearchBar from '../components/layout/SearchBar'
import { useLoadingTimeout } from '../hooks/useLoadingTimeout'
import { useSearch } from '../hooks/useSearch'

export default function SearchPage() {
  const navigate = useNavigate()
  const { isOnline } = useOnlineStatus()
  const [searchParams] = useSearchParams()
  const showSkeletons = useLoadingTimeout()
  const q = searchParams.get('q') || ''
  const { posts, users, topics, likes, loading, handleToggleLike } = useSearch(q, isOnline)

  const handleViewPost = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const handleViewUser = (userName: string) => {
    navigate(`/user/${userName}`)
  }

  const handleViewTopic = (topicName: string) => {
    navigate(`/topic/${topicName}`)
  }

  return (
    <div className="pb-20">
      {/* Search input */}
      <div className="px-4 pb-10 py-4 mx-5 lg:mx-40 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-white font-bold text-lg"
        >
          ←
        </button>
        <div className="flex-1">
          <SearchBar/>
        </div>
      </div>

      {/* Results list */}
      <ul className="space-y-2 text-white">
        {(showSkeletons || loading || !isOnline) && (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        )}

        {!loading && isOnline && q && (
          <>
            {users.length > 0 && (
              <li className="mb-4">
                {users.map(user => (
                  <div key={user.uid} className="h-auto m-auto bg-black/95 select-text shadow-md opacity-80 rounded-2xl w-14/15 mb-10 mt-10 lg:mb-20 lg:w-11/15 p-6">
                    <button onClick={() => handleViewUser(user.userName!)} className="text-amber-200 hover:underline">
                      {user.userName}
                    </button>
                  </div>
                ))}
              </li>
            )}
            {topics.length > 0 && (
              <li className="mb-4">
                {topics.map(topic => (
                  <div key={topic.id} className="h-auto m-auto bg-black/95 select-text shadow-md opacity-80 rounded-2xl w-14/15 mb-10 mt-10 lg:mb-20 lg:w-11/15 p-6">
                    <button onClick={() => handleViewTopic(topic.name)} className="text-amber-200 hover:underline">
                      /{topic.name}/ ({topic.memberCount} members)
                    </button>
                  </div>
                ))}
              </li>
            )}
            {posts.length > 0 && (
              <li className="mb-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    disabled={false}
                    onView={handleViewPost}
                    onToggleLike={handleToggleLike}
                    likedByUser={(post) => likes[post.id!]?.liked || false}
                    likeCount={(post) => likes[post.id!]?.count || 0}
                  />
                ))}
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  )
}