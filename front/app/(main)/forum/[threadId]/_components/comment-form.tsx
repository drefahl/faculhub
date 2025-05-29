"use client"

import { MarkdownEditor } from "@/components/form/markdown-editor"
import { SubmitButton } from "@/components/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form } from "@/components/ui/form"
import { createComment } from "@/lib/api/react-query/comment"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import type { Session } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendGAEvent } from "@next/third-parties/google"
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
    sendGAEvent("event", "comment_create_started", {
      thread_id: threadId,
      content_length: content.length,
    })

    try {
      await createComment({ threadId, content, authorId: currentUserId })

      sendGAEvent("event", "comment_created", { thread_id: threadId, author_id: currentUserId })

      form.reset()
    } catch (error) {
      console.error("Failed to create comment:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getProfilePicUrl(currentUserProfilePic) || ""} alt={currentUserName} />
            <AvatarFallback>{getUserInitials(currentUserName)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <MarkdownEditor
              name="content"
              placeholder="Escreva um comentário..."
              defaultLayout="split-horizontal"
              className="w-full"
              minHeight={150}
            />
          </div>
        </div>

        <div className="flex justify-end w-full">
          <SubmitButton
            className="w-full lg:w-auto"
            disabled={!form.watch("content")}
            pendingCallback={() => "Enviando..."}
          >
            Comentar
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
