import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import type { AuthContextType, User } from '../types/authType'
import { googleLogIn, SearchUser } from '../services/authServices'

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  loginWithGoogle: async () => null,
  logout: async () => null,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Monitora lo stato di autenticazione Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fUser => {
      setLoading(true)
      if (!fUser) {
        setCurrentUser(null)
        setLoading(false)
        return
      }

      try {
        const user = await SearchUser(fUser.email!)
        setCurrentUser(user)
      } catch (err) {
        console.error('Errore recupero profilo:', err)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = async (emailInput: string) : Promise<null> => {
    setLoading(true)
    try {
      const user = await googleLogIn(emailInput)
      setCurrentUser(user)
    } finally {
      setLoading(false)
      return null
    }
  }


  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setCurrentUser(null)
    } finally {
      setLoading(false)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
