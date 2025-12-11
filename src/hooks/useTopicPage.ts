import { useCallback, useEffect, useState } from 'react'
import type { Post } from '../types/post'
import { useAuth } from '../context/AuthContext'
import { getTopicById } from '../services/topicServices'
import { getPostsByTopic, toggleLike as toggleLikeService, getLikeCount, isLikedByUser } from '../services/postServices'
import { getFollowedTopics, createTopic, unfollowTopic } from '../services/topicServices'

export const useTopicPage = (topicId: string | undefined) => {
  const { currentUser } = useAuth()

  const [topic, setTopic] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
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

  const fetchTopicData = useCallback(async () => {
    if (!topicId) return

    const topicData = await getTopicById(topicId)
    if (!topicData) {
      setError('not found')
      setLoading(false)
      return
    }
    setTopic(topicData)

    const topicPosts = await getPostsByTopic(topicData.name) //carico i post del topic
    setPosts(topicPosts)
    await loadLikeData(topicPosts)

    if (currentUser) {
      const followedTopics = await getFollowedTopics(currentUser.userName!)
      setIsFollowing(followedTopics.includes(topicData.name)) //controllo se è seguito
    }
  }, [topicId, currentUser, loadLikeData])

  // carico i dati del topic
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchTopicData()
      setLoading(false)
    }

    loadData()
  }, [fetchTopicData])


  const handleFollow = useCallback(async () => {
    if (!currentUser || !topic) return
    try {
      if (isFollowing) {
        await unfollowTopic(topic.name, currentUser.userName!)
      } else {
        await createTopic(topic.name, currentUser.userName!)
      }
      setIsFollowing(!isFollowing)
    } catch (e) {
      console.log(e)
    }
  }, [currentUser, topic, isFollowing])


  const toggleLike = useCallback(async (postId: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id == postId)
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

  return {
    topic,
    posts,
    isFollowing,
    loading,
    error,
    handleFollow,
    toggleLike,
    likedByUser,
    likeCount,
  }
}