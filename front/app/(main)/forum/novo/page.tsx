import type { Metadata } from "next"
import { CreatePostForm } from "@/components/forum/create-post-form"

export const metadata: Metadata = {
  title: "Nova Discussão - FaculHub",
  description: "Crie uma nova discussão no fórum",
}

export default function NewPostPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Nova Discussão</h1>
        <CreatePostForm />
      </div>
    </div>
  )
}
