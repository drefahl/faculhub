"use client"
import { LikeButton } from "@/components/like-button"
import { Pagination } from "@/components/pagination"
import { useSession } from "@/components/providers/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { ListPosts200DataItem } from "@/lib/api/axios/generated.schemas"
import { deletePost, useListPosts } from "@/lib/api/react-query/post"
import { formatDistanceToNow } from "@/lib/utils/date.utils"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { Calendar, Clock, MapPin, MoreVertical, Pin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const createContentPreview = (htmlContent: string, maxLength = 300): string => {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  const textContent = tempDiv.textContent || tempDiv.innerText || ""

  if (textContent.length <= maxLength) {
    return textContent
  }

  const lastSpace = textContent.lastIndexOf(" ", maxLength)
  const trimmedText = textContent.substring(0, lastSpace > 0 ? lastSpace : maxLength)

  return `${trimmedText}...`
}

export function NewsBoard({ type }: { type?: "EVENT" | "NEWS" }) {
  const [posts, setPosts] = useState<ListPosts200DataItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const { data: fetchedPosts, isLoading } = useListPosts(
    {
      page: currentPage,
      take: 9,
      type,
    },
    { query: { refetchInterval: 1 * 60 * 1000 } },
  )

  const router = useRouter()
  const { session } = useSession()

  const isAdmin = session?.role === "ADMIN"

  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts.data)
    }
  }, [fetchedPosts])

  const totalPages = fetchedPosts?.totalPages

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
      toast.success("Post removido com sucesso")
    } catch (error) {
      toast.error("Falha ao remover o post")
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[300px]">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-10 rounded-full mr-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Nenhuma publicação encontrada</h3>
        <p className="text-muted-foreground mt-1">Volte mais tarde para atualizações</p>
      </div>
    )
  }

  const sortedPosts = [...(posts ?? [])].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts?.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            <CardHeader className="relative pb-2 pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={post.type === "NEWS" ? "default" : "secondary"}>
                      {post.type === "NEWS" ? "Anúncio" : "Evento"}
                    </Badge>

                    {post.courses.map((course) => (
                      <Badge key={course.id} variant="outline" className="text-xs">
                        {course.code}
                      </Badge>
                    ))}

                    {post.isPinned && <Pin className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <Link href={`/noticias/${post.id}`} className="hover:underline">
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </Link>
                </div>

                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/noticias/edit/${post.id}`)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="line-clamp-3 min-h-[60px]">
                {createContentPreview(post.content)}
              </CardDescription>

              {post.type === "EVENT" && post.eventDate && (
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(post.eventDate).toLocaleDateString()}</span>
                  {post.location && (
                    <>
                      <MapPin className="h-4 w-4 ml-4 mr-2" />
                      <span>{post.location}</span>
                    </>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={getProfilePicUrl(post.author.profilePicId) || ""} />
                  <AvatarFallback>{getUserInitials(post.author?.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{post.author.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <LikeButton
                  postId={post.id}
                  initialLiked={post.isLiked}
                  isAuthenticated={!!session}
                  initialLikeCount={post._count?.likes || 0}
                  size="sm"
                />

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {post.updatedAt && new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() + 60000
                      ? `Atualizado ${formatDistanceToNow(post.updatedAt)}`
                      : formatDistanceToNow(post.createdAt)}
                  </span>
                </div>
              </div>
            </CardFooter>

            <div className="p-4 pt-0">
              <Link href={`/noticias/${post.id}`}>
                <Button variant="ghost" className="w-full">
                  Leia mais
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {totalPages && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
