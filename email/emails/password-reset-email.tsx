import { Button, Heading, Section, Text } from "@react-email/components"
import type React from "react"
import { BaseEmail } from "./base-email"

interface PasswordResetEmailProps {
  username: string
  resetUrl: string
  expiresAt: Date
}

export function PasswordResetEmail({ username, resetUrl, expiresAt }: PasswordResetEmailProps): React.ReactElement {
  if (!username || !resetUrl || !expiresAt) {
    throw new Error("Missing required props: username, resetUrl, or expiresAt")
  }

  const expiryHours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))
  if (expiryHours <= 0) {
    throw new Error("The expiration date must be in the future")
  }

  return (
    <BaseEmail previewText="Redefina a sua palavra-passe do Faculhub">
      <Heading className="text-[#8b5cf6] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Pedido de Redefinição de Palavra-Passe
      </Heading>

      <Text className="text-[#1e293b] text-[16px] leading-[24px]">Olá {username},</Text>

      <Text className="text-[#1e293b] text-[16px] leading-[24px]">
        Recebemos um pedido para redefinir a sua palavra-passe da sua conta Faculhub. Para proceder com a redefinição da
        sua palavra-passe, por favor clique no botão abaixo:
      </Text>

      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#8b5cf6] rounded-md text-white py-[12px] px-[20px] text-[16px] font-semibold no-underline text-center"
          href={resetUrl}
        >
          Redefinir Palavra-Passe
        </Button>
      </Section>

      <Text className="text-[#1e293b] text-[16px] leading-[24px]">
        Se não solicitou a redefinição da palavra-passe, pode ignorar este email. A sua palavra-passe permanecerá
        inalterada.
      </Text>

      <Text className="text-[#1e293b] text-[16px] leading-[24px]">
        Este link para redefinir a palavra-passe irá expirar em {expiryHours} horas.
      </Text>

      <Text className="text-[#64748b] text-[14px] italic mt-[32px] p-[16px] bg-[#f1f5f9] rounded-lg">
        Por razões de segurança, este link só pode ser utilizado uma vez. Se precisar de redefinir a sua palavra-passe
        novamente, por favor solicite um novo link.
      </Text>
    </BaseEmail>
  )
}

export default PasswordResetEmail
