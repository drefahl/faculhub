"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useSocketContext } from "@/components/context/socket-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Pagination } from "@/components/pagination"
import type { ListThreads200Item } from "@/lib/api/generated.schemas"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { MessageSquare } from "lucide-react"

interface ForumListProps {
  threads: ListThreads200Item[]
  itemsPerPage?: number
}

export function ForumList({ threads: initialThreads, itemsPerPage = 5 }: ForumListProps) {
  const [threads, setThreads] = useState<ListThreads200Item[]>(initialThreads)
  const [currentPage, setCurrentPage] = useState(1)

  const { socket, isConnected } = useSocketContext()

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.emit("join:thread", "all")

    const handleCreate = (newThread: ListThreads200Item) => {
      setThreads((prev) => [...prev, newThread])
    }

    const handleUpdate = (updatedThread: ListThreads200Item) => {
      setThreads((prev) => prev.map((thread) => (thread.id === updatedThread.id ? updatedThread : thread)))
    }

    const handleDelete = ({ id }: { id: number }) => {
      setThreads((prev) => prev.filter((thread) => thread.id !== id))
    }

    socket.on("thread:create", handleCreate)
    socket.on("thread:update", handleUpdate)
    socket.on("thread:delete", handleDelete)

    return () => {
      socket.emit("leave:thread", "all")
      socket.off("thread:create", handleCreate)
      socket.off("thread:update", handleUpdate)
      socket.off("thread:delete", handleDelete)
    }
  }, [socket, isConnected])

  const totalPages = Math.ceil(threads.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentThreads = threads.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">Conectando ao servidor...</h3>
        <p className="text-muted-foreground">Aguarde um momento.</p>
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">Nenhuma discussão encontrada</h3>
        <p className="text-muted-foreground">Seja o primeiro a iniciar uma discussão!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {currentThreads.map((discussion) => (
          <Link key={discussion.id} href={`/forum/${discussion.id}`}>
            <Card className="transition-all hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Criado{" "}
                    {formatDistanceToNow(new Date(discussion.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                  {discussion.createdAt !== discussion.updatedAt && (
                    <Badge variant="outline" className="ml-2">
                      Atualizado{" "}
                      {formatDistanceToNow(new Date(discussion.updatedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{discussion.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="mb-3 line-clamp-2 text-sm text-muted-foreground">{discussion.content}</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={getProfilePicUrl(discussion.author.profilePicId) || ""}
                      alt={discussion.author.name}
                    />
                    <AvatarFallback>{getUserInitials(discussion.author.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{discussion.author.name}</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{discussion.comments?.length || 0} comentários</span>
                </div>
                {discussion.comments && discussion.comments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={
                          getProfilePicUrl(discussion.comments[discussion.comments.length - 1].author.profilePicId) ||
                          ""
                        }
                        alt={discussion.comments[discussion.comments.length - 1].author.name}
                      />
                      <AvatarFallback>
                        {getUserInitials(discussion.comments[discussion.comments.length - 1].author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      Último comentário{" "}
                      {formatDistanceToNow(new Date(discussion.comments[discussion.comments.length - 1].createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
