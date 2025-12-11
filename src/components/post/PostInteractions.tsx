import type { FC } from 'react'
import { useState, useRef } from 'react'
import { shareOnWhatsApp, shareOnTelegram, shareOnReddit, shareOnSMS, copyLink } from '../../utils/shareUtils'

interface PostInteractionsProps {
  reactionsCount: number
  liked: boolean
  disabled: boolean
  onToggleLike: () => void | Promise<void>
  onTranslate?: () => void
  translating?: boolean
  translated?: boolean
  postTitle: string
  postId: string
}

export const PostInteractions: FC<PostInteractionsProps> = ({ reactionsCount, liked, disabled, onToggleLike, onTranslate, translating, translated, postTitle, postId }) => {
  const [shareTableOpen, setShareTableOpen] = useState(false)
  const shareTableRef = useRef<HTMLDivElement>(null)

  const postUrl = `${window.location.origin}/post/${postId}`


  const handleShare = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        shareOnWhatsApp(postTitle, postUrl)
        break
      case 'telegram':
        shareOnTelegram(postTitle, postUrl)
        break
      case 'reddit':
        shareOnReddit(postTitle, postUrl)
        break
      case 'sms':
        shareOnSMS(postTitle, postUrl)
        break
      case 'copy':
        copyLink(postUrl)
        break
    }
    setShareTableOpen(false)
  }

  return (
    <div className="flex gap-2 flex-wrap font-thin text-sm mb-6">
      <div className="bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl transition">
        <div
          onClick={onToggleLike}
          className="flex items-center gap-2 cursor-pointer"
          style={{ touchAction: 'manipulation' }}
          aria-label="Like post"
        >
          <img
            src="/icons/like.svg"
            alt="Like"
            className={`w-5 h-5 ${liked ? 'invert' : ''} transition`}
          />
          {reactionsCount}
        </div>
      </div>

      {onTranslate && (
        <div className="bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl transition">
          <div
            onClick={disabled ? undefined : onTranslate}
            className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            style={{ touchAction: 'manipulation' }}
            aria-label="Translate post"
          >
            {translated ? 'See Original' : translating ? 'Translating...' : 'Translate'}
          </div>
        </div>
      )}

      <div ref={shareTableRef} className="relative">
        <div className="bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl transition">
          <div
            onClick={disabled ? undefined : () => setShareTableOpen(prev => !prev)}
            className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            style={{ touchAction: 'manipulation' }}
            aria-label="Share post"
          >
            Share
          </div>
        </div>

        {shareTableOpen && (
          <div className="absolute top-full mt-1 bg-black border border-none rounded-2xl z-10 min-w-[150px]">
            <div
              onClick={() => handleShare('whatsapp')}
              className="w-full rounded-2xl text-left px-3 py-2 hover:bg-amber-300 hover:text-black transition cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              WhatsApp
            </div>
            <div
              onClick={() => handleShare('telegram')}
              className="w-full rounded-2xl text-left px-3 py-2 hover:bg-amber-300 hover:text-black transition cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              Telegram
            </div>
            <div
              onClick={() => handleShare('reddit')}
              className="w-full rounded-2xl text-left px-3 py-2 hover:bg-amber-300 hover:text-black transition cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              Reddit
            </div>
            <div
              onClick={() => handleShare('sms')}
              className="w-full rounded-2xl text-left px-3 py-2 hover:bg-amber-300 hover:text-black transition cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              SMS
            </div>
            <div
              onClick={() => handleShare('copy')}
              className="w-full rounded-2xl text-left px-3 py-2 hover:bg-amber-300 hover:text-black transition cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              Copy Link
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
