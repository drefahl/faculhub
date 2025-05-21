import { getThreadById } from "@/lib/api/axios/thread"
import { notFound } from "next/navigation"
import { ThreadForm } from "../../_components/thread-form"

export default async function EditThreadPage({ params }: { params: Promise<{ id: number }> }) {
  const [err, thread] = await getThreadById((await params).id)
  if (err) return notFound()

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Editar Discussão</h1>
      <ThreadForm thread={thread} />
    </div>
  )
}
