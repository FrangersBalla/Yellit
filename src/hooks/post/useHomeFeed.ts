import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toggleLike, getLikeCount, isLikedByUser, GlobalFeed } from '../../services/postServices'
import type { Post } from '../../types/post'
import type { User } from '../../types/Type'
import { DocumentSnapshot } from 'firebase/firestore'

interface UseHomeFeedResult {
  posts: Post[]
  loading: boolean
  isProcessing: boolean
  loadingMore: boolean
  likedByUser: (post: Post) => boolean
  likeCount: (post: Post) => number
  handleToggleLike: (postId: string) => Promise<void>
  loadMore: () => Promise<void>
  handleViewPost: (postId: string, navigate: (path: string) => void) => void
}

export const HOME_SCROLL_STORAGE_KEY = 'homeScroll'

export const useHomeFeed = (currentUser: User | null): UseHomeFeedResult => {
  const location = useLocation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [last, setLast] = useState<DocumentSnapshot | null>(null)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})

  /* 
    useCallback per non ricreare ogni volta loadLikeData
    chiamo loadLikeData al caricamento della pagina e quando carico ulteriori post
  */
  const loadLikeData = useCallback(async (posts: Post[]) => {
    if (!currentUser?.uid) return //se l'utente non è ancora loggato o deve caricare
    const counts: Record<string, number> = {}
    const liked: Record<string, boolean> = {}
    for (const post of posts) {
      counts[post.id!] = await getLikeCount(post.id!)
      liked[post.id!] = await isLikedByUser(post.id!, currentUser.uid)
    }

    setLikeCounts(prev => ({ ...prev, ...counts }))
    setIsLiked(prev => ({ ...prev, ...liked }))
  }, [currentUser?.uid]) 

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true)
      //salvo i primi 10 post e l'ultimo post per sapere dove sono arrivato
      const { posts: feed, last: p } = await GlobalFeed()
      setPosts(feed)
      setLast(p)
      await loadLikeData(feed)
      setLoading(false) //skeleton disattivato
    }

    fetchFeed()
  }, [loadLikeData]) //cambio utente o mount iniziale (quando viene ricreata loadLikeData)

  useEffect(() => {
    // recupero la pos dello scroll quando torno in home da /post/${postId}
    if (loading || location.pathname != '/') return

    const savedScroll = sessionStorage.getItem(HOME_SCROLL_STORAGE_KEY)
    if (savedScroll) {
      setTimeout(() => {
        //ripristiono il mio <body> scrollabile
        document.body.scrollTop = Number(savedScroll)
        sessionStorage.removeItem(HOME_SCROLL_STORAGE_KEY)
      }, 100)
    }
  }, [loading, location.pathname])

  // useCallback solo per buona prassi ed evitare di ricreare le funzioni
  const likedByUser = useCallback(
    (post: Post) => isLiked[post.id!] || false,
    [isLiked]
  )
  const likeCount = useCallback(
    (post: Post) => likeCounts[post.id!] || 0,
    [likeCounts]
  )

  const handleToggleLike = useCallback(
    async (postId: string) => {
      if (!currentUser || isProcessing) return

      const post = posts.find(p => p.id == postId)
      if (!post) return

      setIsProcessing(true)

      try {
        // salvo il like nel db
        await toggleLike(postId, currentUser.uid, post.name, currentUser.userName!)
        const wasLiked = isLiked[postId] || false
        // per evitare di richiamare loadLikeData
        setIsLiked(prev => ({ ...prev, [postId]: !wasLiked }))
        setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }))
      } catch (e) {
      } finally {
        setIsProcessing(false)
      }
    },
    [currentUser, isProcessing, posts, isLiked, likeCounts]
  )

  // salvo la posizione dello scroll
  const handleViewPost = useCallback(
    (postId: string, navigate: (path: string) => void) => {
      sessionStorage.setItem(HOME_SCROLL_STORAGE_KEY, String(document.body.scrollTop))
      navigate(`/post/${postId}`)
    },
    []
  )

  const loadMore = useCallback(async () => {
    if (!last || loadingMore) return //se sto gia caricando oppure non ci sono altri post
    setLoadingMore(true)
    //incremento il feed e chiamo loadLikeData sui nuovi post
    const { posts: newPosts, last: p } = await GlobalFeed(last)
    setPosts(prev => [...prev, ...newPosts])
    setLast(p)
    await loadLikeData(newPosts)

    setLoadingMore(false)
  }, [last, loadingMore, loadLikeData])

  return {
    posts,
    loading,
    isProcessing,
    loadingMore,
    likedByUser,
    likeCount,
    handleToggleLike,
    loadMore,
    handleViewPost,
  }
}
