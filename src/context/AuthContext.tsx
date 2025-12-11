import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import type { AuthContextType, User } from '../types/Type'
import { GoogleLogIn, GoogleSignUp, SearchUser } from '../services/authServices'

// creo il contesto con valori default
const AuthContext = createContext<AuthContextType>({ 
  currentUser: null,
  loading: true,
  loginWithGoogle: async () => false,
  signUpWithGoogle: async () => false,
  logout: async () => null,
})

// hook per accedere ai dati in AuthContext
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  

  // monitora lo stato dell'utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fUser => {
      setLoading(true) //loading per evitare di leggere prima che abbia caricato
      if (!fUser) {
        // se offline prova a caricare l'utente salvato in cache
        if (!navigator.onLine) {
          const cachedUser = localStorage.getItem('cachedUser')
          if (cachedUser) {
            try {
              setCurrentUser(JSON.parse(cachedUser))
            } catch {
              setCurrentUser(null)
            }
          } else {
            setCurrentUser(null)
          }
        } else {
          setCurrentUser(null)
        }
        setLoading(false)
        return
      }

      try {
        //recupero il profilo da db
        const user = await SearchUser(fUser.email!)
        if (!user) {
          setCurrentUser(null)
        } else {
          setCurrentUser(user) //aggiorno currentUser (AuthContext)
          // salva l'utente in localStorage
          localStorage.setItem('cachedUser', JSON.stringify(user))
        }
      } catch (err) {
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe //ferma il listening all'unmount
  }, [])

  const loginWithGoogle = async (emailInput: string): Promise<boolean> => {
    setLoading(true)
    let err = false
    try {
      const user = await GoogleLogIn(emailInput) //lancia un errore se va male
      setCurrentUser(user)
    } catch (e) {
      setCurrentUser(null)
      err = true
    } finally {
      setLoading(false)
      return err
    }
  }

  const signUpWithGoogle = async (emailInput: string, userName: string, language: string): Promise<boolean> => {
    setLoading(true)
    let err = false
    try {
      const user = await GoogleSignUp(emailInput, userName, language)
      setCurrentUser(user)
    } catch (e) {
      setCurrentUser(null)
      err = true
    } finally {
      setLoading(false)
      return err
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setCurrentUser(null)
      localStorage.removeItem('cachedUser')
    } finally {
      setLoading(false)
      return null
    }
  }

  return (
    <AuthContext.Provider //condivido il contesto ai figli
      value={{ currentUser, loading, loginWithGoogle, signUpWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
