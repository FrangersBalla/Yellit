import { useState } from "react"
import { SingUpOndb, UserExist, LogOut } from "../../01_api/Xauth"

type SingUpProps = {
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>
}

export function SingUp({setSignUp}: SingUpProps) {
  const today = new Date().toISOString().split('T')[0]
  const [userNickName, setUserNickName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [country, setCountry] = useState("")
  const [sex, setSex] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (error) {
      alert("Please fix errors before submitting.")
      return
    }
    await SingUpOndb(userNickName, birthDate, country, sex)
    setSignUp(false)
    window.location.reload()
  }

  const handleLogOut = async ()=>{
    await LogOut()
  }
  
  const validateUsername = async (val: string) => {
    if (val.length < 3) return "Username too short"
    if (val.length > 20) return "Username too long"
    if (!/^[a-z0-9_]+$/.test(val)) return "Username can only contain lowercase letters, numbers, or underscores (_)"
    const exists = await UserExist(val)
    if (exists) return "Username already taken"
    return ""
  }

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    const validationError = await validateUsername(val)
    setError(validationError)
  }

  return (
    <div className="bg-black opacity-75 rounded-xl lg:mr-60 lg:mt-20 p-4 z-50">
      <div className="text-xl font-semibold mb-6 text-white">
        <h1>Welcome,<br /></h1>
        That's your first time here!!
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 rounded-lg mb-2 pb-8" noValidate>
        <div className="px-4 py-5 font-medium text-amber-200">Sign Up</div>

        <div className="px-4 py-4 cursor-pointer">
          <label className="block text-sm text-white mb-1">Username</label>
          <input
            type="text"
            value={userNickName}
            onChange={(e) => setUserNickName(e.target.value)}
            onBlur={handleBlur}
            required
            className={`w-full px-3 py-2 rounded bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-amber-300'}`}
            aria-invalid={!!error}
            aria-describedby="username-error"
          />
          {error && (
            <p id="username-error" className="mt-1 text-red-500 text-xs">
              {error}
            </p>
          )}
        </div>

        <div className="px-4 py-4 cursor-pointer rounded"> 
          <label className="block text-sm text-white mb-1">Country</label> 
          <select value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-3 py-2 rounded bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" > 
            <option value="">Select your continent</option> 
            <option value="Africa">Africa</option>
            <option value="Antarctica">Antarctica</option> 
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option> 
            <option value="North America">North America</option>
            <option value="Oceania">Oceania</option> 
            <option value="South America">South America</option> 
          </select> 
        </div> 

        <div className="px-4 py-4 cursor-pointer rounded">
          <label className="block text-sm text-white mb-1">Age</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
            required min="1925-01-01" max={today}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
        </div>

        <div className="px-4 py-4 cursor-pointer rounded">
          <label className="block text-sm text-white mb-1">Gender</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" >
              <option value="">Select your gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Queer">Queer</option>
              <option value="Robot">A robot that wants to end the world</option> 
              <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="px-4 py-6 cursor-pointer flex justify-center items-center">
          <button
            type="submit"
            disabled={!!error || !userNickName}
            className={`w-1/2 font-semibold py-2 rounded transition ${
              error || !userNickName
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-amber-200 text-black'
            }`}
          >
            Let's start
          </button>
        </div>
        <div className="px-4 py-4 flex justify-center items-center">
        <button
          type="button"
          onClick={handleLogOut}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          Logout to change email
        </button>
        </div>
      </form>
    </div>
  )
}
