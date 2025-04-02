import { ForumList } from "@/components/forum/forum-list"
import { ForumHeader } from "@/components/forum/forum-header"

export default function ForumPage() {
  return (
    <div className="container py-8">
      <ForumHeader />
      <ForumList />
    </div>
  )
}
