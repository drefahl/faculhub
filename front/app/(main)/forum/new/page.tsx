import { ThreadForm } from "@/app/(main)/forum/_components/thread-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nova Discussão - FaculHub",
  description: "Crie uma nova discussão no fórum",
}

export default function NewThreadPage() {
  return (
    <div className="py-4 sm:py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-bold">Nova Discussão</h1>
      <ThreadForm />
    </div>
  )
}
