import { useEffect, useRef } from 'react'
import MacroList from '../Macro/MacroList'
import AuthControl from '../User/LogIn'
import UserCard from '../User/UserCard'
import { auth } from "../../00_config/firebase"
import { onAuthStateChanged } from 'firebase/auth'
import { SearchUser } from '../../01_api/Xauth'
import type { Doc, User } from '../../02_lib/XTypes'


interface SidebarProps{
  setPage: React.Dispatch<React.SetStateAction<number>>
  page: number
  pageCreated: boolean
  setCreated: React.Dispatch<React.SetStateAction<boolean>>
  setLoggato: React.Dispatch<React.SetStateAction<boolean>>
  loggato: boolean
  setMacroname: React.Dispatch<React.SetStateAction<string>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  oldPage: number
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  user: User | null
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  shouldReload: boolean
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setMacroList: React.Dispatch<React.SetStateAction<Doc[]>>
  macroList: Doc[]
  setOpenIndex: React.Dispatch<React.SetStateAction<string | null>>
  openIndex: string | null
  isOnline: boolean
}

function Sidebar({setPage, page, pageCreated, isOnline, setCreated, setLoggato, loggato, setMacroname, setUser, user, setOldPage, shouldReload, setShouldReload, setIsOpen, isOpen, setMacroList, macroList, oldPage, openIndex, setOpenIndex}: SidebarProps) {

  const boxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [])

  useEffect(() => {
    if (pageCreated) {
      setCreated(false)
      setShouldReload(true)
    }
  }, [pageCreated])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const loggedUser = await SearchUser(firebaseUser.uid)
        setUser(loggedUser)
        setLoggato(true)
        setShouldReload(true)
      } else {
        setUser(null)
        setLoggato(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLoginChange = (loggedIn: boolean) => {
    setLoggato(loggedIn)
    if (loggedIn) setShouldReload(true)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleCreateMacro = ()=>{
    setPage(1)
    setIsOpen(false)
  }

  return (
    <div ref={boxRef} className="contents">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-12 left-1 z-50 px-5 py-1 rounded-full text-white shadow-md
                  bg-gradient-to-b from-black via-stone-950 to-black hover:opacity-75"
      >
        <img src="/icons/menu.svg" alt='' className="w-6 h-6 invert opacity-50"/>
      </button>

      <div className="hidden lg:block w-60 h-screen text-white"></div>

      {!(user && user.isNew) && (
        <aside
          className={`
            will-change-transform bg-black
            text-white p-4 rounded-tr-3xl fixed
            max-sm:w-full max-md:w-4/7 max-lg:w-3/7 h-full mt-18 z-40
            transform transition-all duration-700 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:block lg:w-60 lg:hover:w-[30%]
          `}
        >
          <nav className="h-full flex flex-col">
                <AuthControl loggato={loggato} onLoginChange={handleLoginChange} setUser={setUser} setIsOpen={setIsOpen}/>
                {(loggato) && (
                  <>
                  {((page == 0 || (oldPage == 0 && page != 2)) && isOnline) && (<div><button onClick={handleCreateMacro} className="w-full bg-amber-200 py-2 mb-4 rounded-xl text-black hover:bg-amber-200 transition">
                    New channel
                  </button></div>)}
                  <div className='flex-grow overflow-y-auto mt-4 mb-4 pr-1'>
                  {isOnline && <MacroList
                    shouldReload={shouldReload}
                    onReloadHandled={() => setShouldReload(false)}
                    setPage={setPage}
                    page={page}
                    setMacroname={setMacroname}
                    setOldPage={setOldPage}
                    setMacroList={setMacroList}
                    macroList={macroList}
                    oldPage={oldPage}
                    openIndex={openIndex}
                    setOpenIndex={setOpenIndex}
                    setIsSideBarOpen={setIsOpen}
                  />}
                  </div>
                  <div className="absolute bg-black bottom-16 left-0 w-full">
                    {loggato && (<UserCard CurrentUser={user!} onLoginChange={handleLoginChange} setOldPage={setOldPage} setPage={setPage}/>)}
                  </div></>
                )}
            </nav>
          </aside>)}
    </div>
  );
}

export default Sidebar
