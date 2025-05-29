"use client"

import { signOut as logOut, refreshToken } from "@/lib/utils/token"
import type { Session } from "@/types"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface SessionContextType {
  session: Session | null
  isLoading: boolean
  refreshSession: () => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
  refreshSession: async () => {},
  signOut: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

interface SessionProviderProps {
  children: React.ReactNode
  initialSession: Session | null
}

export function SessionProvider({ children, initialSession }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const refreshSession = async () => {
    setIsLoading(true)

    try {
      const newToken = await refreshToken()
      if (!newToken) {
        setSession(null)
        return
      }

      const { decodeToken, getTokenCookie } = await import("@/lib/utils/token")
      const token = await getTokenCookie()
      const newSession = await decodeToken(token)
      setSession(newSession)
    } catch (error) {
      console.error("Failed to refresh session:", error)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    await logOut()
    setSession(null)
    router.refresh()
  }

  useEffect(() => {
    const checkForAuthRedirect = () => {
      const url = new URL(window.location.href)
      const authSuccess = url.searchParams.get("auth_success")
      if (authSuccess) {
        url.searchParams.delete("auth_success")
        window.history.replaceState({}, document.title, url.toString())
        refreshSession()
      }
    }

    checkForAuthRedirect()
  }, [])

  return (
    <SessionContext.Provider value={{ session, isLoading, refreshSession, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}
