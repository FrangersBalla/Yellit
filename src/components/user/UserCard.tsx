import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'

type Props = {
  isMobile?: boolean
  isOpen?: boolean
  onClose: () => void
}

export default function UserCard({ isMobile = false, isOpen = false, onClose }: Props) {
  const { currentUser, logout } = useAuth()
  const { t } = useTranslation()

  const displayName = currentUser?.userName ?? currentUser?.email ?? 'Guest'

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sei sicuro?',
      text: 'Vuoi effettuare il logout?',
      showCancelButton: true,
      confirmButtonText: 'Sì, logout',
      cancelButtonText: 'Annulla',
    })

    if (result.isConfirmed) {
      try {
        await logout()
      } catch (err) {
      }
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-zinc-900/40 to-zinc-800/30 p-3 rounded-xl">
      <div className="flex items-center gap-3">
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{displayName}</p>
          {!isMobile || isOpen ? (
            <Link to="/profile" onClick={onClose} className="text-xs text-zinc-400 hover:text-amber-300">
              {t('viewProfile')}
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleLogout}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-full"
            title="Logout"
          >
            {t('singOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
