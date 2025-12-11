// Import necessary hooks and services
import { useCallback, useEffect, useState } from 'react'
import { AddComment, toggleLike, GetPostById, isLikedByUser, getLikeCount, ShowComments } from '../../services/postServices'
import type { User } from '../../types/Type'
import type { Post } from '../../types/post'
import type { PostComment } from '../../types/postComment'

// Define the structure of a raw comment, which may have partial data
type RawComment = Partial<PostComment> & { name?: string }

// Define the return type of the usePostPage hook
interface UsePostPageResult {
  post: Post | null
  comments: PostComment[]
  commentText: string
  onCommentChange: (value: string) => void
  liked: boolean
  likeCount: number
  loading: boolean
  notFound: boolean
  isProcessing: boolean
  isInputVisible: boolean
  handleLike: () => Promise<void>
  handleCommentSubmit: () => Promise<void>
}

// Helper function to map raw comment data to the PostComment type
const mapComment = (raw: RawComment): PostComment => ({
  id: raw.id ?? '',
  userName: raw.userName ?? raw.name ?? 'Unknown',
  comment: raw.comment ?? '',
  createdAt: raw.createdAt,
})

// Custom hook to manage the state and logic for a post page
export const usePostPage = (postId: string | undefined, currentUser: User | null): UsePostPageResult => {
  // State variables to manage post data, comments, and UI state
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isInputVisible] = useState(true)

  const userName = currentUser?.userName || 'unknown'

  //useCallback evita di ricreare la funzione ad ogni render (simil useMemo)
  const loadComments = useCallback(async (targetPost: Post) => {
    const fetchedComments = await ShowComments(targetPost)
    setComments(fetchedComments.map(mapComment))
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)

      if (!postId) {
        setPost(null)
        setNotFound(true) // se postId vuoto

        setLoading(false)
        return
      }

      const fetchedPost = await GetPostById(postId)
      if (!fetchedPost) {
        setPost(null)
        setNotFound(true) // se il post è stato eliminato o url errato 404

        setLoading(false)
        return
      }

      setPost(fetchedPost)

      setLiked(await isLikedByUser(postId, currentUser?.uid || '')) 
      setLikeCount(await getLikeCount(postId))
      
      await loadComments(fetchedPost)
      setNotFound(false)

      setLoading(false)
    }

    fetchPost()
  }, [postId, currentUser?.userName, loadComments])


  const handleLike = useCallback(async () => {
    if (!post || !currentUser || isProcessing) return

    setIsProcessing(true)

    try {
      await toggleLike(post.id!, currentUser.uid, post.name, currentUser.userName!)
      const newLiked = !liked
      setLiked(newLiked)
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1) //local
    } catch (e) {
      console.log(e)
    } finally {
      setIsProcessing(false)
    }
  }, [post, currentUser, isProcessing, liked])


  const handleCommentSubmit = useCallback(async () => {
    if (!post || !currentUser || !commentText.trim() || isProcessing) return

    setIsProcessing(true)

    try {
      await AddComment(post, commentText.trim(), userName, currentUser?.uid)
      setCommentText('') //svuoto l'input al submit
      await loadComments(post) //ricarico i commenti per vedere possibili aggiornamenti oltre al commento aggiunto
    } catch (e) {
      console.log(e)
    } finally {
      setIsProcessing(false)
    }
  }, [post, currentUser, commentText, isProcessing, loadComments, userName])

  return {
    post,
    comments,
    commentText,
    onCommentChange: setCommentText,
    liked,
    likeCount,
    loading,
    notFound,
    isProcessing,
    isInputVisible,
    handleLike,
    handleCommentSubmit,
  }
}
