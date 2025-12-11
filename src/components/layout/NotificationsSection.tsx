import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useNotifications } from "../../hooks/useNotifications"

interface NotificationsSectionProps {
  onCloseSidebar?: () => void
}

const NotificationsSection = ({ onCloseSidebar }: NotificationsSectionProps) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()
  const { notifications, Read } = useNotifications()
  const { t } = useTranslation()

  const handleClick = async (notification: any) => {
    if (!notification.readed && notification.id) {
      await Read(notification.id)
    }
    navigate(`/post/${notification.postId}`)
    onCloseSidebar?.()
  }

  const unreadCount = notifications.filter(n => !n.readed).length

  return (
    <>
      <div className="px-4 pb-2">
        <button
          onClick={() => setShowNotifications(s => !s)}
          aria-expanded={showNotifications}
          className="w-full text-left bg-zinc-800 text-white px-3 py-2 rounded-full font-medium shadow-sm flex items-center justify-between"
        >
          <span>{showNotifications ? t('hideNotifications') : t('showNotifications')}</span>
          <span className={
            `ml-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-semibold ` +
            (unreadCount > 0 ? 'bg-amber-300/80 text-black' : 'transparent')
          }>
            {unreadCount}
          </span>
        </button>
      </div>

      {showNotifications && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className="w-full text-left p-2 pr-4 rounded-full text-sm transition cursor-pointer hover:bg-zinc-700 text-white font-medium"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                <span>{n.action}</span>
              </div>
            </button>
            )
          )}
        </div>
      )}
    </>
  )
}

export default NotificationsSection