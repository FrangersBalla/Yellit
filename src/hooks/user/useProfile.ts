import { useCallback, useEffect, useState } from 'react'
import type { Post } from '../../types/post'
import { useAuth } from '../../context/AuthContext'
import { getPostsByUserName, toggleLike as toggleLikeService, getLikeCount, isLikedByUser, deletePost } from '../../services/postServices'
import { getFollowingUsers, getFollowers } from '../../services/followerServices'
import { getUserNamesByUids } from '../../services/userServices'
import { updateUserLanguage, updateUserNotify } from '../../services/authServices'
import { useTranslation } from 'react-i18next'

export const useProfile = () => {
  const { currentUser } = useAuth()
  const { i18n } = useTranslation()

  const [posts, setPosts] = useState<Post[]>([])
  const [followedUsers, setFollowedUsers] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([]) 
  const [loading, setLoading] = useState(true)

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})

  const [isChangingLanguage, setIsChangingLanguage] = useState(false) // loading per cambio lingua
  const [isChangingNotify, setIsChangingNotify] = useState(false) // loading per cambio notifiche

/****************/

  const loadLikeData = useCallback(async (posts: Post[]) => {
    if (!currentUser?.uid) return
    const counts: Record<string, number> = {}
    const liked: Record<string, boolean> = {}
    for (const post of posts) {
      counts[post.id!] = await getLikeCount(post.id!)
      liked[post.id!] = await isLikedByUser(post.id!, currentUser.uid)
    }
    setLikeCounts(counts)
    setIsLiked(liked)
  }, [currentUser?.uid])

  // fetch post utente
  const fetchUserPosts = useCallback(async () => {
    if (!currentUser?.userName) return []
    const userPosts = await getPostsByUserName(currentUser.userName)
    setPosts(userPosts)
    await loadLikeData(userPosts)
    return userPosts
  }, [currentUser?.userName, loadLikeData])

  // fetch seguiti
  const fetchFollowedUsers = useCallback(async () => {
    if (!currentUser?.uid) return []
    const followed = await getFollowingUsers(currentUser.uid)
    setFollowedUsers(followed)
    return followed
  }, [currentUser?.uid])

  // fetch follower
  const fetchFollowers = useCallback(async () => {
    if (!currentUser?.uid) return []
    const followersUids = await getFollowers(currentUser.uid)
    const followersNames = await getUserNamesByUids(followersUids)
    setFollowers(followersNames)
    return followersNames
  }, [currentUser?.uid])

/********************/

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.userName) {
        setLoading(false)
        return
      }
      setLoading(true)

      await Promise.all([ // carico i dati in parallelo con Promise.all
        fetchUserPosts(),
        fetchFollowedUsers(),
        fetchFollowers()
      ])
      setLoading(false)
    }

    fetchProfileData()
  }, [currentUser?.userName, fetchUserPosts, fetchFollowedUsers, fetchFollowers])

/****************/

  const toggleLike = useCallback(async (postId: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id === postId)
    if (!post) return
    try {
      await toggleLikeService(postId, currentUser.uid!, post.name, currentUser.userName!)
      const wasLiked = isLiked[postId] || false
      setIsLiked(prev => ({ ...prev, [postId]: !wasLiked }))
      setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }))
    } catch (e) {
      console.log(e)
    }
  }, [currentUser, posts, isLiked, likeCounts])

  const likedByUser = useCallback((post: Post) => isLiked[post.id!] || false, [isLiked])
  const likeCount = useCallback((post: Post) => likeCounts[post.id!] || 0, [likeCounts])

  const handleDeletePost = useCallback(async (postId: string) => {
    if (!currentUser?.uid) return
    try {
      await deletePost(postId, currentUser.uid)
      setPosts(prev => prev.filter(p => p.id != postId)) //lo elimino da array locale
    } catch (e) {
      console.log(e)
    }
  }, [currentUser?.uid])

  // cambio lingua con libreria i18n + db
  const handleChangeLanguage = useCallback(async (language: string) => {
    if (!currentUser?.uid) return
    setIsChangingLanguage(true)
    try {
      await updateUserLanguage(currentUser.uid, language)
      i18n.changeLanguage(language)
      window.location.reload()
    } catch (e) {
      console.log(e)
    } finally {
      setIsChangingLanguage(false)
    }
  }, [currentUser?.uid, i18n])

  const handleChangeNotify = useCallback(async (notify: boolean) => {
    if (!currentUser?.uid) return
    setIsChangingNotify(true)
    try {
      await updateUserNotify(currentUser.uid, notify)
    } catch (e) {
      console.log(e)
    } finally {
      setIsChangingNotify(false)
    }
  }, [currentUser?.uid])

/****************/

  return {
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
  }
}