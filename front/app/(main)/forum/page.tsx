import { ForumList } from "@/app/(main)/forum/_components/forum-list"
import { ForumHeader } from "./_components/forum-header"

export default async function ForumPage() {
  return (
    <div className="w-full py-4 sm:py-6 md:py-8">
      <ForumHeader />
      <ForumList />
    </div>
  )
}
