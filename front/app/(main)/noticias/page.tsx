import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSession } from "@/lib/utils/token"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { NewsBoard } from "./_components/news-board"

export default async function NewsPage() {
  const session = await getSession()
  const isAdmin = session?.role === "ADMIN"

  return (
    <div className="py-6 md:py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quadro de Notícias & Atividades</h1>
          <p className="text-muted-foreground mt-1">Fique atualizado com os últimos anúncios e eventos</p>
        </div>

        {isAdmin && (
          <Link href="/noticias/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar Publicação
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas as Publicações</TabsTrigger>
          <TabsTrigger value="announcements">Anúncios</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NewsBoard />
        </TabsContent>

        <TabsContent value="announcements">
          <NewsBoard type="NEWS" />
        </TabsContent>

        <TabsContent value="events">
          <NewsBoard type="EVENT" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
