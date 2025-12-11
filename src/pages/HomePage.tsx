import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PostCard } from '../components/post/PostCard'
import SkeletonPost from '../components/skeleton/SkeletonPost'
import { useHomeFeed } from '../hooks/post/useHomeFeed'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function Home() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { isOnline } = useOnlineStatus()
  const { posts, loading, isProcessing, likedByUser, likeCount, handleToggleLike, loadMore, loadingMore, handleViewPost } = useHomeFeed(currentUser)
  
  const onViewPost = useCallback(
    (postId: string) => {
      handleViewPost(postId, navigate)
    },
    [handleViewPost, navigate]
  )

  return (
    <div className="pb-20">
      <ul className="space-y-2 text-white">
        {(loading || !isOnline) && (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        )}

        {!loading && isOnline &&
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              disabled={isProcessing}
              onView={onViewPost}
              onToggleLike={handleToggleLike}
              likedByUser={likedByUser}
              likeCount={likeCount}
            />
          ))}
      </ul>

      {!loading && isOnline && posts.length > 0 && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-white/70 underline text-sm pb-10 disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Keep yelling'}
          </button>
        </div>
      )}
    </div>
  )
}
