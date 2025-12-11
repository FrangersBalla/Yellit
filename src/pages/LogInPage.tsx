import { useState, useEffect } from 'react'
import { EmailExist } from '../services/authServices'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [exists, setExists] = useState<boolean | null>(null)
  const [provider, setProvider] = useState('')
  const navigate = useNavigate()
  const {loginWithGoogle, currentUser} = useAuth()
  const {loading} = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

/************/
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    const validateErr = validateEmail(val)

    if (validateErr) {
      setError(validateErr)
      setExists(null)
      return
    }

    setError('')
    const isRegistered = await EmailExist(val)
    setProvider(isRegistered)
    setExists(isRegistered.length > 0 ? true : false)
  }

/************/
  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return

    e.preventDefault()

    const val = email.trim()

    const validateErr = await validateEmail(val)
    if (validateErr) {
      setError(validateErr)
      setExists(null)
      return
    }

    setError("")

    const isRegistered = await EmailExist(val)

    setProvider(isRegistered)
    setExists(isRegistered.length > 0)
  }

/************/
  const validateEmail = (val: string) => {
    if (!val) return 'Email required'
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(val)) return 'Invalid format'
    return ""
  }

/************/
  const Join = async () => {
    const err = await loginWithGoogle(email)
    if (err) {
      setError('LogIn failed')
    } else {
      navigate('/')
    }
  }

/************/
  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/images/yellitBg.png"
        alt="talk"
        className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full lg:w-3/5 h-3/5 z-10"
      />

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      
      <h1 className='text-amber-200 text-xl font-medium'>Start by entering your email</h1>

      <div className="w-80">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
          className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md select-text
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
          aria-invalid={!!error}
        />

        {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </div>

      {exists != null && !error && (
        <div className='flex flex-col gap-3 mt-2'>
          {exists ? (<>
            <button className='px-4 py-2 rounded-full bg-amber-300 text-zinc-900 text-sm'
            disabled={loading}
            onClick={Join}>
              {loading? 'Loading...' : 'Login with' + provider}
            </button>
          </>) : (
            <>
            <p className="font-medium text-amber-200 text-md">email not found</p>
            <button className='px-4 py-2 rounded-full bg-emerald-400 text-zinc-900 text-sm'
              onClick={()=>navigate('/singUp')}
            >
              Register
            </button>
          </>)}
        </div>
      )}
      {exists == null && <Link
        to="/singUp" 
        className="text-amber-200 underline"
      >
        or Register
      </Link>}
      </div>
    </div>
  )
}
