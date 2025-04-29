"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, Home, type LucideProps, MessageSquare } from "lucide-react"

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
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
          <Link
            href={route.href}
            className={cn(
              "flex items-center gap-2",
              route.active ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            <route.icon className="h-4 w-4" />
            <span className="hidden md:inline-block">{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}
