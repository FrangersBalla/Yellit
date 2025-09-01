import { GoogleLogIn, LogOut } from '../../01_api/Xauth'
import { auth } from "../../00_config/firebase"
import type { User } from '../../02_lib/XTypes'


interface AuthControlProps {
  loggato: boolean
  onLoginChange: (loggedIn: boolean) => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AuthControl({ loggato, onLoginChange, setUser, setIsOpen}: AuthControlProps) {
  
  const handleAuth = async () => {
    if (!loggato) {
      const newUser = await GoogleLogIn()
      if (auth && auth.currentUser) {
        onLoginChange(true)
        setUser(newUser)
        setIsOpen(false)
      } 
    } else {
      await LogOut()
      onLoginChange(false)
    }
  }

  return (
    <>{!(loggato && auth?.currentUser) && (<div className="bg-transparent p-6 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
        <button onClick={handleAuth} className="w-full bg-amber-200 py-2 rounded-lg text-black transition">
            {loggato ? 'LogOut' : 'Get In'}
        </button>
    </div>)}</>
  )
}

export default AuthControl
