import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { UserHeader } from '../components/user/UserHeader'
import { PostCard } from '../components/post/PostCard'
import { Skeleton } from '../components/skeleton/Skeleton'
import { useUserPage } from '../hooks/user/useUserPage'

export default function UserPage() {
  const { userName } = useParams<{ userName: string }>()
  const navigate = useNavigate()
  
  const {
    user,
    posts,
    followedUsers,
    isFollowing,
    isFollowingLoading,
    loading,
    notFound,
    handleFollow,
    toggleLike,
    likedByUser,
    likeCount,
    isCurrentUser
  } = useUserPage(userName)
  const [activeTab, setActiveTab] = useState<'posts' | 'followed'>('posts')

  useEffect(() => {
    if (notFound) {
      navigate('/not-found')
    }
  }, [notFound, navigate])

  if (loading) return <Skeleton />
  if (!user) return <Skeleton />

  return (
    <div className="min-h-screen bg-transparent text-white p-4">
      <div className="max-w-4xl mx-auto">
        <UserHeader
          user={user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          isCurrentUser={isCurrentUser}
          isFollowingLoading={isFollowingLoading}
        />
        <div className="mt-8">
          <div className="flex space-x-4 mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-4 ${
                activeTab === 'posts'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('followed')}
              className={`pb-2 px-4 ${
                activeTab === 'followed'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Followed Users
            </button>
          </div>
          {activeTab === 'posts' && (
            <div>
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
          )}
          {activeTab === 'followed' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Followed</h2>
              <ul className="space-y-2">
                {followedUsers.map((followed) => (
                  <li key={followed} className="bg-zinc-800 p-4 rounded-lg">
                    <Link to={`/user/${followed}`} className="text-white hover:text-amber-300">
                      {followed}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}