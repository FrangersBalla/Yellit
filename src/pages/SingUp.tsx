import { useState } from 'react'
import { UserExist, SingUpOndb } from '../services/authServices'
import { Link } from 'react-router-dom'

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('')
  const [errorUsername, setErrorUsername] = useState('')
  const [errorEmail, setErrorEmail] = useState('')

  // Funzione interna per validare username
  const validateUsername = async (val: string) => {
    if (val.length < 3) return "Username too short"
    if (val.length > 20) return "Username too long"
    if (!/^[a-z0-9_]+$/.test(val))
      return "Username can only contain lowercase letters, numbers, or underscores (_)"
    const exists = await UserExist(val)
    if (exists.length > 0) return "Username already taken"
    return ""
  }

  const validateEmail = async (val: string) => {
    if (!val) return "Email required"
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(val)) return "Invalid email format"
    const exists = await UserExist(val)
    if (exists.length > 0) return "Username already taken"
    return ""
  }

  const handleNextUsername = async () => {
    const err = await validateUsername(username.trim())
    setErrorUsername(err)
    if (!err) setStep(2)
  }

  const handleNextEmail = async () => {
    const err = await validateEmail(email.trim())
    setErrorEmail(err)
    if (!err) setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await SingUpOndb(username, email, language)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex flex-col items-center justify-center gap-6"
    >
      <h1 className="text-amber-200 text-xl font-medium">Sign Up</h1>

      {step == 1 && (
        <div className="w-80">
          <label className="block text-sm text-white mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md
              focus:outline-none focus:ring-2 
              ${errorUsername ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
          />
          {errorUsername && (
            <p className="mt-1 text-red-500 text-xs">{errorUsername}</p>
          )}
          <button
            type="button"
            onClick={handleNextUsername}
            disabled={!username}
            className={`mt-3 px-4 py-2 rounded-full text-zinc-900 text-sm
              ${username ? 'bg-amber-300' : 'bg-zinc-700 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      )}

      {step == 2 && (
        <div className="w-80">
          <label className="block text-sm text-white mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md
              focus:outline-none focus:ring-2 
              ${errorEmail ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
          />
          {errorEmail && <p className="mt-1 text-red-500 text-xs">{errorEmail}</p>}
          <button
            type="button"
            onClick={handleNextEmail}
            disabled={!email}
            className={`mt-3 px-4 py-2 rounded-full text-zinc-900 text-sm
              ${email ? 'bg-amber-300' : 'bg-zinc-700 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      )}

    {step == 3 && (
      <div className="w-80 flex flex-col gap-3">
        <label className="block text-sm text-white mb-1">Select Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-zinc-800 text-white text-md focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <option value="">-- Choose --</option>
          <option value="it">Italiano</option>
          <option value="en">English</option>
        </select>

        <button
          type="button"
          disabled={!language}
          className={`mt-3 px-4 py-2 rounded-full text-zinc-900 text-sm
            ${language ? 'bg-amber-300' : 'bg-zinc-700 cursor-not-allowed'}`}
        >
          Sign Up with Google
        </button>
      </div>
      )}

      <Link
        to="/LogIn"
        className="text-amber-200 underline hover:text-amber-400 transition mt-4"
      >
        Back to Home
      </Link>
    </form>
  )
}
