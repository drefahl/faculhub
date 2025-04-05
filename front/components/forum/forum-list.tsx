"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MessageSquare } from "lucide-react"

// Dados de exemplo - seriam substituídos por dados reais do banco
const MOCK_DISCUSSIONS = [
  {
    id: "1",
    title: "Como se preparar para as provas finais?",
    excerpt: "Estou com dificuldade em organizar meus estudos para as provas finais. Alguém tem dicas?",
    category: "academico",
    categoryLabel: "Acadêmico",
    author: {
      name: "João Silva",
      avatar: "",
    },
    createdAt: new Date(2023, 3, 15),
    commentsCount: 12,
    viewsCount: 45,
  },
  {
    id: "2",
    title: "Grupo para projeto de Engenharia de Software",
    excerpt: "Estou procurando pessoas para formar um grupo para o projeto final de Engenharia de Software.",
    category: "geral",
    categoryLabel: "Geral",
    author: {
      name: "Maria Oliveira",
      avatar: "",
    },
    createdAt: new Date(2023, 3, 10),
    commentsCount: 8,
    viewsCount: 32,
  },
  {
    id: "3",
    title: "Dúvida sobre matrícula no próximo semestre",
    excerpt: "Alguém sabe quando abre o período de matrícula para o próximo semestre?",
    category: "duvidas",
    categoryLabel: "Dúvidas",
    author: {
      name: "Pedro Santos",
      avatar: "",
    },
    createdAt: new Date(2023, 3, 5),
    commentsCount: 5,
    viewsCount: 28,
  },
]

export function ForumList() {
  const [discussions] = useState(MOCK_DISCUSSIONS)

  if (discussions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">Nenhuma discussão encontrada</h3>
        <p className="text-muted-foreground">Seja o primeiro a iniciar uma discussão!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {discussions.map((discussion) => (
        <Link key={discussion.id} href={`/forum/${discussion.id}`}>
          <Card className="transition-all hover:bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">
                  {discussion.categoryLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(discussion.createdAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              <CardTitle className="line-clamp-1">{discussion.title}</CardTitle>
              <CardDescription className="line-clamp-2">{discussion.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                  <AvatarFallback>
                    {discussion.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{discussion.author.name}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.commentsCount} comentários</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{discussion.viewsCount} visualizações</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
