import SearchBar from "./SearchBar"
import { GetMacroInfo } from "../01_api/Xmacro"
import type { Doc } from "../02_lib/XTypes"
import { useState } from "react"

interface UpbarProps {
  setPage: React.Dispatch<React.SetStateAction<number>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  setShowMacro: React.Dispatch<React.SetStateAction<boolean>>
  setMacroInfo: React.Dispatch<React.SetStateAction<Doc[]>>
}

export default function Upbar({setPage, setOldPage, setMacroInfo, setShowMacro}:UpbarProps) {
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch =  async (macroName: string) => {
    if (isSearching) return
    setIsSearching(true)
    const info = await GetMacroInfo(macroName)
    if(info.length > 0) {
      setPage(6)
      setMacroInfo(info)
      setShowMacro(true)
    }
    else setPage(0)
    setIsSearching(false)
  }

  return (
    <header className="fixed top-0 w-full p-4 rounded-b-xl z-50 bg-black">
      <div className="h-8 mx-auto flex items-center gap-4">
        <button onClick={()=>{setPage(0); setOldPage(0)}} className="ml-5 cursor-pointer"><h1 className="ml-5 font-sans text-3xl text-white font-black tracking-tighter whitespace-nowrap">
          yellit
        </h1></button>

        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  )
}
