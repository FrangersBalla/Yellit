import { GoogleLogIn, LogOut } from '../../01_api/Xauth'
import { auth } from "../../00_config/firebase"
import type { User } from '../../02_lib/XTypes'


interface AuthControlProps {
  loggato: boolean
  onLoginChange: (loggedIn: boolean) => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

function AuthControl({ loggato, onLoginChange, setUser}: AuthControlProps) {
  
  const handleAuth = async () => {
    if (!loggato) {
      const newUser = await GoogleLogIn()
      if (auth && auth.currentUser) {
        onLoginChange(true)
        setUser(newUser)
      } 
    } else {
      await LogOut()
      onLoginChange(false)
    }
  }

  return (
    <>{!loggato && (<div className="bg-transparent p-6 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
        <button onClick={handleAuth} className="w-full bg-amber-200 py-2 rounded-lg text-black transition">
            {loggato ? 'LogOut' : 'LogIn'}
        </button>
    </div>)}</>
  )
}

export default AuthControl
