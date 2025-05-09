"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Input } from "@/components/form/input"
import { SubmitButton } from "@/components/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { refresh } from "@/lib/api/axios/auth"
import { useUpdateUserProfile } from "@/lib/api/react-query/user"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import type { Session } from "@/types"
import { useRouter } from "next/navigation"
import { ProfileImageUpload } from "./profile-image-upload"

interface ProfileFormProps {
  session: Session
}

const profileFormSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }).max(50, {
    message: "Nome não pode ter mais de 50 caracteres.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ session }: ProfileFormProps) {
  const router = useRouter()

  const { mutate: updateProfile, isPending } = useUpdateUserProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session.name || "",
    },
  })

  function onSubmit(data: ProfileFormValues) {
    updateProfile(
      { data },
      {
        onSuccess: async () => {
          await refresh({ withCredentials: true })
          toast.success("Perfil atualizado", {
            description: "Suas informações pessoais foram atualizadas com sucesso.",
          })
          router.refresh()
        },
        onError: (error) => {
          toast.error("Erro ao atualizar perfil", {
            description: error.message || "Algo deu errado",
          })
        },
      },
    )
  }

  const initials = getUserInitials(session.name)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize suas informações pessoais e como você aparece para outros usuários</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={getProfilePicUrl(session.picture) || ""} alt={session.name || "Avatar"} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <ProfileImageUpload />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input name="name" label="Nome" placeholder="Seu nome" />

            <div className="flex justify-end">
              <SubmitButton>{isPending ? "Salvando..." : "Salvar alterações"}</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
