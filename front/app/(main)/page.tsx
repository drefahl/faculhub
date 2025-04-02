import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Car, MessageSquare, Users, Building } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Fórum de Discussão",
      description: "Conecte-se com outros alunos e participe de discussões acadêmicas.",
      href: "/forum",
    },
    {
      icon: BookOpen,
      title: "Materiais de Estudo",
      description: "Compartilhe e acesse materiais de estudo para suas disciplinas.",
      href: "/materiais",
    },
    {
      icon: Car,
      title: "Caronas",
      description: "Encontre ou ofereça caronas para a faculdade e economize.",
      href: "/caronas",
    },
    {
      icon: Users,
      title: "Grupos de Estudo",
      description: "Crie ou participe de grupos de estudo para aprender em conjunto.",
      href: "/grupos",
    },
    {
      icon: Building,
      title: "Moradia Compartilhada",
      description: "Encontre pessoas para dividir moradia próxima à faculdade.",
      href: "/moradia",
    },
  ]

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Bem-vindo ao FaculHub</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Sua plataforma completa para conectar estudantes e facilitar a vida acadêmica.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Criar Conta</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sobre">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Recursos do FaculHub</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Tudo o que você precisa para uma experiência acadêmica completa.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:bg-muted"
              >
                <div className="rounded-full border p-2">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
