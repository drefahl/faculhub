import { getThreadById } from "@/lib/api/thread/thread"
import { ThreadDetail } from "./_components/thread-details"

interface ForumPageProps {
  params: Promise<{ threadId: number }>
}

export default async function ForumPage({ params }: ForumPageProps) {
  const [resolvedParams] = await Promise.all([params])

  if (!Number.isInteger(Number(resolvedParams.threadId))) {
    throw new Error("Invalid thread ID")
  }

  const data = await getThreadById(resolvedParams.threadId)

  return <ThreadDetail thread={data} />
}
