import { Button } from "@/components/ui/button"
import { BookOpen, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center justify-center bg-gradient-to-b">
      <div className="flex flex-col items-center justify-center py-16 text-center md:py-24">
        <div className="relative mb-8 h-40 w-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-primary">404</span>
          </div>
          <div className="absolute -right-4 -top-4 rotate-12">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-2 -left-4 -rotate-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Página não encontrada</h1>

        <p className="mb-8 max-w-md text-xl text-muted-foreground">
          Ops! Parece que você se perdeu no campus virtual. Esta página não existe ou foi movida.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/forum">
              <Search className="h-4 w-4" />
              Explorar o fórum
            </Link>
          </Button>
        </div>

        <div className="mt-12 rounded-lg border bg-card p-6 text-left shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Você pode tentar:</h2>
          <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
            <li>Verificar se a URL está correta</li>
            <li>Explorar os recursos disponíveis no menu principal</li>
            <li>Buscar o conteúdo desejado no fórum de discussão</li>
            <li>
              <Link href="/contato" className="text-primary underline hover:text-primary/80">
                Entrar em contato com o suporte
              </Link>{" "}
              se você acredita que isso é um erro
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
