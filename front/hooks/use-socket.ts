"use client"

import { getTokenCookie } from "@/lib/utils/token"
import { useEffect, useState } from "react"
import { type Socket, io } from "socket.io-client"

export function useSocket(url = process.env.NEXT_PUBLIC_API_URL) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    let newSocket: Socket

    async function connect() {
      const token = await getTokenCookie()
      newSocket = io(url, {
        query: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      setSocket(newSocket)
    }

    connect()

    return () => {
      newSocket?.disconnect()
    }
  }, [url])

  return { socket }
}
