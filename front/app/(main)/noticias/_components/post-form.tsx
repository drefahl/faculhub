"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { DatePicker } from "@/components/form/date-picker"
import { Editor } from "@/components/form/editor"
import { Input } from "@/components/form/input"
import { MultiSelect } from "@/components/form/multi-select"
import { Select } from "@/components/form/select"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { GetPostById200, ListCourses200Item } from "@/lib/api/axios/generated.schemas"
import { createPost, updatePost } from "@/lib/api/react-query/post"
import { createPostSchema } from "@/shared/schemas/post.schema"
import { toast } from "sonner"
import type { z } from "zod"

interface PostFormProps {
  post?: GetPostById200
  courses?: ListCourses200Item[]
}

const schema = createPostSchema.omit({ authorId: true })

type FormValues = z.infer<typeof schema>

export function PostForm({ post, courses = [] }: PostFormProps) {
  const router = useRouter()

  const defaultValues: Partial<FormValues> = {
    title: post?.title,
    type: post?.type,
    content: post?.content,
    isPinned: post?.isPinned,
    eventDate: post?.eventDate ? new Date(post.eventDate) : undefined,
    location: post?.location ?? "",
    courses: post?.courses.map((course) => course.id) ?? [],
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  console.log(form.watch(), form.formState.errors)

  async function onSubmit(values: FormValues) {
    try {
      if (post) {
        await updatePost(post.id, { ...values, eventDate: values.eventDate?.toISOString() })
        toast.success("Sucesso", { description: "Publicação atualizada com sucesso" })
      } else {
        await createPost({ ...values, eventDate: values.eventDate?.toISOString() })
        toast.success("Sucesso", { description: "Publicação criada com sucesso" })
      }

      router.back()
    } catch (error) {
      toast.error("Algo deu errado. Por favor, tente novamente.")
    }
  }

  const courseOptions =
    courses?.map((course) => ({
      value: course.id.toString(),
      label: course.code,
    })) ?? []

  const isEventType = form.watch("type") === "EVENT"

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Input name="title" label="Título" placeholder="Digite o título da publicação" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                name="type"
                label="Tipo"
                placeholder="Selecione o tipo de publicação"
                options={[
                  { value: "NEWS", label: "Anúncio" },
                  { value: "EVENT", label: "Evento" },
                ]}
              />

              <MultiSelect name="courses" label="Curso" placeholder="Selecione o curso" options={courseOptions} />
            </div>

            <Editor name="content" label="Conteúdo" placeholder="Digite o conteúdo da publicação" />

            {isEventType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DatePicker name="eventDate" label="Data do Evento" />

                <Input name="location" label="Local" placeholder="Digite o local do evento" />
              </div>
            )}

            <FormField
              control={form.control}
              name="isPinned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Fixar esta publicação</FormLabel>
                    <FormDescription>Publicações fixadas aparecerão no topo do quadro</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>

              <SubmitButton>{post ? "Atualizar Publicação" : "Criar Publicação"}</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
