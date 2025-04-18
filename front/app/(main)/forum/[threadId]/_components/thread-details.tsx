"use client"

import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, MoreVertical, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { useSocketContext } from "@/components/context/socket-context"
import { useSession } from "@/components/providers/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import type { GetThreadById200 } from "@/lib/api/generated.schemas"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"

interface ThreadDetailProps {
  thread: GetThreadById200
}

export function ThreadDetail({ thread: initialThread }: ThreadDetailProps) {
  const [thread, setThread] = useState<GetThreadById200 | null>(initialThread)
  const [isDeleting, setIsDeleting] = useState(false)

  const { session } = useSession()
  const { socket, isConnected } = useSocketContext()

  const isAdmin = session?.role === "ADMIN" || false
  const isAuthor = thread?.author.id === session?.id

  useEffect(() => {
    if (!socket || !isConnected || !thread?.id) return

    socket.emit("join:thread", thread.id)

    const handleUpdate = (updatedThread: GetThreadById200) => {
      setThread(updatedThread)
    }

    const handleDelete = () => {
      setThread(null)
    }

    socket.on("thread:update", handleUpdate)
    socket.on("thread:delete", handleDelete)

    return () => {
      socket.emit("leave:thread", thread.id)
      socket.off("thread:update", handleUpdate)
      socket.off("thread:delete", handleDelete)
    }
  }, [socket, isConnected, thread?.id])

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">Discussão não encontrada</h3>
        <p className="text-muted-foreground">Esta discussão pode ter sido removida.</p>
      </div>
    )
  }

  const handleDeleteThread = async () => {
    if (!socket || !isConnected) return

    try {
      setIsDeleting(true)
    } catch (error) {
      console.error("Failed to delete thread:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{thread.title}</CardTitle>
              <CardDescription>
                Criado{" "}
                {formatDistanceToNow(new Date(thread.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}{" "}
                {thread.createdAt !== thread.updatedAt && (
                  <Badge variant="outline" className="ml-2">
                    Atualizado{" "}
                    {formatDistanceToNow(new Date(thread.updatedAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </Badge>
                )}
              </CardDescription>
            </div>

            {(isAuthor || isAdmin) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar discussão
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={isDeleting}
                    onClick={handleDeleteThread}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir discussão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6 whitespace-pre-wrap text-base">{thread.content}</div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={getProfilePicUrl(thread.author.profilePicId) || ""} alt={thread.author.name} />
              <AvatarFallback>{getUserInitials(thread.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{thread.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(thread.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Comentários ({thread.comments?.length || 0})</h2>
        </div>

        <CommentForm threadId={thread.id} session={session} />

        <Separator />

        <CommentList comments={thread.comments || []} threadId={thread.id} session={session} />
      </div>
    </div>
  )
}
