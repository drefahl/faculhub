import { getThreadById } from "@/lib/api/react-query/thread"
import { notFound } from "next/navigation"
import { ThreadDetail } from "./_components/thread-details"

interface ForumPageProps {
  params: Promise<{ threadId: number }>
}

export default async function ForumPage({ params }: ForumPageProps) {
  const [resolvedParams] = await Promise.all([params])

  if (!Number.isInteger(Number(resolvedParams.threadId))) {
    throw new Error("Invalid thread ID")
  }

  const thread = await getThreadById(resolvedParams.threadId)
  if (!thread) return notFound()

  return <ThreadDetail thread={thread} />
}
