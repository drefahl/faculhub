"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, CalendarDays, Home, type LucideProps, MessageSquare } from "lucide-react"

type Route = {
  href: string
  label: string
  icon: React.ComponentType<LucideProps>
  active: boolean
}

export function MainNav() {
  const pathname = usePathname()

  const routes: Route[] = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/forum",
      label: "Fórum",
      icon: MessageSquare,
      active: pathname === "/forum",
    },
    {
      href: "/cursos",
      label: "Horário",
      icon: Calendar,
      active: pathname === "/cursos",
    },
    {
      href: "/noticias",
      label: "Notícias",
      icon: CalendarDays,
      active: pathname.startsWith("/noticias"),
    },
  ]

  return (
    <nav className="flex items-center overflow-x-auto scrollbar-hide">
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 min-w-max px-1">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            size="sm"
            asChild
            className="flex-shrink-0"
          >
            <Link
              href={route.href}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2",
                route.active ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              <route.icon className="h-4 w-4" />
              <span className="hidden sm:inline-block text-sm">{route.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
