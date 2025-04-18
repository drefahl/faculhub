"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Input } from "@/components/form/input"
import { Textarea } from "@/components/form/textarea"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { createThread } from "@/lib/api/thread/thread"
import { toast } from "sonner"

const createPostFormSchema = z.object({
  title: z.string().min(5, { message: "Título deve ter pelo menos 5 caracteres." }),
  content: z.string().min(10, { message: "Conteúdo deve ter pelo menos 10 caracteres." }),
})

type CreatePostFormValues = z.infer<typeof createPostFormSchema>

export function CreatePostForm() {
  const router = useRouter()

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  async function onSubmit({ content, title }: CreatePostFormValues) {
    try {
      await createThread({ content, title })

      toast.success("Discussão criada com sucesso!", { description: "Sua discussão foi publicada no fórum." })
      router.push("/forum")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao criar discussão", {
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Input name="title" label="Título" placeholder="Título da sua discussão" />

        <Textarea
          name="content"
          label="Conteúdo"
          placeholder="Escreva o conteúdo da sua discussão aqui..."
          className="min-h-[200px]"
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>

          <SubmitButton pendingCallback={() => "Publicando..."}>Publicar Discussão</SubmitButton>
        </div>
      </form>
    </Form>
  )
}
