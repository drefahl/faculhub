import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"
import type React from "react"

interface BaseEmailProps {
  previewText: string
  children: React.ReactNode
}

export const BaseEmail: React.FC<BaseEmailProps> = ({ previewText, children }) => {
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f8fafc] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#e6e6e6] rounded-lg my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
            <Section className="mt-[32px]">
              <Img
                src="https://via.placeholder.com/200x60?text=Faculhub"
                width="200"
                height="60"
                alt="Faculhub"
                className="mx-auto"
              />
            </Section>
            <Hr className="border border-solid border-[#e6e6e6] my-[26px] mx-0 w-full" />

            <Section>{children}</Section>

            <Hr className="border border-solid border-[#e6e6e6] my-[26px] mx-0 w-full" />
            <Section>
              <Text className="text-[#64748b] text-[12px] text-center mt-[16px]">
                © {currentYear} Faculhub. Todos os direitos reservados.
              </Text>

              <Text className="text-[#64748b] text-[12px] text-center">
                123 Avenida da Universidade, Distrito do Campus, Cidade da Educação
              </Text>

              <Text className="text-[#64748b] text-[12px] text-center">
                <Link href="https://faculhub.com/privacy" className="text-[#8b5cf6] underline">
                  Política de Privacidade
                </Link>{" "}
                •{" "}
                <Link href="https://faculhub.com/terms" className="text-[#8b5cf6] underline">
                  Termos de Serviço
                </Link>{" "}
                •{" "}
                <Link href="https://faculhub.com/unsubscribe" className="text-[#8b5cf6] underline">
                  Cancelar Subscrição
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default BaseEmail
