import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileHeader } from '../components/user/ProfileHeader'
import { PostCard } from '../components/post/PostCard'
import { Skeleton } from '../components/skeleton/Skeleton'
import { useProfile } from '../hooks/user/useProfile'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import WeeklyStats from '../components/user/WeeklyStats'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'posts' | 'followed' | 'followers' | 'stats'>('posts')
  const { t } = useTranslation()

  const {
    posts,
    followedUsers,
    followers,
    loading,
    toggleLike,
    likedByUser,
    likeCount,
    handleDeletePost,
    handleChangeLanguage,
    handleChangeNotify,
    isChangingLanguage,
    isChangingNotify,
  } = useProfile()

  if (authLoading) return <Skeleton />
  if (!currentUser) return <div className="text-white">{t("mustBeLoggedIn")}</div>

  if (loading) return <Skeleton />

  return (
    <div className="min-h-screen bg-transparent text-white p-4">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          user={currentUser}
          onChangeLanguage={handleChangeLanguage}
          onChangeNotify={handleChangeNotify}
          disabled={isChangingLanguage || isChangingNotify}
        />
        <div className="mt-8">
          <div className="flex space-x-4 mb-4 border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab == 'posts'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t("yourPosts")}
            </button>
            <button
              onClick={() => setActiveTab('followed')}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab == 'followed'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t("usersYouFollow")}
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab == 'followers'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t("followedBy")}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab == 'stats'
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('stats')}
            </button>
          </div>
          {activeTab == 'posts' && (
            <div>
              <h2 className="text-xl font-bold mb-4">{t("yourPosts")}</h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4">
                    <div className="flex-1">
                      <PostCard
                        post={post}
                        disabled={false}
                        onView={(id) => navigate(`/post/${id}`)}
                        onToggleLike={toggleLike}
                        likedByUser={likedByUser}
                        likeCount={likeCount}
                      />
                    </div>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: t('confirmDeleteTitle'),
                          text: t('confirmDeleteText'),
                          showCancelButton: true,
                          confirmButtonText: t('confirmDeleteConfirm'),
                          cancelButtonText: t('confirmDeleteCancel')
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDeletePost(post.id!)
                          }
                        })
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                      title={t("deletePost")}
                    >
                      <img src="/icons/delete.svg" alt="Delete" className="w-6 h-6 mt-12 invert" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab == 'followed' && (
            <div>
              <h2 className="text-xl font-bold mb-4">{t("usersYouFollow")}</h2>
              <ul className="space-y-2">
                {followedUsers.map((followed) => (
                  <li key={followed} className="bg-zinc-800/80 p-4 rounded-3xl">
                    <Link to={`/user/${followed}`} className="text-white hover:text-amber-300">
                      {followed}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab == 'followers' && (
            <div>
              <h2 className="text-xl font-bold mb-4">{t("followedBy")}</h2>
              <ul className="space-y-2">
                {followers.map((follower) => (
                  <li key={follower} className="bg-zinc-800/80 p-4 rounded-3xl">
                    <Link to={`/user/${follower}`} className="text-white hover:text-amber-300">
                      {follower}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab == 'stats' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Stats</h2>
              <WeeklyStats />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}