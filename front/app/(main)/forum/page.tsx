import { ForumHeader } from "@/components/forum/forum-header"
import { ForumList } from "@/components/forum/forum-list"

export default function ForumPage() {
  return (
    <div className="container py-8">
      <ForumHeader />
      <ForumList />
    </div>
  )
}
