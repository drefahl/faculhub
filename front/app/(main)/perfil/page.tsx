import { PasswordForm } from "@/app/(main)/perfil/_components/password-form"
import { ProfileForm } from "@/app/(main)/perfil/_components/profile-form"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile } from "@/lib/api/axios/user"
import { getSession } from "@/lib/utils/token"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [err, profile] = await getUserProfile()
  if (err || !profile) {
    redirect("/login")
  }

  return (
    <div className="space-y-6 py-4 sm:py-6 md:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações de conta</p>
        </div>
        <Separator />
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-6 py-4">
            <ProfileForm profile={profile} />
          </TabsContent>
          <TabsContent value="password" className="space-y-6 py-4">
            <PasswordForm session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Perfil - FaculHub",
  description: "Gerencie seu perfil no FaculHub",
}
