import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import UserCard from "../user/UserCard"
import SearchBar from './SearchBar'
import NotificationsSection from './NotificationsSection'
import { useAuth } from "../../context/AuthContext"
import { useSidebar } from "../../context/SidebarContext"

export default function Sidebar() {
  const {currentUser} = useAuth()
  const { isOpen, setClose } = useSidebar()
  const { t } = useTranslation()
  // aspetto di montare il componente nel browser
  const [isSmall, setIsSmall] = useState<boolean>(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const isNowSmall = width <= 1023
      const wasSmall = isSmall

      setIsSmall(isNowSmall)

      if (wasSmall && !isNowSmall) setClose()
    }

    handleResize()

    // aggiungi listener per resize
    window.addEventListener('resize', handleResize)

    return () => { //cleanup all'unmount
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const navigate = useNavigate()

  if (!hasMounted) {
    return null
  }



  return (
    <div className="relative pt-2 rounded-full z-50">
      {
        (() => {
          const desktop = `fixed left-0 top-16 mt-2 bg-transparent rounded-xl text-white transition-all duration-300 flex flex-col h-[calc(100vh-4rem)] w-64 hover:w-76`
          const mobileClosed = `fixed left-0 top-16 mt-2 bg-transparent rounded-xl text-white transition-all duration-300 flex flex-col h-[calc(100vh-4rem)] w-0 overflow-hidden opacity-10`
          const mobileOpen = `fixed inset-0 bg-black text-white z-50 flex flex-col transition-none`

          const className = isSmall ? (isOpen ? mobileOpen : mobileClosed) : desktop

          return (
            <aside id="app-sidebar" className={className}>
            {isSmall && isOpen && (
              <div className="flex items-center justify-end m-1">
                <button
                  onClick={() => setClose()}
                  className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-full focus:outline-none"
                >
                  
                  <span className="text-sm font-semibold">Close</span>
                </button>
              </div>
            )}

            {currentUser && (
              <>
                <div className="p-4 whitespace-nowrap overflow-hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigate('/create')
                        if (isSmall) setClose()
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-300 to-amber-400 text-black py-2 px-4 rounded-full font-black"
                    >
                      <span>{t('newPost')}</span>
                    </button>
                  </div>
                </div>

                <div className="px-4 pb-2"><SearchBar onClose={()=>setClose()}/></div>

                <NotificationsSection onCloseSidebar={() => setClose()} />

                <div className="mt-auto p-4 items-center whitespace-nowrap overflow-hidden">
                  <UserCard isMobile={isSmall} isOpen={isOpen} onClose={()=>setClose()}/>
                </div>
              </>
            )}
          </aside>
          )
        })()
      }
    </div>
  )
}