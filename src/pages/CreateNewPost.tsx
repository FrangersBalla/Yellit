import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { CreateNewPost } from '../services/postServices'
import { PostInput } from '../components/post/input/PostInput'
import { TopicSelector } from '../components/post/input/TopicSelector'
import { createTopic, getMembersOfTopic } from '../services/topicServices'
import { getFollowers } from '../services/followerServices'
import { getUserNamesByUids } from '../services/userServices'
import { createNotification } from '../services/notificationServices'

export default function CreateNewPostPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return null
  }

  const handlePublish = async () => {
    setError(null)
    if (!title.trim() || !content.trim()) {
      setError('Complete the post!!')
      return
    }

    setIsSaving(true)
    try {

      if (selectedTopic && currentUser.userName) {
        await createTopic(selectedTopic, currentUser.userName)
      }

      const postId = await CreateNewPost(currentUser.userName!, title.trim(), content.trim(), 0, currentUser.uid, selectedTopic || undefined)
      if (!postId) throw new Error('Failed to create post')

      // notifico tutti i follower dell'utente
      const notifyUsers = new Set<string>()
      if (currentUser?.uid) {
        const followerUids = await getFollowers(currentUser.uid)
        const followerNames = await getUserNamesByUids(followerUids)
        followerNames.forEach(name => notifyUsers.add(name))
      }

      // aggiungo gli utenti iscritti al topic se non gia presenti
      if (selectedTopic) {
        const topicMembers = await getMembersOfTopic(selectedTopic)
        topicMembers.forEach((name: string) => notifyUsers.add(name))
      }

      notifyUsers.delete(currentUser.userName!)

      //creo una notifica per ogni user
      for (const userName of notifyUsers) {
        const actionMessage = `${currentUser.userName} posted a new post ${selectedTopic ? ' on ' + selectedTopic : ''}!`
        await createNotification({
          from: currentUser.userName?? '',
          to: userName,
          action: actionMessage,
          postId,
          readed: false,
        })
      }

      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Failed')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-1">
      <div className="w-full max-w-4xl p-3 rounded-xl flex flex-col items-center shadow-2xl bg-black/30">
        <div className="w-full flex items-center justify-between pb-4">
          <h2 className="text-2xl pl-4 font-bold text-white tracking-tight">Start Writing . . .</h2>
        </div>

        <div className="w-full flex flex-col items-center">
          <PostInput title={title} setTitle={setTitle} content={content} setContent={setContent} />
        </div>

        <TopicSelector selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

        {error && <p className="text-red-500 mb-3 text-center mt-4">{error}</p>}

        <div className="flex items-center gap-3 w-full pt-6 justify-end">
          <button type="button" onClick={() => { setTitle(''); setContent(''); setSelectedTopic(null); setError(null) }} className="text-md text-white hover:underline">{t('clear')}</button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-300 to-amber-400 text-black px-8 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition disabled:opacity-60"
          >
            {isSaving ? 'Publishing...' : t('publish')}
          </button>
        </div>
      </div>
    </div>
  )
}
