import React, { createContext, useContext, useState } from 'react'
import type { SidebarContextType } from '../types/Type'

const SidebarContext = createContext<SidebarContextType | null>(null)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  //imposto i valori
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(v => !v)
  const setClose = () => setIsOpen(false)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setClose }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if(context) return context
  throw new Error('') //solo se usato fuori dal contesto
}

export default SidebarContext
