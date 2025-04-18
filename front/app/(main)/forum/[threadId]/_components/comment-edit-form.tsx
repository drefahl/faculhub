"use client"

import { Textarea } from "@/components/form/textarea"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { updateComment } from "@/lib/api/comment/comment"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const updateCommentSchema = z.object({
  content: z.string().trim().min(1, { message: "O comentário não pode estar vazio." }),
})

type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>

interface Comment {
  id: number
  content: string
  createdAt: string | Date
  author: {
    id: number
    name: string
    profilePicId: string | null
  }
}

interface CommentEditFormProps {
  comment: Comment
  onCancel: () => void
}

export function CommentEditForm({ comment, onCancel }: CommentEditFormProps) {
  const form = useForm<UpdateCommentFormValues>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment.content,
    },
  })

  const onSubmit = async ({ content }: UpdateCommentFormValues) => {
    try {
      await updateComment(comment.id, { content })

      onCancel()
    } catch (error) {
      console.error("Failed to update comment:", error)
    }
  }

  const content = form.watch("content")
  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="p-4 pt-4">
          <Textarea name="content" className="min-h-[100px] resize-y" autoFocus />
        </CardContent>

        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>

          <SubmitButton disabled={!content.trim() || content === comment.content} pendingCallback={() => "Salvando..."}>
            Salvar
          </SubmitButton>
        </CardFooter>
      </form>
    </Form>
  )
}
