import { useRef } from 'react'

interface PostInputProps {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
}

export const PostInput = ({ title, setTitle, content, setContent }: PostInputProps) => {
  const contentRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="w-full bg-black/90 flex flex-col rounded-lg overflow-hidden">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            e.preventDefault()
            contentRef.current?.focus()
          }
        }}
        placeholder="Title 🍃"
        className="w-full pt-8 px-4 py-4 text-3xl font-medium bg-transparent text-white 
                  border-none outline-none placeholder:text-zinc-400 focus:outline-none 
                  focus:ring-0 focus:border-none select-text rounded-t-lg rounded-b-none"
        maxLength={120}
        autoFocus
      />
      <textarea
        ref={contentRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter' && !e.shiftKey) {
          }
        }}
        placeholder={`Say like you mean it!!!





**bold**
__italic__
[text](http://example.com)
@mention`}
        className="w-full pt-1 px-4 py-4 text-lg bg-transparent text-white border-none outline-none placeholder:text-zinc-400 
                  focus:outline-none focus:ring-0 focus:border-none resize-vertical select-text rounded-b-lg rounded-t-none min-h-[300px]"
      />
    </div>
  )
}