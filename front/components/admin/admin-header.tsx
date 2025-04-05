import { MobileSidebar } from "@/components/admin/mobile-sidebar"
import { UserAccountNav } from "@/components/user-account-nav"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <Link href="/admin" className="font-bold">
            FaculHub Admin
          </Link>
        </div>
        <UserAccountNav />
      </div>
    </header>
  )
}
