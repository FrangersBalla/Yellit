import { useState, useEffect } from 'react'
import { searchPostsByTitle, toggleLike, getLikeCount, isLikedByUser } from '../services/postServices'
import { getUserByUsername } from '../services/userServices'
import { searchTopicsByName } from '../services/topicServices'
import { useAuth } from '../context/AuthContext'
import type { Post } from '../types/post'
import type { User } from '../types/Type'
import type { Topic } from '../types/topic'

export const useSearch = (q: string, isOnline: boolean) => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [likes, setLikes] = useState<Record<string, {count: number, liked: boolean}>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (q && isOnline) {
      setLoading(true)
      setLikes({})
      const promises = [
        searchPostsByTitle(q).catch(() => []),
        getUserByUsername(q).then(user => user ? [user] : []).catch(() => []),
        searchTopicsByName(q).catch(() => [])
      ]
      Promise.all(promises).then((results) => {
        const [postsResult, usersResult, topicsResult] = results as [Post[], User[], Topic[]]
        setPosts(postsResult)
        setUsers(usersResult)
        setTopics(topicsResult)
        if (currentUser && postsResult.length > 0) {
          const likePromises = postsResult.map(post => 
            Promise.all([getLikeCount(post.id!), isLikedByUser(post.id!, currentUser.uid)]).then(([count, liked]) => ({postId: post.id!, count, liked}))
          )
          Promise.all(likePromises).then(results => {
            const newLikes: Record<string, {count: number, liked: boolean}> = {}
            results.forEach(({postId, count, liked}) => {
              newLikes[postId] = {count, liked}
            })
            setLikes(newLikes)
          }).catch(err => console.error('Failed to fetch likes:', err))
        }
      }).catch(err => {
        console.error('Search failed:', err)
        setPosts([])
        setUsers([])
        setTopics([])
      }).finally(() => setLoading(false))
    } else {
      setPosts([])
      setUsers([])
      setTopics([])
      setLikes({})
    }
  }, [q, isOnline, currentUser])

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id === postId)
    if (!post) return
    try {
      await toggleLike(postId, currentUser.uid, post.name, currentUser.userName!)
      // Update local state
      const current = likes[postId] || {count: 0, liked: false}
      const newLiked = !current.liked
      const newCount = newLiked ? current.count + 1 : current.count - 1
      setLikes(prev => ({...prev, [postId]: {count: newCount, liked: newLiked}}))
    } catch (err) {
      console.error('Toggle like failed:', err)
    }
  }

  return { posts, users, topics, likes, loading, handleToggleLike }
}