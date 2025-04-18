import { ForumHeader } from "@/app/(main)/forum/_components/forum-header"
import { ForumList } from "@/app/(main)/forum/_components/forum-list"
import { listThreads } from "@/lib/api/thread/thread"

export default async function ForumPage() {
  const threadListResponse = await listThreads({ page: 1, take: 10 })

  return (
    <div className="w-full px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <ForumHeader />
      <ForumList threads={threadListResponse} />
    </div>
  )
}
