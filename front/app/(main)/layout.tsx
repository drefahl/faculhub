import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"
import type React from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 sm:h-16 items-center justify-between py-2 sm:py-4 gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <MainNav />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <ThemeToggle />
            <UserAccountNav />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full container flex flex-col">{children}</main>

      <SiteFooter />
    </div>
  )
}
