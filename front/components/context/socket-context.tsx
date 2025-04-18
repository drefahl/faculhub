"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { type Socket, io } from "socket.io-client"

interface SocketContextProps {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextProps>({ socket: null, isConnected: false })

export const useSocketContext = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    async function createSocket() {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketInstance.on("connect", () => {
        setIsConnected(true)
      })

      socketInstance.on("disconnect", () => {
        setIsConnected(false)
      })

      setSocket(socketInstance)
    }

    createSocket()

    return () => {
      socket?.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
