"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, Building, Car, MessageSquare, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: BarChart3,
      active: pathname === "/admin",
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: Users,
      active: pathname === "/admin/usuarios",
    },
    {
      href: "/admin/forum",
      label: "Fórum",
      icon: MessageSquare,
      active: pathname === "/admin/forum",
    },
    {
      href: "/admin/materiais",
      label: "Materiais",
      icon: BookOpen,
      active: pathname === "/admin/materiais",
    },
    {
      href: "/admin/caronas",
      label: "Caronas",
      icon: Car,
      active: pathname === "/admin/caronas",
    },
    {
      href: "/admin/grupos",
      label: "Grupos",
      icon: Users,
      active: pathname === "/admin/grupos",
    },
    {
      href: "/admin/moradia",
      label: "Moradia",
      icon: Building,
      active: pathname === "/admin/moradia",
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: Settings,
      active: pathname === "/admin/configuracoes",
    },
  ]

  return (
    <nav className="hidden w-full flex-col md:flex">
      <div className="space-y-1 py-2">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "secondary" : "ghost"}
            className={cn("w-full justify-start", route.active && "bg-muted font-medium")}
            asChild
          >
            <Link href={route.href} className="flex items-center gap-2">
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
