import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent, FormEvent, FC } from 'react'

interface CommentInputBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void | Promise<void>
  disabled: boolean
}

export const CommentInputBar: FC<CommentInputBarProps> = ({ value, onChange, onSubmit, disabled}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { t } = useTranslation()

  const adjustHeight = (textareaElement?: HTMLTextAreaElement) => {
    const textarea = textareaElement || textareaRef.current
    if (!textarea) return

    textarea.style.lineHeight = '1.5em' // 1.5 volte il font
    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight

    // altezza massima = 1.5 * fontsize(..16px circa) * 5 righe
    const maxHeight = 120 //px
    // imposto l'altezza
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`

    // overflow se il contenuto supera l'altezza massima
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight(event.target)
    onChange(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }



  return (
    <form
      onSubmit={handleSubmit}
      className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2  mx-auto lg:ml-24 pb-8 z-40 w-9/10 lg:w-140 bg-transparent
      `}
    >
      <div className="flex gap-2 items-end">
        <textarea
          placeholder={t('writeComment')}
          ref={textareaRef}
          className={
            `flex-1 p-3 select-text
            rounded-3xl bg-zinc-800 outline-none focus:outline
            ${disabled ? "" : "focus:ring-4 focus:ring-zinc-700"}
            text-white text-sm 
            transition resize-none overflow-hidden
          `}
          rows={1}
          value={value}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={disabled}
          className={`
            bg-amber-300
            text-black 
            font-medium 
            px-3 py-2 
            rounded-full 
            transition 
            whitespace-nowrap
            disabled:cursor-not-allowed
          `}
        >
          <img src="/icons/send.svg" alt="Back" className="w-6 h-7" />
        </button>
      </div>
    </form>
  )
}
