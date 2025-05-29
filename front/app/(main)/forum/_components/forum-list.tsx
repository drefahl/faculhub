"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useSocketContext } from "@/components/context/socket-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Pagination } from "@/components/pagination"
import type { ListThreads200DataItem, ListThreadsParams } from "@/lib/api/axios/generated.schemas"
import { useListThreads } from "@/lib/api/react-query/thread"
import { formatDistanceToNow } from "@/lib/utils/date.utils"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { sendGAEvent } from "@next/third-parties/google"
import { MessageSquare } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function ForumList() {
  const [threads, setThreads] = useState<ListThreads200DataItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const searchParams = useSearchParams()

  const filters: ListThreadsParams = {
    page: currentPage,
    take: 10,
    search: searchParams.get("search") ?? "",
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
  }

  const { data } = useListThreads(filters, { query: { staleTime: 1 * 60 * 1000 } })

  const { totalPages } = data || {}

  useEffect(() => {
    if (data) {
      setThreads(data.data)
    }
  }, [data])

  useEffect(() => {
    if (data && data.data.length > 0) {
      sendGAEvent("event", "forum_threads_view", {
        page: currentPage,
        results_count: data.data.length,
        category_filter: filters.categoryId ?? "none",
        search_term: filters.search || "none",
      })
    }
  }, [data, currentPage])

  const { socket, isConnected } = useSocketContext()

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.emit("join:thread", "all")

    const handleCreate = (newThread: ListThreads200DataItem) => {
      setThreads((prev) => [...prev, newThread])
    }

    const handleUpdate = (updatedThread: ListThreads200DataItem) => {
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
        {threads.map((discussion) => (
          <Link
            key={discussion.id}
            href={`/forum/${discussion.id}`}
            onClick={() =>
              sendGAEvent("event", "forum_thread_click", {
                thread_id: discussion.id,
                title: discussion.title,
                category_ids: discussion.categories?.map((c) => c.id) ?? [],
              })
            }
          >
            <Card className="transition-all hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Criado {formatDistanceToNow(discussion.createdAt)}
                  </span>
                  {discussion.createdAt !== discussion.updatedAt && (
                    <Badge variant="outline" className="ml-2">
                      Atualizado {formatDistanceToNow(discussion.updatedAt)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{discussion.title}</CardTitle>
              </CardHeader>

              <CardContent>
                {discussion.categories && discussion.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {discussion.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
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
                      {formatDistanceToNow(discussion.comments[discussion.comments.length - 1].createdAt)}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
