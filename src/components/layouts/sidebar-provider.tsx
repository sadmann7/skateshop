"use client"

import * as React from "react"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps>({
  open: false,
  setOpen: () => {},
})

export const SidebarProvider = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}
