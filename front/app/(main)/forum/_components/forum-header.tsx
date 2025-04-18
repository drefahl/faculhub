"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ForumHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fórum de Discussão</h1>
          <p className="text-muted-foreground">Participe de discussões com outros estudantes</p>
        </div>
        <Button asChild>
          <Link href="/forum/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Discussão
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar discussões..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
