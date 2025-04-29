"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ForumHeaderProps {
  initialQuery?: string
}

export function ForumHeader({ initialQuery = "" }: ForumHeaderProps) {
  const router = useRouter()

  //TODO: router.refresh() is not working as expected
  const onSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search)
    if (query) {
      params.set("search", query)
    } else {
      params.delete("search")
    }

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 items-center justify-between">
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
        <ForumSearch onSearch={onSearch} initialQuery={initialQuery} />
      </div>
    </div>
  )
}

interface ForumSearchProps {
  onSearch: (query: string) => void
  initialQuery?: string
  placeholder?: string
}

export function ForumSearch({ onSearch, initialQuery = "", placeholder = "Buscar discussões..." }: ForumSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Buscar discussões"
      />
    </div>
  )
}
