import { listCourses } from "@/lib/api/react-query/course"
import { getSession } from "@/lib/utils/token"
import { redirect } from "next/navigation"
import { PostForm } from "../_components/post-form"

export default async function CreatePostPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/")
  }

  const courses = await listCourses()

  return (
    <div className="py-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Criar Nova Publicação</h1>
      <PostForm courses={courses ?? []} />
    </div>
  )
}
