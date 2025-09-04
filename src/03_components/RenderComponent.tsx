import { useState, useEffect } from 'react'
import type {Doc} from '../02_lib/XTypes'
import Home from './Post/GlobalFeed'
import MacroHome from './Macro/MacroHome'
import CreateMacro from './Macro/CreateMacro'
import CreatePost from './Post/CreatePost'
import PostPage from './Post/PostPage'
import { MacroSettings } from './Macro/MacroPage'
import { SingUp } from './User/SingUp'
import type { User } from '../02_lib/XTypes'


interface RenderComponentProps {
  page: number
  oldPage: number
  setSucc: React.Dispatch<React.SetStateAction<boolean>>
  setPage: React.Dispatch<React.SetStateAction<number>>
  setShowMacro: React.Dispatch<React.SetStateAction<boolean>>
  loggato: boolean
  setMacroname: React.Dispatch<React.SetStateAction<string>>
  macroName: string
  user: User | null
  setPost: React.Dispatch<React.SetStateAction<Doc>>
  post: Doc
  macroList: Doc[]
  setMacroInfo: React.Dispatch<React.SetStateAction<Doc[]>>
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  setOpenIndex: React.Dispatch<React.SetStateAction<string | null>>
  isOpen: boolean
}

function RenderComponent({ page, setOldPage, oldPage, setSucc, setPage, loggato, macroName, user, setPost, post, setShowMacro, setMacroInfo, setShouldReload, setMacroname, setOpenIndex, isOpen }: RenderComponentProps) {
  const [visiblePage, setVisiblePage] = useState(page)
  const [visible, setVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  const [signUp, setSignUp] = useState(true)
  const [scroll, setScroll] = useState(true)

  useEffect(() => {
    setVisible(false)

    const timeoutShow = setTimeout(() => {
      setVisiblePage(page)
      setVisible(true)
    }, 600)

    return () => {
      clearTimeout(timeoutShow)
    }
  }, [page, macroName])

  useEffect(() => {
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => {
        window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isOpen && isSmallScreen) {
        setScroll(false)
    } else {
        setScroll(true)
    }
    return () => {
        setScroll(true)
    }
  }, [isOpen, isSmallScreen])

  if(page !== visiblePage || !loggato) {
    return <div className="flex items-center justify-center h-full mt-30 lg:mr-40"></div>
  }

  if(user && user.isNew && signUp) {
    return <SingUp setShouldReload={setShouldReload} setSignUp={setSignUp} />
  }

  return (
    <div
      className={`overflow-y-auto overflow-x-hidden transition-opacity duration-[1150ms] ${!scroll ? 'overflow-y-hidden' : ''} ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {(() => {
        switch (visiblePage) {
          case 1:
            return <CreateMacro setOpenIndex={setOpenIndex} setMacroname={setMacroname} setSucc={setSucc} setPage={setPage} user={user} setOldPage={setOldPage} />
          case 2:
            return <MacroHome macroName={macroName} page={page} setPage={setPage} setPost={setPost} visible={visible} userName={user!.nickName} />
          case 3:
            return <CreatePost setSucc={setSucc} setPage={setPage} macroName={macroName} name={user!.nickName} />
          case 4:
            return <PostPage post={post} setPage={setPage} page={page} oldPage={oldPage} userName={user!.nickName} />
          case 5:
            return <MacroSettings page={page} setPage={setPage} setOldPage={setOldPage} macroName={macroName} oldPage={oldPage} user={user} setShouldReload={setShouldReload} />
          case 6:
            return <></>
          default:
            return <Home page={page} setPage={setPage} setPost={setPost} setShowMacro={setShowMacro} setMacroInfo={setMacroInfo} userName={user!.nickName} />
        }
      })()}
    </div>
  )
}

export default RenderComponent