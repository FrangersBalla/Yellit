import Upbar from "./03_components/Upbar";
import Sidebar from './03_components/Macro/Sidebar'
import RenderComponent from "./03_components/RenderComponent"
import { useEffect, useState } from "react"
import type { Doc, User } from './02_lib/XTypes'
import {MacroPage} from './03_components/Macro/MacroPage'

function App() {
  const [page, setPage] = useState(0)
  const [succ, setSucc] = useState(false)
  const [loggato, setLoggato] = useState(false)
  const [macroname, setMacroname] = useState('')
  const [oldPage, setOldPage] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [post, setPost] = useState<Doc>({})
  const [show, setShow] = useState(false)
  const [shouldReload, setShouldReload] = useState(false)
  const [macroList, setMacroList] = useState<Doc[]>([])
  const [macroInfo, setMacroInfo] = useState<Doc[]>([])
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setShow(false)
  }, [page, loggato])

  useEffect(() => {
    if (macroInfo.length > 0) {
      setShow(true)
    }
  }, [macroInfo])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      window.location.reload()
    }
    const handleOffline = () => {
      setIsOnline(false)
      window.location.reload()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Upbar
          setPage={setPage}
          setOldPage={setOldPage}
          setShowMacro={setShow}
          setMacroInfo={setMacroInfo}
        />
        <div className="flex flex-1">
          {isOnline && <Sidebar
            setPage={setPage}
            page={page}
            setCreated={setSucc}
            pageCreated={succ}
            setLoggato={setLoggato}
            loggato={loggato}
            setMacroname={setMacroname}
            setOldPage={setOldPage}
            setUser={setUser}
            user={user}
            shouldReload={shouldReload}
            setShouldReload={setShouldReload}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setMacroList={setMacroList}
            macroList={macroList}
            oldPage={oldPage}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
            isOnline={isOnline}
          />}

          <main className="flex-1 pt-20 md:pt-4 p-4 overflow-hidden">
            <RenderComponent
              setPage={setPage}
              page={page}
              oldPage={oldPage}
              setSucc={setSucc}
              loggato={loggato}
              setMacroname={setMacroname}
              macroName={macroname}
              user={user}
              setPost={setPost}
              post={post}
              setShowMacro={setShow}
              macroList={macroList}
              setMacroInfo={setMacroInfo}
              setShouldReload={setShouldReload}
              setOldPage={setOldPage}
              setOpenIndex={setOpenIndex}
              isOpen={isOpen}
              isOnline={isOnline}
            />
            {show && (
              <MacroPage
                setShowMacro={setShow}
                user={user}
                setShouldReload={setShouldReload}
                setMacroname={setMacroname}
                setPage={setPage}
                macroInfo={macroInfo}
                macroList={macroList}
                setOpenIndex={setOpenIndex}
                setOldPage={setOldPage}
              />
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default App


