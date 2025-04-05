"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Select } from "@/components/form/select"
import { Switch } from "@/components/form/switch"
import { SubmitButton } from "@/components/submit-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"

const preferencesFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean().default(true),
})

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>

export function PreferencesForm() {
  const { theme, setTheme } = useTheme()

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
      emailNotifications: true,
    },
  })

  async function onSubmit(data: PreferencesFormValues) {
    setTheme(data.theme)
    toast.success("Preferências atualizadas", { description: "Suas preferências foram atualizadas com sucesso." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Personalize sua experiência no FaculHub</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Select
              name="theme"
              label="Tema"
              placeholder="Selecione um tema"
              description="Escolha como o FaculHub deve aparecer para você."
              options={[
                { value: "light", label: "Claro" },
                { value: "dark", label: "Escuro" },
                { value: "system", label: "Sistema" },
              ]}
            />

            <Switch
              name="emailNotifications"
              label="Notificações por Email"
              description="Receba atualizações sobre atividades relevantes."
            />

            <div className="flex justify-end">
              <SubmitButton>Salvar preferências</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
