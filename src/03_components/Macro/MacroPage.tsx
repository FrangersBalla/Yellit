import { AddMembership } from "../../01_api/Xmacro"
import { useState, useEffect } from "react"
import { ShowMembers, GetMacroInfo, AddRole, RemoveAccount } from "../../01_api/Xmacro"
import WeeklyUsage from "../../04_graphs/UsageGraph"
import LikesPie from "../../04_graphs/LikesGraph"


interface MacroSettsProps {
  macroName: string
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  user: User | null
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  oldPage: number
}

export function MacroSettings ({macroName, page, setPage, user, setShouldReload, setOldPage, oldPage}: MacroSettsProps) {
  const [macroMems, setMacroMems] = useState<Doc[]>([])
  const [macroInfo, setMacroInfo] = useState<Doc[]>([])
  const [isSuperV, setIsSuperV] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  const [pos, setPos] = useState<{x:number, y:number}>({ x: 0, y: 0 })
  const [click, setClick] = useState<boolean>(false)
  const [rmv, setRmv] = useState<boolean>(false)
  const [p, setP] = useState<string>('')
  const [memID, setMemID] = useState<string>('')
  const [sV, setSV] = useState<number>(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPos({ x: e.clientX + 20, y: e.clientY + 20 })
  }

  const handleAddSuperVClick = async (memID: string) => {
    await AddRole(memID)
    const members = await ShowMembers(macroName)
    setMacroMems(members)
    setSV(prev=>prev+1)
    setClick(prev=>!prev)
  }
  const handleRmvClick = async (mID: string, role: string) => {
    await RemoveAccount(mID, macroName, macroMems.length)
    const members = await ShowMembers(macroName)
    setMacroMems(members)
    if(role == 'Supervisor') setSV(prev=>prev-1)
  }

  const handleLeave =  async () => {
    await RemoveAccount(memID, macroName, macroMems.length)
    setShouldReload(true)
    setPage(0)
    setOldPage(0)
  }

  useEffect(() => {
    const goToInfo = async () => {
      if (page == 5) {
        const members = await ShowMembers(macroName)
        const mInfo = await GetMacroInfo(macroName)

        setMacroMems(members)
        setMacroInfo(mInfo)

        const profile = members.find(m => m.userName === user?.nickName)
        setIsSuperV(profile?.role == 'Owner' || profile?.role == 'Supervisor')

        const svNum = members.reduce((c, m)=> c + ((m.role == 'Supervisor')? 1 : 0), 0)
        setSV(svNum)
        setP(profile? profile.role : '')
        setMemID(profile? profile.id! : '')
      }
    }
    goToInfo()
  }, [page])

  return (
    <><div className="flex flex-col max-h-[calc(100vh-15rem)] md:mt-20 mb-20 rounded-xl lg:m-20 mb-30 p-4">
      <div className='flex flex-row mb-6'>
        <button onClick={()=>setPage(oldPage)} className=""><img src="/icons/back.svg" alt= '' className="right-0 w-6 h-6 invert opacity-50 mr-3"/></button>
        <div className="text-2xl font-semibold text-white">{macroName}</div>
      </div>

      {(macroMems[0] && macroInfo[0]) && (
      <><div className="bg-zinc-950 rounded-lg mb-4 divide-y divide-gray-900">
        <div className="px-4 py-3 font-medium border-b border-amber-200/25 text-amber-200">Description</div>
        <div className="px-4 py-3 rounded-b-lg cursor-pointer">
          <div className="text-sm text-white">{macroInfo[0]!.description}</div>
        </div>
      </div>
      <div className="bg-zinc-950 rounded-lg mb-4 divide-y divide-gray-900">
        <div className="border-b border-amber-200/25 px-4 py-3 font-medium text-amber-200">Members</div>
        {macroMems.map((m) => (
          <div
            key={m.id}
            className={`px-4 py-3 hover:bg-zinc-900 transition-colors duration-100 cursor-pointer ${m === macroMems[macroMems.length - 1] ? 'rounded-b-lg' : ''}`}
          >
            <div className="text-sm text-white">{m.userName}</div>
            <div className={`text-xs ${m.role == 'Owner' ? 'text-amber-600' : 'text-gray-200'}`}>{m.role}</div>
          </div>
        ))}
      </div>
      <div className="bg-zinc-950 rounded-lg mb-4 divide-y divide-gray-900">
        <div className="px-4 py-3 border-b border-amber-200/25 font-semibold  text-md text-amber-200">Members settings</div>

        <div
          className={`px-4 py-3 border-b-lg ${!isSuperV?'cursor-not-allowed':'cursor-pointer'}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={handleMouseMove}
          onClick={()=>{if(isSuperV) {setClick(prev => !prev); setRmv(false)}}}
          role="button"
        >
          <div className={`text-left text-md text-white font-light`}>Add Supervisor</div>
          {!click && (<div className="text-xs text-gray-200">You have {sV} supervisor {sV>1 ? 's':''}</div>)}
          <div 
            className={`w-full text-start flex flex-col items-start
            transition-all duration-300 ease-in-out
            transform overflow-hidden gap-0 text-white
            ${click
              ? 'opacity-100 translate-y-0 max-h-40'
              : 'opacity-0 -translate-y-5 max-h-0 py-0 mb-0 border-0'}
            `}
            >
            <div className="mt-2">
              {macroMems.length - sV > 1 ? (
                macroMems.map((m) => (
                  <div className="m-1" key={m.id}>
                    {m.role === 'Member' && (
                      <button
                        className="px-2 text-sm text-amber-200 hover:bg-zinc-900 rounded-lg"
                        onClick={() => handleAddSuperVClick(m.id!)}
                      >
                        {m.userName}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-200/50">Looks like you can't add more supervisors right now</div>
              )}
            </div>
          </div>
        </div>
        
        <div
          className={`px-4 py-3 border-b-lg ${!isSuperV?'cursor-not-allowed':'cursor-pointer'}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={handleMouseMove}
          onClick={()=>{if(isSuperV) {setRmv(prev => !prev); setClick(false)}}}
          role="button"
        >
          <div className={`text-left text-sm text-white font-light`}>Remove a member</div>
          <div 
            className={`w-full text-start flex flex-col items-start
            transition-all duration-400 ease-in-out
            transform overflow-hidden gap-0 text-white
            ${rmv
              ? 'opacity-100 translate-y-0 max-h-40'
              : 'opacity-0 -translate-y-5 max-h-0 py-0 mb-0 border-0'}
            `}
            >
            <div className='mt-2'>
              {((p =='Owner' && sV > 0) || (macroMems.length - sV -1 > 1)) ? macroMems.map((m)=>(
                 (<div className='m-1'  key={m.id}>
                  {((m.role == 'Member' || (p == 'Owner' && m.role != 'Owner') && m.userName != user!.nickName) && <button className="px-2 text-sm text-amber-200 hover:bg-zinc-900 rounded-lg"
                      onClick={()=>handleRmvClick(m.id!, m.role)}
                    >
                      {m.userName} {m.id? m.id:''}</button>)}
                </div>))
                ) : (
                <div className="text-xs text-gray-200/50">Looks like you can't remove anyone right now</div>
              )
              }
            </div> 
          </div>
        </div>
      </div>
      <WeeklyUsage macroName={macroName} page={page} />
      <LikesPie  macroName={macroName} page={page} mems={new Set(macroMems.map(m => m.userName))}/>
      <div className="w-3/5 mx-auto pb-10 mb-4">
        <button onClick={handleLeave} className="w-full bg-amber-200 py-2 rounded-lg text-black transition">
          Leave
        </button>
      </div>
      {(!isSuperV && hover) && (
        <div
          className="fixed bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none"
          style={{ top: pos.y, left: pos.x }}
        >
          You're not admin
        </div>
      )}
      </>)}
    </div>
    </>
  )
}

import type { Doc, User } from '../../02_lib/XTypes'


interface MacroPageProps {
  setShowMacro: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  setMacroname: React.Dispatch<React.SetStateAction<string>>
  setOpenIndex: React.Dispatch<React.SetStateAction<string| null>>
  setPage: React.Dispatch<React.SetStateAction<number>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  macroInfo: Doc[]
  macroList: Doc[]
}

export function MacroPage({setShowMacro, user, setShouldReload, setMacroname, setPage, macroInfo, macroList, setOpenIndex, setOldPage}:MacroPageProps) {
  const joinMacro = async () => {
    setShowMacro(false)
    await AddMembership(macroInfo[0].macroName, user!.uID, 'Member', user!.nickName, macroList, macroInfo[0].MembersNum)
    setOpenIndex(macroInfo[0].macroName)
    setMacroname(macroInfo[0].macroName)
    setPage(2)
    setOldPage(2)
    setShouldReload(true)
  }

  return (
    <div
      className="backdrop-blur bg-black/65 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 rounded-xl overflow-hidden max-h-[50vh] w-13/15 max-w-[60vh] z-20"
      onClick={(e) => e.stopPropagation()}
    >
      {(true) && (<div className="p-6 overflow-y-auto max-h-[50vh] rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <button className="p-4 cursor-pointer" onClick={() => {setShowMacro(false); setPage(0)}}>
            <img src="/icons/close.svg" alt="" className="w-17/21 h-5 invert" />
          </button>
          <h1 className="text-xl mt-2 font-semibold text-white text-center flex-1 truncate">
            {macroInfo[0].macroName}
          </h1>
          <div className="flex justify-end">
            <button onClick={joinMacro} className="w-20 bg-amber-200 p-1 rounded-xl text-black">
              Join
            </button>
          </div>
        </div>

        <div className=" rounded-lg divide-y divide-gray-700/30">
          <div className="px-4 py-3 font-medium text-amber-200">General</div>
          <div
            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer"
          >
            <div className="text-sm text-white">Owner</div>
            <div className="text-sm mt-1 text-amber-200">{macroInfo[0]!.Owner}</div>
          </div>
          <div
            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer"
          >
            <div className="text-sm text-white">Description</div>
            <div className="text-sm mt-1 text-gray-200">{macroInfo[0]!.description}</div>
          </div>
          <div
            className="px-4 py-3 hover:bg-zinc-700 rounded-b-lg cursor-pointer"
          >
            <div className="text-sm text-white">Members</div>
            <div className="text-sm mt-1 text-gray-200">There {macroInfo[0]!.MembersNum > 1 ? 'are' : 'is only' } {macroInfo[0]!.MembersNum} user{macroInfo[0]!.MembersNum > 1 ? 's' : '' }!</div>
          </div>

          
        </div>
      </div>)}
    </div>
  )
}

