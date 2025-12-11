import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import i18n from './i18n'
import Index from "./router/Index"
import { requestNotificationPermission } from './utils/browserNotifications'

function App() {
  const { currentUser } = useAuth()

  useEffect(() => {
    // cambio lingua al login
    if (currentUser?.language && currentUser.language != i18n.language) {
      i18n.changeLanguage(currentUser.language)
    }

    // permesso notifiche
    if (currentUser)  requestNotificationPermission()

  }, [currentUser])

  return (
    <Index/> //router
  )
}

export default App
