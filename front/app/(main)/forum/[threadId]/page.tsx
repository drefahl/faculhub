import { getThreadById } from "@/lib/api/thread/thread"
import { ThreadDetail } from "./_components/thread-details"

export default async function ForumPage({ params }: { params: Promise<{ threadId: number }> }) {
  const resolvedParams = await params
  if (!Number.isInteger(Number(resolvedParams.threadId))) {
    throw new Error("Invalid thread ID")
  }

  const data = await getThreadById(resolvedParams.threadId)

  return <ThreadDetail thread={data} />
}
