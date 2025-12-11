import type { FC } from 'react'
import { parseMarkdown } from '../../utils/parseMarkdown'

interface PostContentProps {
  title?: string
  content?: string
  translated?: boolean
  translatedTitle?: string
  translation?: string
}

export const PostContent: FC<PostContentProps> = ({ title, content, translated, translatedTitle, translation }) => {
  const displayTitle = translated ? translatedTitle : title
  const displayContent = translated ? translation : content

  const parsedTitle = displayTitle ? parseMarkdown(displayTitle) : []
  const parsedContent = displayContent ? parseMarkdown(displayContent) : []

  return (
    <div className="mb-8">
      <h1 className="mb-6 text-3xl text-left font-semibold break-words">{parsedTitle}</h1>
      <p className="mb-8 text-left whitespace-pre-wrap leading-relaxed break-words">{parsedContent}</p>
    </div>
  )
}
