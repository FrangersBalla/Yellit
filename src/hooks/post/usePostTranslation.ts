import { useState, useCallback } from 'react'
import LingvaTranslateWithDetect from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'

interface Post {
  title: string
  content: string
}

interface UsePostTranslationResult {
  translation: string
  translatedTitle: string
  translateLoading: boolean
  translated: boolean
  handleTranslate: () => Promise<void>
}

export const usePostTranslation = (post: Post | null): UsePostTranslationResult => {
  const { currentUser } = useAuth()
  const [translation, setTranslation] = useState('')
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translateLoading, setTranslateLoading] = useState(false)
  const [translated, setTranslated] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (!translated) {
      if (!post?.content.trim()) return
      setTranslateLoading(true)

      const [result, languageDetected] = await LingvaTranslateWithDetect(post.content, currentUser?.language?? 'en')
      const [title, _] = await LingvaTranslateWithDetect(post.title, currentUser?.language?? 'en', languageDetected)

      setTranslation(result)
      setTranslatedTitle(title)
      setTranslateLoading(false)
    
      setTranslated(true)
    } else setTranslated(false)
  }, [translated, post, currentUser?.language])

  return {
    translation,
    translatedTitle,
    translateLoading,
    translated,
    handleTranslate
  }
}