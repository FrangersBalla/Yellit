import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { goBackOrHome } from '../../utils/backNavigation'
import type { User } from '../../types/Type'

interface ProfileHeaderProps {
  user: User
  onChangeLanguage: (language: string) => void
  onChangeNotify: (notify: boolean) => void
  disabled?: boolean
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ user, onChangeLanguage, disabled = false }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleBack = () => {
    goBackOrHome(navigate)
  }

  const handleChangeLanguage = () => {
    const newLanguage = user.language === 'en' ? 'it' : 'en'
    onChangeLanguage(newLanguage)
  }


  return (
    <div className="bg-zinc-900/80 p-6 rounded-3xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div className="flex items-start gap-2">
          <div
            onClick={handleBack}
            className="hover:opacity-75 transition py-1 cursor-pointer"
            aria-label="Go back"
            style={{ touchAction: 'manipulation' }}
          >
            <img src="/icons/back.svg" alt="Back" className="w-6 h-6 invert opacity-50" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white mb-2 selectable-text">{user.userName}</p>
            <p className="text-sm text-gray-400 mb-4 selectable-text">{user.email}</p>
            <div className="mb-4">
              <p className="text-lg font-semibold text-amber-200 mb-2">{t('languageLabel')}</p>
              <p className="text-white">{user.language === 'en' ? t('english') : t('italian')}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 sm:mt-0">
          <button
            onClick={handleChangeLanguage}
            disabled={disabled}
            className={`px-4 py-2 bg-amber-300 text-black rounded-full font-small transition hover:bg-amber-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('changeL')}
          </button>
        </div>
      </div>
    </div>
  )
}