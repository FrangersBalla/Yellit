import { useCallback, useEffect, useState } from 'react'
import type { Post } from '../types/post'
import { useAuth } from '../context/AuthContext'
import { getPostsByUserName, toggleLike as toggleLikeService, getLikeCount, isLikedByUser, deletePost } from '../services/postServices'
import { getFollowingUsers, getFollowers } from '../services/followerServices'
import { getUserNamesByUids } from '../services/userServices'

export const useProfile = () => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [followedUsers, setFollowedUsers] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})

  const loadLikeData = useCallback(async (posts: Post[]) => {
    if (!currentUser?.uid) return
    const promises = posts.map(post => 
      Promise.all([getLikeCount(post.id!), isLikedByUser(post.id!, currentUser.uid)]).then(([count, liked]) => ({ id: post.id!, count, liked }))
    )
    const results = await Promise.all(promises)
    const counts: Record<string, number> = {}
    const liked: Record<string, boolean> = {}
    results.forEach(({ id, count, liked: l }) => {
      counts[id] = count
      liked[id] = l
    })
    setLikeCounts(counts)
    setIsLiked(liked)
  }, [currentUser?.uid])

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.userName) {
        setLoading(false)
        return
      }

      try {
        const userPosts = await getPostsByUserName(currentUser.userName)
        setPosts(userPosts)
        await loadLikeData(userPosts)

        const followed = await getFollowingUsers(currentUser.uid)
        setFollowedUsers(followed)

        const followersUids = await getFollowers(currentUser.uid)
        const followersNames = await getUserNamesByUids(followersUids)
        setFollowers(followersNames)
      } catch (err) {
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [currentUser, loadLikeData])

  const toggleLike = async (postId: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id === postId)
    if (!post) return
    try {
      await toggleLikeService(postId, currentUser.uid!, post.name, currentUser.userName!)
      const wasLiked = isLiked[postId] || false
      setIsLiked(prev => ({ ...prev, [postId]: !wasLiked }))
      setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }))
    } catch (err) {
      console.error('Failed to toggle like', err)
    }
  }

  const likedByUser = useCallback((post: Post) => isLiked[post.id!] || false, [isLiked])
  const likeCount = useCallback((post: Post) => likeCounts[post.id!] || 0, [likeCounts])

  const handleDeletePost = async (postId: string) => {
    if (!currentUser?.uid) return
    try {
      await deletePost(postId, currentUser.uid)
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (err) {
      console.error('Failed to delete post', err)
    }
  }

  return {
    posts,
    followedUsers,
    followers,
    loading,
    error,
    toggleLike,
    likedByUser,
    likeCount,
    handleDeletePost,
  }
}