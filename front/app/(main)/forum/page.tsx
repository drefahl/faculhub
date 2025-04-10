"use client"

import { ForumHeader } from "@/components/forum/forum-header"
import { ForumList } from "@/components/forum/forum-list"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/hooks/use-socket"
import { useState } from "react"

export default function ForumPage() {
  const [messages, setMessages] = useState<any[]>([])

  const { socket } = useSocket()

  if (!socket) {
    return <div>Loading...</div>
  }

  socket.on("message", (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
    console.log("Received message:", message)
  })

  console.log(messages)

  return (
    <div className="w-full px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <Button onClick={() => socket.emit("message", { text: "Hello from the client!", createdAt: new Date() })}>
        Send Message
      </Button>

      <div>
        {messages.map((message, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
            <p className="text-gray-800">{message.text}</p>
            <p className="text-gray-500 text-sm">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <ForumHeader />
      <ForumList />
    </div>
  )
}
