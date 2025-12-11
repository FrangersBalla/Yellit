import { useState, useCallback } from 'react'
import LingvaTranslateWithDetect from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'

interface UseCommentTranslateResult {
  translation: string
  translating: boolean
  translated: boolean
  handleTranslate: () => Promise<void>
}

export const useCommentTranslate = (commentText: string): UseCommentTranslateResult => {
  const { currentUser } = useAuth()
  const [translation, setTranslation] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translated, setTranslated] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (!translated) {
      if (!commentText.trim()) return
      setTranslating(true)
      const [result, _] = await LingvaTranslateWithDetect(commentText, currentUser?.language?? 'en')
      setTranslation(result)
      setTranslating(false)
      setTranslated(true)
    } else setTranslated(false)
  }, [translated, commentText, currentUser?.language])

  return {
    translation,
    translating,
    translated,
    handleTranslate
  }
}