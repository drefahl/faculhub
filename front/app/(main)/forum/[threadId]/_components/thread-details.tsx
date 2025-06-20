"use client"

import { format } from "date-fns"
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
import { MarkdownViewer } from "@/components/ui/markdown-viewer"
import { Separator } from "@/components/ui/separator"
import type { GetThreadById200, GetThreadById200CommentsItem } from "@/lib/api/axios/generated.schemas"
import { deleteThread } from "@/lib/api/axios/thread"
import { getListThreadsQueryKey } from "@/lib/api/react-query/thread"
import { formatDistanceToNow } from "@/lib/utils/date.utils"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"

interface ThreadDetailProps {
  thread: GetThreadById200
}

export function ThreadDetail({ thread: initialThread }: ThreadDetailProps) {
  const [thread, setThread] = useState<GetThreadById200 | null>(initialThread)

  const router = useRouter()
  const { session } = useSession()
  const queryClient = useQueryClient()
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

    const handleCreateComment = (comment: GetThreadById200CommentsItem) => {
      setThread((prev) => {
        if (!prev) return null

        return {
          ...prev,
          comments: [...(prev.comments || []), comment],
        }
      })
    }

    const handleUpdateComment = (updatedComment: GetThreadById200CommentsItem) => {
      setThread((prev) => {
        if (!prev) return null

        const updatedComments = prev.comments?.map((comment) =>
          comment.id === updatedComment.id ? { ...comment, ...updatedComment } : comment,
        )

        return {
          ...prev,
          comments: updatedComments,
        }
      })
    }

    const handleDeleteComment = (deletedComment: GetThreadById200CommentsItem) => {
      setThread((prev) => {
        if (!prev) return null

        const updatedComments = prev.comments?.filter((comment) => comment.id !== deletedComment.id)

        return {
          ...prev,
          comments: updatedComments,
        }
      })
    }

    socket.on("thread:update", handleUpdate)
    socket.on("thread:delete", handleDelete)
    socket.on("comment:create", handleCreateComment)
    socket.on("comment:update", handleUpdateComment)
    socket.on("comment:delete", handleDeleteComment)

    return () => {
      socket.emit("leave:thread", thread.id)
      socket.off("thread:update", handleUpdate)
      socket.off("thread:delete", handleDelete)
      socket.off("comment:create", handleCreateComment)
      socket.off("comment:update", handleUpdateComment)
      socket.off("comment:delete", handleDeleteComment)
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

    const [error] = await deleteThread(thread.id)

    if (error) {
      toast.error("Erro ao excluir discussão")
      console.error("Failed to delete thread:", error)
      return
    }

    queryClient.invalidateQueries({ queryKey: getListThreadsQueryKey({} as any) })
    toast.success("Discussão excluída com sucesso")
    router.push("/forum")
  }

  return (
    <div className="space-y-6 py-4 sm:py-6 md:py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{thread.title}</CardTitle>

              {thread.categories && thread.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {thread.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}

              <CardDescription>
                Criado {formatDistanceToNow(thread.createdAt)}{" "}
                {thread.createdAt !== thread.updatedAt && (
                  <Badge variant="outline" className="ml-2">
                    Atualizado {formatDistanceToNow(thread.updatedAt)}
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
                    <Link href={`/forum/edit/${thread.id}`} passHref>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar discussão
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteThread}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir discussão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-2 pt-0">
          <div className="mb-6">
            <MarkdownViewer className="border-none shadow-none" markdown={thread.content} />
          </div>

          <Separator className="mb-4 mx-4" />

          <div className="flex items-center gap-3 p-4">
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
        {session ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Comentários ({thread.comments?.length || 0})</h2>
            </div>

            <CommentForm threadId={thread.id} session={session} />
          </>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <p className="mb-4 text-muted-foreground">Você precisa estar logado para adicionar um comentário.</p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="/login">Entrar</a>
                </Button>
                <Button asChild>
                  <a href="/register">Registrar</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        <CommentList comments={thread.comments || []} threadId={thread.id} session={session} />
      </div>
    </div>
  )
}
