import { ThemeToggle } from "@/components/theme-toggle"
import type React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center relative">
      <ThemeToggle className="absolute top-4 right-4" />

      {children}
    </div>
  )
}
