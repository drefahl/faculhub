import { getSession } from "@/lib/utils/token"
import type React from "react"
import { SessionProvider } from "./session-provider"

export async function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return <SessionProvider session={session}>{children}</SessionProvider>
}
