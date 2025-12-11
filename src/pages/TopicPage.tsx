import { useParams } from 'react-router-dom'
import { TopicHeader } from '../components/layout/TopicHeader'
import { PostCard } from '../components/post/PostCard'
import { Skeleton } from '../components/skeleton/Skeleton'
import { useTopicPage } from '../hooks/useTopicPage'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { topic, posts, isFollowing, loading, error, handleFollow, toggleLike, likedByUser, likeCount } = useTopicPage(topicId)

  useEffect(() => {
    if (!loading && !topic) {
      navigate('/not-found', { replace: true })
    }
  }, [loading, topic, error])

  if (loading) return <Skeleton />
  if (!topic) return null

  return (
    <div className="min-h-screen bg-transparent text-white p-4">
      <div className="max-w-4xl mx-auto">
        <TopicHeader
          topic={topic}
          isFollowing={isFollowing}
          onFollow={handleFollow}
        />
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <ul>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                disabled={false}
                onView={(id) => navigate(`/post/${id}`)}
                onToggleLike={toggleLike}
                likedByUser={likedByUser}
                likeCount={likeCount}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}