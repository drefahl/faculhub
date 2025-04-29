import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/utils/token"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: MessageSquare,
    title: "Fórum de Discussão",
    description: "Conecte-se com outros alunos e participe de discussões acadêmicas.",
    href: "/forum",
  },
  // {
  //   icon: BookOpen,
  //   title: "Materiais de Estudo",
  //   description: "Compartilhe e acesse materiais de estudo para suas disciplinas.",
  //   href: "/materiais",
  // },
  // {
  //   icon: Car,
  //   title: "Caronas",
  //   description: "Encontre ou ofereça caronas para a faculdade e economize.",
  //   href: "/caronas",
  // },
  // {
  //   icon: Users,
  //   title: "Grupos de Estudo",
  //   description: "Crie ou participe de grupos de estudo para aprender em conjunto.",
  //   href: "/grupos",
  // },
  // {
  //   icon: Building,
  //   title: "Moradia Compartilhada",
  //   description: "Encontre pessoas para dividir moradia próxima à faculdade.",
  //   href: "/moradia",
  // },
]

export default async function HomePage() {
  const session = await getSession()

  return (
    <>
      <section className="w-full py-6 sm:py-10 md:py-16 lg:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Bem-vindo ao FaculHub
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl">
                Sua plataforma completa para conectar estudantes e facilitar a vida acadêmica.
              </p>
            </div>
            {!session && (
              <div className="flex flex-col gap-3 sm:flex-row mt-6 w-full sm:w-auto">
                <Button asChild size="lg" className="rounded-full px-4 sm:px-6 w-full sm:w-auto">
                  <Link href="/register">Criar Conta</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-full px-4 sm:px-6 w-full sm:w-auto">
                  <Link href="/sobre">Saiba Mais</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-6 sm:py-10 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 md:mb-10">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl">Recursos do FaculHub</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg">
                Tudo o que você precisa para uma experiência acadêmica completa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="flex flex-col items-center space-y-2 sm:space-y-3 rounded-xl border p-4 sm:p-5 md:p-6 transition-all hover:shadow-md hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
              >
                <div className="rounded-full border p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/30">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-xs sm:text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
