import { useState } from 'react'
import { UserExist, EmailExist } from '../services/authServices'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'


export default function SignUp() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('')
  const [errorUsername, setErrorUsername] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [exists, setExists] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const { signUpWithGoogle, loading } = useAuth()
  const { t } = useTranslation()


  // Funzione interna per validare username
  const validateUsername = async (val: string) => {
    if (val.length < 3) return t("usernameTooShort")
    if (val.length > 20) return t("usernameTooLong")
    if (!/^[a-z0-9_]+$/.test(val))
      return t("usernameInvalid")
    const exists = await UserExist(val)
    if (exists) return t("usernameTaken")
    return ""
  }

  const validateEmail = (val: string) => {
    if (!val) return t("emailRequired")
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(val)) return t("invalidEmail")
    return ""
  }

  const handleNextUsername = async () => {
    const err = await validateUsername(username.trim())
    setErrorUsername(err)
    if (!err) setStep(2)
  }

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    const validateErr = validateEmail(val)

    if (validateErr) {
      setErrorEmail(validateErr)
      setExists(null)
      return
    }

    setErrorEmail('')
    const isRegistered = await EmailExist(val)
    setExists(isRegistered.length > 0)
  }

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return

    e.preventDefault()

    const val = email.trim()

    const validateErr = validateEmail(val)
    if (validateErr) {
      setErrorEmail(validateErr)
      setExists(null)
      return
    }

    setErrorEmail("")

    const isRegistered = await EmailExist(val)
    setExists(isRegistered.length > 0)
  }

  const handleSignUpWithGoogle = async () => {
    const err = await signUpWithGoogle(email, username, language)
    if (err) {
      setErrorEmail(t("signUpFailed"))
    } else {
      navigate('/')
    }
  }


  return (
    <form
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-amber-200 text-xl font-medium">{t("signUp")}</h1>
      </div>

      {step == 1 && (
        <div className="w-80">
          <label className="block text-sm text-white mb-1">{t("username")}</label>
          <input
            type='text'
            placeholder='Choose your username...'
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleNextUsername()
              }
            }}
            className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md select-text
              focus:outline-none focus:ring-2 
              ${errorUsername ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
          />
          {errorUsername && (
            <p className="mt-1 text-red-500 text-xs">{errorUsername}</p>
          )}
          <div className="flex gap-2 mt-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-full text-zinc-900 text-sm bg-gray-300"
              >
                {t("back")}
              </button>
            )}
            <button
              type="button"
              onClick={handleNextUsername}
              disabled={!username}
              className={`px-4 py-2 rounded-full text-zinc-900 text-sm
                ${username ? 'bg-amber-300' : 'bg-zinc-700 cursor-not-allowed'}`}
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {step == 2 && (
        <div className="w-80 flex flex-col gap-3">
          <label className="block text-sm text-white mb-1">{t("selectLanguage")}</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">{t("choose")}</option>
            <option value="it">{t("italian")}</option>
            <option value="en">{t("english")}</option>
          </select>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-full text-zinc-900 text-sm bg-gray-300"
            >
              {t("back")}
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!language}
              className={`px-4 py-2 rounded-full text-zinc-900 text-sm
                ${language ? 'bg-amber-300' : 'bg-zinc-700 cursor-not-allowed'}`}
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {step == 3 && (
        <div className="w-80">
          <label className="block text-sm text-white mb-1">{t("email")}</label>
          <input
            type="email"
            placeholder='Your email...'
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleEnter}
            className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md select-text
              focus:outline-none focus:ring-2 
              ${errorEmail ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
            aria-invalid={!!errorEmail}
          />
          {errorEmail && <p className="mt-1 text-red-500 text-xs">{errorEmail}</p>}
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-3 px-4 py-2 rounded-full text-zinc-900 text-sm bg-gray-300"
          >
            {t("back")}
          </button>
        </div>
      )}

      {step == 3 && exists != null && !errorEmail && (
        <div className='flex flex-col gap-3 mt-2'>
          {exists ? (
            <p className="font-medium text-red-500 text-md">{t("emailAlreadyRegistered")}</p>
          ) : (
            <button
              className='px-4 py-2 rounded-full bg-amber-300 text-zinc-900 text-sm'
              disabled={loading}
              onClick={handleSignUpWithGoogle}
            >
              {loading ? 'Loading...' : t("signUpWithGoogle")}
            </button>
          )}
        </div>
      )}

      <Link
        to="/LogIn"
        className="text-amber-200 underline hover:text-amber-400 transition mt-4"
      >
        {t("backToLogin")}
      </Link>
    </form>
  )
}
