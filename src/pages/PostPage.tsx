import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SkeletonSinglePost from '../components/skeleton/SkeletonSinglePost'
import { CommentInputBar } from '../components/post/comment/CommentInputBar'
import { PostHeader } from '../components/post/PostHeader'
import { PostContent } from '../components/post/PostContent'
import { PostInteractions } from '../components/post/PostInteractions'
import { CommentsSection } from '../components/post/comment/CommentsSection'
import { usePostPage } from '../hooks/post/usePostPage'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { usePostTranslation } from '../hooks/post/usePostTranslation'
import { useEffect } from 'react'


export default function PostPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>() //id del post
  const { currentUser } = useAuth()
  const { isOnline } = useOnlineStatus()

  const {
    post,
    comments,
    commentText,
    onCommentChange,
    liked,
    likeCount,
    loading,
    notFound,
    isProcessing,
    handleLike,
    handleCommentSubmit,
  } = usePostPage(id, currentUser)

  const { translation, translatedTitle, translateLoading, translated, handleTranslate } = usePostTranslation(post)

  useEffect(() => {
    if (notFound) { 
      navigate('/not-found') // asincrono
    }
  }, [notFound, navigate])

  if (loading || !isOnline) {
    return <SkeletonSinglePost />
  }

  if (notFound || !post) {
    return null // check
  }


  return (
    <>
      <div className="space-y-2 text-white h-auto m-auto bg-black flex flex-col justify-between select-text select-none rounded-2xl w-14/15 mb-6 p-6">
        <div className="space-y-6">
          <PostHeader
            authorName={post.name}
            createdAt={post.createdAt}
            topic={post.topic}
          />
          <PostContent title={post.title} content={post.content} translated={translated} translatedTitle={translatedTitle} translation={translation} />
          <PostInteractions
            reactionsCount={likeCount}
            liked={liked}
            disabled={isProcessing}
            onToggleLike={handleLike}
            onTranslate={handleTranslate}
            translating={translateLoading}
            translated={translated}
            postTitle={post.title}
            postId={id!}
          />
        </div>
      </div>

      <div className="w-14/15 m-auto pb-20 mb-10">
        <CommentsSection comments={comments} />
      </div>

      <CommentInputBar
        value={commentText}
        onChange={onCommentChange}
        onSubmit={handleCommentSubmit}
        disabled={!commentText.trim() || isProcessing} //disabled se testo vuoto o isProcessing
      />
    </>
  )
}
