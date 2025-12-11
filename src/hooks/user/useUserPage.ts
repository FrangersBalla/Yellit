import { useCallback, useEffect, useState } from 'react'
import type { Post } from '../../types/post'
import { useAuth } from '../../context/AuthContext'
import { getUserByUsername } from '../../services/userServices'
import { getPostsByUserName, toggleLike as toggleLikeService, getLikeCount, isLikedByUser } from '../../services/postServices'
import { getFollowingUsers, followUser } from '../../services/followerServices'
import { getFollowedTopics } from '../../services/topicServices'
import type { User } from '../../types/Type'

export const useUserPage = (userName: string | undefined) => {
  const { currentUser } = useAuth()

  const [user, setUser] = useState<any>(null) // dati dell'utente della pagina
  const [posts, setPosts] = useState<Post[]>([]) // post pubblicati dall'utente
  const [followedUsers, setFollowedUsers] = useState<string[]>([]) // utenti seguiti dall'utente della pagina
  const [isFollowing, setIsFollowing] = useState(false) // se l'utente corrente segue questo utente
  const [isFollowingLoading, setIsFollowingLoading] = useState(true) // loading per il controllo follow

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false) // se l'utente non esiste

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({}) // conteggio like per post
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})


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

  // carico i dati dell'utente e i topic a cui è iscritto per userHeader
  const fetchUserData = useCallback(async () => {
    if (!userName) {
      setNotFound(true)
      return
    }

    const userData = await getUserByUsername(userName!)
    if (!userData) {
      setNotFound(true)
      return
    }

    const followedT = await getFollowedTopics(userName!)
    setUser({ ...userData, username: (userData as any).userName, topics: followedT })

    return userData
  }, [userName])

  const fetchUserPosts = useCallback(async () => {
    if (!userName) return []
    //carico i post dell'utente
    const userPosts = await getPostsByUserName(userName!)
    setPosts(userPosts)
    await loadLikeData(userPosts)
    return userPosts
  }, [userName, loadLikeData])


  const fetchFollowedUsers = useCallback(async (userData: any) => {
    if (!currentUser) return []
    // carico gli utenti seguiti dall'utente della pagina
    const followed = await getFollowingUsers((userData as User).uid)
    setFollowedUsers(followed)

    if (currentUser.userName != userName) {
      // controllo se l'utente corrente lo segue (per il tasto follow)
      const currentFollowing = await getFollowingUsers(currentUser.uid)
      setIsFollowing(currentFollowing.includes(userName!))
    }
    setIsFollowingLoading(false)

    return followed
  }, [currentUser, userName])

  // carico tutti i dati dell'utente al mount o cambio username
  useEffect(() => {
    const loadUserPage = async () => {
      setLoading(true)
      setNotFound(false)

      const userData = await fetchUserData()
      if (!userData) {
        setLoading(false)
        return
      }

      // fetch parallelo - carico tutto contemporaneamente
      await Promise.all([
        fetchUserPosts(),
        fetchFollowedUsers(userData)
      ])

      setLoading(false)
    }

    loadUserPage()
  }, [fetchUserData, fetchUserPosts, fetchFollowedUsers])

  // funzione per follow/unfollow dell'utente
  const handleFollow = useCallback(async () => {
    if (!currentUser || !userName || !user) return
    try {
      await followUser(currentUser.uid, userName, user.uid)
      setIsFollowing(!isFollowing) //locale
    } catch (e) {
      console.log(e)
    }
  }, [currentUser, userName, user, isFollowing])


  const toggleLike = useCallback(async (postId: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id == postId)
    if (!post) return
    try {
      await toggleLikeService(postId, currentUser.uid, post.name, currentUser.userName!)
      const wasLiked = isLiked[postId] || false
      setIsLiked(prev => ({ ...prev, [postId]: !wasLiked }))
      setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }))
    } catch (e) {
      console.log(e)
    }
  }, [currentUser, posts, isLiked, likeCounts])

  const likedByUser = useCallback((post: Post) => isLiked[post.id!] || false, [isLiked])
  const likeCount = useCallback((post: Post) => likeCounts[post.id!] || 0, [likeCounts])

  return {
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
    isCurrentUser: currentUser?.userName === userName
  }
}