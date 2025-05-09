import { getPostById } from "@/lib/api/react-query/post"
import { getSession } from "@/lib/utils/token"
import { notFound, redirect } from "next/navigation"
import { PostForm } from "../../_components/post-form"

export default async function EditPostPage({ params }: { params: Promise<{ id: number }> }) {
  const session = await getSession()

  if (!session || session?.role !== "ADMIN") {
    redirect("/")
  }

  const post = await getPostById((await params).id)
  if (!post) return notFound()

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Post</h1>
      <PostForm post={post} />
    </div>
  )
}
