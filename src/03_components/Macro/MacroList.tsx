import { useEffect, useState } from 'react'
import { ExposeMacros } from '../../01_api/Xmacro'
import { auth } from "../../00_config/firebase"
import type { Doc } from '../../02_lib/XTypes'

interface MacroListProps {
  shouldReload: boolean
  onReloadHandled: () => void
  setPage: React.Dispatch<React.SetStateAction<number>>
  page: number
  setMacroname: React.Dispatch<React.SetStateAction<string>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  setMacroList: React.Dispatch<React.SetStateAction<Doc[]>>
  macroList: Doc[]
  oldPage: number
  setOpenIndex: React.Dispatch<React.SetStateAction<string | null>>
  openIndex: string | null
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsSideBarClicked: React.Dispatch<React.SetStateAction<boolean>>
}

function MacroList({ shouldReload, onReloadHandled, setPage, page, setMacroname, setOldPage, setMacroList, macroList, oldPage, setOpenIndex, openIndex, setIsSideBarOpen, setIsSideBarClicked }: MacroListProps) {
  

  const getMacrosList = async () => {
    if (auth && auth.currentUser) {
      const list = await ExposeMacros(auth.currentUser.uid)
      setMacroList(list)
    }
  }
  
  const [click, setClick] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(true)

  const onMacroClick = (index: string) => {
    if (openIndex === index) {
      setOpen(prev => !prev)
      if(page != 2) setPage(2)
      /*setOpenIndex(null)
      setPage(0)*/
    }
    else {
      setOpenIndex(index)
      setOpen(true)
      setClick(prev => !prev)
      if(page != 2 || openIndex !== index) setPage(2)
      setIsSideBarClicked(false)
    }
    
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [click])
  
  useEffect(() => {
    if (shouldReload) {
      getMacrosList()
      onReloadHandled()
    }
    if (page < 2 || (page != 2 && oldPage != 2)) {
      setOpenIndex(null)
      setOpen(false)
    }
  }, [shouldReload, page])

 
  return (
    <>
    <div className='flex-grow overflow-y-auto'>
      <ul className="space-y-2 ">
        {macroList.map((macro) => (
          <li key={macro.macroName}>
            <div className={`px-6 py-2 rounded-xl hover:font-black transition-all duration-300 ${(openIndex==macro.macroName) ? 'bg-amber-200 text-black hover:!font-normal' : 'bg-transparent'}`}>
              <button
              className='w-full text-start inline-flex items-center gap-3'
              onClick={() => {
                onMacroClick(macro.macroName)
                setMacroname(macro.macroName)
                setOldPage(2)
              }}
              >
                {macro.macroName} {(openIndex === macro.macroName && page > 2 && oldPage == 2) 
                                    ? (page == 3 ? 
                                      <> - <img src="/icons/newPost.svg" alt= '' className="right-0 w-4 h-4"/> </>
                                      : (page == 4) ? 
                                        <><img src="/icons/reading.svg" alt= '' className="right-0 w-5 h-4"/></>
                                        : <img src="/icons/info.svg" alt= '' className="right-0 w-6 h-6"/>
                                    ) 
                                  : ''}
            </button></div>
            <div 
              className={`w-full text-start inline-flex items-center
                transition-all duration-900 ease-in-out
                transform
                ${openIndex === macro.macroName && page >= 2 && open 
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-10 pointer-events-none overflow-hidden h-0'}`}
                >
              <div className="px-8 py-2 mt-2 p-3 bg-transparent">
                <button onClick={()=>{setPage(5); setOpen(false); setIsSideBarOpen(false)}}><img src="/icons/info.svg" alt= '' className="right-0 w-10 h-10 invert opacity-25"/></button>
              </div>
              <div className="px-8 py-2 mt-2 p-3 bg-transparent">
                <button onClick={()=>{setPage(3); setOpen(false); setIsSideBarOpen(false)}}><img src="/icons/add.svg" alt= '' className="right-0 w-6 h-6 invert opacity-30"/></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div></>
  )
}


export default MacroList
