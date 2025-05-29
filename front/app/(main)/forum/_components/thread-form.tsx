"use client"

import { Input } from "@/components/form/input"
import { MarkdownEditor } from "@/components/form/markdown-editor"
import { MultiSelect } from "@/components/form/multi-select"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import type { GetThreadById200 } from "@/lib/api/axios/generated.schemas"
import { useListCategories } from "@/lib/api/react-query/category"
import { createThread, getListThreadsQueryKey, updateThread } from "@/lib/api/react-query/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendGAEvent } from "@next/third-parties/google"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const createThreadFormSchema = z.object({
  title: z.string().min(5, { message: "Título deve ter pelo menos 5 caracteres." }),
  content: z.string().min(10, { message: "Conteúdo deve ter pelo menos 10 caracteres." }),
  categories: z.array(z.coerce.number().int().positive()).optional(),
})

type ThreadFormValues = z.infer<typeof createThreadFormSchema>

interface ThreadFormProps {
  thread?: GetThreadById200
}

export function ThreadForm({ thread }: ThreadFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: categories } = useListCategories()

  const form = useForm<ThreadFormValues>({
    resolver: zodResolver(createThreadFormSchema),
    defaultValues: {
      title: thread?.title || "",
      content: thread?.content || "",
      categories: thread?.categories.map((category) => category.id) || [],
    },
  })

  const isEditMode = !!thread

  async function onSubmit({ content, title, categories }: ThreadFormValues) {
    try {
      if (isEditMode) {
        const threadId = thread?.id
        if (!threadId) throw new Error("ID da discussão não encontrado")

        await updateThread(threadId, { content, title, categories })

        sendGAEvent({
          event: "forum_thread_edited",
          params: {
            thread_id: thread?.id,
            title,
            categories: categories?.join(","),
          },
        })

        toast.success("Discussão editada com sucesso!", { description: "Sua discussão foi editada no fórum." })
        router.push(`/forum/${threadId}`)
        return
      }

      await createThread({ content, title, categories })
      await queryClient.invalidateQueries({ queryKey: getListThreadsQueryKey({} as any) })

      sendGAEvent({
        event: "forum_thread_created",
        params: {
          title,
          categories: categories?.join(","),
        },
      })

      toast.success("Discussão criada com sucesso!", { description: "Sua discussão foi publicada no fórum." })
      router.push("/forum")
    } catch (error) {
      toast.error(isEditMode ? "Erro ao editar discussão" : "Erro ao criar discussão", {
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {categories && categories?.length > 0 && (
          <MultiSelect
            name="categories"
            label="Categorias"
            placeholder="Selecione as categorias da sua discussão"
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        )}

        <Input name="title" label="Título" placeholder="Título da sua discussão" />

        <MarkdownEditor name="content" label="Conteúdo" placeholder="Escreva o conteúdo da sua discussão aqui..." />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>

          <SubmitButton pendingCallback={() => "Publicando..."}>
            {isEditMode ? "Salvar" : "Publicar"} Discussão
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
