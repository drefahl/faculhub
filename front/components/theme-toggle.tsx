"use client"

import { Button } from "@/components/ui/button"
import { useIsMounted } from "@/hooks/use-is-mouted"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()

  if (!useIsMounted()) return null

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-md", className)} onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
