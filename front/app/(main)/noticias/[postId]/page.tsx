import { LikeButton } from "@/components/like-button"
import { ReadOnlyViewer } from "@/components/read-only-viewer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { recordPostView } from "@/lib/api/react-query/post"
import { formatDistanceToNow } from "@/lib/utils/date.utils"
import { getSession } from "@/lib/utils/token"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { Calendar, MapPin, Pin } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const postParams = await params
  const postId = Number(postParams.postId)

  const [post] = await Promise.all([recordPostView(postId)])
  if (!post) return notFound()

  const session = await getSession()
  const isAdmin = session?.role === "ADMIN"

  return (
    <div className="py-6 md:py-10">
      <div className="mb-6">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          ← Voltar para o Quadro de Notícias
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant={post.type === "NEWS" ? "default" : "secondary"}>
          {post.type === "NEWS" ? "Anúncio" : "Evento"}
        </Badge>

        {post.courses.map((course) => (
          <Badge key={course.id} variant="outline" className="text-xs">
            {course.code}
          </Badge>
        ))}

        {post.isPinned && (
          <div className="flex items-center text-muted-foreground">
            <Pin className="h-4 w-4 mr-1" />
            <span className="text-xs">Fixado</span>
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{post.title}</h1>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={getProfilePicUrl(post.author.profilePicId) || ""} />
            <AvatarFallback>{getUserInitials(post.author.name)}</AvatarFallback>
          </Avatar>

          <div>
            <div className="font-medium">{post.author.name}</div>
            <div className="text-sm text-muted-foreground">{formatDistanceToNow(post.createdAt)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LikeButton
            postId={postId}
            initialLiked={post.isLiked}
            initialLikeCount={post._count.likes || 0}
            isAuthenticated={!!session}
            size="md"
          />

          {isAdmin && (
            <Link href={`/edit/${post.id}`}>
              <Button variant="outline">Editar Postagem</Button>
            </Link>
          )}
        </div>
      </div>

      {post.type === "EVENT" && post.eventDate && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted rounded-lg mb-8">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Data</div>
              <div className="font-medium">
                {new Date(post.eventDate).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {post.location && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Local</div>
                <div className="font-medium">{post.location}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <ReadOnlyViewer content={post.content} />
    </div>
  )
}
