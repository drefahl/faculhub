import { ForumList } from "@/app/(main)/forum/_components/forum-list"
import { listThreads } from "@/lib/api/thread/thread"
import { ForumHeader } from "./_components/forum-header"

interface ForumPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const [resolvedSearchParams] = await Promise.all([searchParams])

  const threadListResponse = await listThreads({ page: 1, take: 10, search: resolvedSearchParams.search })

  return (
    <div className="w-full py-4 sm:py-6 md:py-8">
      <ForumHeader />
      <ForumList threads={threadListResponse} />
    </div>
  )
}
