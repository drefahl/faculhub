"use client"

import type { Session } from "@/types"
import { createContext, useContext } from "react"
import type { ReactNode } from "react"

interface SessionContextType {
  session: Session | null
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}

interface SessionProviderProps {
  session: Session | null
  children: ReactNode
}

export const SessionProvider = ({ session, children }: SessionProviderProps) => {
  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>
}
