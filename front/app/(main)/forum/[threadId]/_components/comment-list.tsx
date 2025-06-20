"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MarkdownViewer } from "@/components/ui/markdown-viewer"
import { deleteComment } from "@/lib/api/react-query/comment"
import { formatDistanceToNow } from "@/lib/utils/date.utils"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import type { Session } from "@/types"
import { sendGAEvent } from "@next/third-parties/google"
import { Edit, MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"
import { CommentEditForm } from "./comment-edit-form"

export interface Comment {
  id: number
  content: string
  createdAt: string | Date
  updatedAt?: string | Date
  author: {
    id: number
    name: string
    profilePicId: string | null
  }
}

interface CommentListProps {
  comments: Comment[]
  threadId: number
  session: Session | null
}

export function CommentList({ comments, threadId, session }: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [deletingCommentIds, setDeletingCommentIds] = useState<number[]>([])

  const currentUserId = session?.id || 0
  const isAdmin = session?.role === "ADMIN"

  const handleEditComment = (commentId: number) => {
    setEditingCommentId(commentId)

    sendGAEvent("event", "comment_edit_clicked", { comment_id: commentId, thread_id: threadId })
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
  }

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentIds((prev) => [...prev, commentId])

    sendGAEvent("event", "comment_delete_started", { comment_id: commentId, thread_id: threadId })

    try {
      await deleteComment(commentId)
      sendGAEvent("event", "comment_deleted", { comment_id: commentId, thread_id: threadId })
    } catch (error) {
      console.error("Failed to delete comment:", error)
    } finally {
      setDeletingCommentIds((prev) => prev.filter((id) => id !== commentId))
    }
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isCommentAuthor = comment.author.id === currentUserId
        const canModify = isCommentAuthor || isAdmin
        const isDeleting = deletingCommentIds.includes(comment.id)
        const isEdited = comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.createdAt)

        return (
          <Card key={comment.id} className="overflow-hidden">
            {editingCommentId === comment.id ? (
              <CommentEditForm comment={comment} onCancel={handleCancelEdit} />
            ) : (
              <>
                <CardContent className="p-4 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getProfilePicUrl(comment.author.profilePicId) || ""}
                          alt={comment.author.name}
                        />
                        <AvatarFallback>{getUserInitials(comment.author.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(comment.createdAt)}</span>
                          {isEdited && comment.updatedAt && (
                            <span className="italic">(editado {formatDistanceToNow(comment.updatedAt)} )</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {canModify && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isCommentAuthor && (
                            <DropdownMenuItem onClick={() => handleEditComment(comment.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={isDeleting}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <MarkdownViewer markdown={comment.content} />
                </CardContent>
              </>
            )}
          </Card>
        )
      })}
    </div>
  )
}
