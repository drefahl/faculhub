"use client"

import { Textarea } from "@/components/form/textarea"
import { SubmitButton } from "@/components/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form } from "@/components/ui/form"
import { createComment } from "@/lib/api/comment/comment"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import type { Session } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const commentFormSchema = z.object({
  content: z.string().trim().min(1, { message: "O comentário não pode estar vazio." }),
})

type CommentFormValues = z.infer<typeof commentFormSchema>

interface CommentFormProps {
  threadId: number
  session: Session | null
}

export function CommentForm({ threadId, session }: CommentFormProps) {
  const currentUserId = session?.id || 0
  const currentUserName = session?.name || ""
  const currentUserProfilePic = session?.picture || null

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async ({ content }: CommentFormValues) => {
    try {
      await createComment({ threadId, content, authorId: currentUserId })

      form.reset()
    } catch (error) {
      console.error("Failed to create comment:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getProfilePicUrl(currentUserProfilePic) || ""} alt={currentUserName} />
            <AvatarFallback>{getUserInitials(currentUserName)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea name="content" placeholder="Escreva um comentário..." className="min-h-[100px] resize-y" />
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton disabled={!form.watch("content")} pendingCallback={() => "Enviando..."}>
            Comentar
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
