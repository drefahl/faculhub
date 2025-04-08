import { ForumHeader } from "@/components/forum/forum-header"
import { ForumList } from "@/components/forum/forum-list"

export default function ForumPage() {
  return (
    <div className="w-full px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <ForumHeader />
      <ForumList />
    </div>
  )
}
