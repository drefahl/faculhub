import { getSession } from "@/lib/utils/token"
import { NewsTabs } from "./_components/news-tabs"

export default async function NewsPage() {
  const session = await getSession()
  const isAdmin = session?.role === "ADMIN"

  return <NewsTabs isAdmin={isAdmin} />
}
