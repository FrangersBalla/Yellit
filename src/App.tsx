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
  const [show, setShow] = useState <boolean>(false)
  const [shouldReload, setShouldReload] = useState(false)
  const [macroList, setMacroList] = useState<Doc[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [macroInfo, setMacroInfo] = useState <Doc[]>([])
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  useEffect(()=>{
    setShow(false)
  },[page, loggato])

  useEffect(() => {
    if (macroInfo.length > 0) {
      setShow(true)
    }
  }, [macroInfo])

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Upbar setPage={setPage} setOldPage={setOldPage} setShowMacro={setShow} setMacroInfo={setMacroInfo}></Upbar>
        <div className="lg:hidden min-w-screen mt-3 bg-transparent relative h-1"></div>
          <Sidebar
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
            setOpenIndex={setOpenIndex}/>
          <main className="flex-1 p-4 overflow-hidden">
            <div className="h-8"></div>
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
              isOpen={isOpen}/>
              {show && (<MacroPage setShowMacro={setShow} user={user} setShouldReload={setShouldReload} setMacroname={setMacroname} setPage={setPage} macroInfo={macroInfo} macroList={macroList} setOpenIndex={setOpenIndex} setOldPage={setOldPage}/>)}
          </main>
        </div>
    </>
  );
}

export default App

