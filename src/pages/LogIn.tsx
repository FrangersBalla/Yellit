import { useState } from 'react'
import { UserExist } from '../services/authServices'
import { Link, useNavigate } from 'react-router-dom'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [exists, setExists] = useState<boolean | null>(null)
  const [provider, setProvider] = useState('')
  const navigate = useNavigate()

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    const validateErr = validateEmail(val)

    if (validateErr) {
      setError(validateErr)
      setExists(null)
      return
    }

    setError('')
    const isRegistered = await UserExist(val)
    setProvider(isRegistered)
    setExists(isRegistered.length > 0 ? true : false)
  }

  const validateEmail = (val: string) => {
    if (!val) return 'Email required'
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(val)) return 'Invalid email format'
    return ""
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6'>

      <h1 className='text-amber-200 text-xl font-medium'>Welcome</h1>

      <div className="w-80">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
          aria-invalid={!!error}
        />

        {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </div>

      {exists != null && !error && (
        <div className='flex flex-col gap-3 mt-2'>
          {exists ? (
            <button className='px-4 py-2 rounded-full bg-amber-300 text-zinc-900 text-sm'>
              Login with {provider}
            </button>
          ) : (
            <>
            <p className="font-medium text-amber-200 text-md">email not found</p>
            <button className='px-4 py-2 rounded-full bg-emerald-400 text-zinc-900 text-sm'
              onClick={()=>navigate('/')}
            >
              Register
            </button>
          </>)}
        </div>
      )}
      <Link
        to="/" 
        className="text-amber-200 underline hover:text-amber-400 transition"
      >
        back to home
      </Link>
    </div>
  )
}
