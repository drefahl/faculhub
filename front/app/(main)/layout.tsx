import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"
import type React from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 space-y-4">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6 overflow-x-auto overflow-y-hidden">
          <MainNav />

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <UserAccountNav />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <SiteFooter />
    </div>
  )
}
